import * as z from 'zod/mini';
import { isEmpty } from '../../lib/isEmpty';
import { isObject } from '../../lib/isObject';

// Types
export const apiSchema = z.looseObject({
  summary: z.nullish(z.any()),
  security: z.nullish(z.any()),
  parameters: z.nullish(z.any()),
  requestBody: z.nullish(
    z.looseObject({
      required: z.nullish(z.any()),
      content: z.nullish(
        z.looseObject({
          'application/json': z.nullish(
            z.looseObject({
              schema: z.nullish(
                z.looseObject({
                  $ref: z.nullish(z.string()),
                }),
              ),
            }),
          ),
        }),
      ),
    }),
  ),
  responses: z.nullish(
    z.record(
      z.string(), // 200, 201, 204, 400, 404,...
      z.looseObject({
        description: z.nullish(z.string()),
        content: z.nullish(
          z.looseObject({
            'application/json': z.nullish(
              z.looseObject({
                schema: z.nullish(
                  z.looseObject({
                    $ref: z.nullish(z.string()),
                  }),
                ),
              }),
            ),
          }),
        ),
      }),
    ),
  ),
});

export const openAPIFileSchema = z.looseObject({
  openapi: z.nullish(z.string()),
  servers: z.nullish(z.any()),
  security: z.nullish(z.any()),
  paths: z.record(
    z.string(),
    z.looseObject({
      parameters: z.nullish(z.any()),
      get: z.nullish(apiSchema),
      post: z.nullish(apiSchema),
      put: z.nullish(apiSchema),
      patch: z.nullish(apiSchema),
      delete: z.nullish(apiSchema),
    }),
  ),
  components: z.nullish(
    z.looseObject({
      securitySchemes: z.nullish(z.any()),
      schemas: z.nullish(z.record(z.string(), z.nullish(z.looseObject({})))),
    }),
  ),
});

export type OpenAPIFileSchema = z.infer<typeof openAPIFileSchema>;

export type PathNode = {
  path: string;
  method: string;
  parameters?: Property[];
  requestBody?: RequestBody;
  responses?: Response[];
  rawDefinition: any;
};

export type RequestBody = {
  schema?: Schema;
  flattenRefs: Set<ComponentNode>;
} & Omit<ComponentNode, 'rawDefinition'>;

export type Response = {
  status: string;
  schema?: Schema;
  flattenRefs: Set<ComponentNode>;
} & Omit<ComponentNode, 'rawDefinition'>;

export type ComponentNode = {
  name: string;
  rawDefinition: any;
  enums?: string | null;
  paths?: Set<PathNode>;
  parents?: Set<ComponentNode | PathNode>;
  properties?: Property[];
  allOf?: Combinator[];
  oneOf?: Combinator[];
  refs?: ComponentNode[];
};

export type Combinator = string | Property[];

export type Schema = Omit<Property, 'name'>;

export type Property = {
  name: string;
  type?: string | null;
  isRef?: boolean;
  properties?: Property[];
  allOf?: Combinator[];
  oneOf?: Combinator[];
  isRequired?: boolean;
};

export type Store = {
  fileName?: string;
  fileContent?: string;
  doc?: OpenAPIFileSchema;
  pathsTree?: Record<string, PathNode>;
  components?: Record<string, ComponentNode>;
};

// Utils
export const buildTreeOfFile = async (fileObject: OpenAPIFileSchema) => {
  const pathsTree: Record<string, PathNode> = {};
  const components: Record<string, ComponentNode> = {};

  for (const [path, pathDefinition] of Object.entries(fileObject.paths)) {
    for (const [key, definition] of Object.entries(pathDefinition)) {
      try {
        // Path node
        const httpMethod = key;
        const apiDefinition = await apiSchema.parseAsync(definition);

        const pathNode: PathNode = {
          path,
          method: httpMethod,
          parameters: [],
          requestBody: undefined,
          responses: [],
          rawDefinition: definition,
        };

        // Parameters
        pathNode.parameters = getParameters(apiDefinition.parameters);

        // Body
        const requestBodySchema =
          apiDefinition.requestBody?.content?.['application/json']?.schema;
        const request: RequestBody = {
          name: 'Request',
          parents: new Set([pathNode]),
          paths: new Set([pathNode]),
          refs: [],
          flattenRefs: new Set(),
        };

        const requestBodyProperty = getProperty('schema', requestBodySchema);
        if (requestBodyProperty) {
          request.schema = requestBodyProperty;
        }

        const bodyRefPaths = findAllRefPaths(apiDefinition.requestBody);
        for (const bodyRefPath of bodyRefPaths) {
          const bodyRefObj = getObjectFromRefPath(fileObject, bodyRefPath);
          const refObjectBodyTree = buildTreeOfComponent({
            fileObject,
            obj: bodyRefObj,
            path: pathNode,
            parent: pathNode,
            components,
            flattenRefs: request.flattenRefs,
          });
          if (refObjectBodyTree) {
            request.refs?.push(refObjectBodyTree);
          }
        }
        pathNode.requestBody = request;

        // Reponses
        if (apiDefinition.responses) {
          const responses: Response[] = [];

          for (const [status, responseObj] of Object.entries(
            apiDefinition.responses,
          )) {
            const responseSchema =
              responseObj.content?.['application/json']?.schema;
            const response: Response = {
              status,
              name: 'Response',
              parents: new Set([pathNode]),
              paths: new Set([pathNode]),
              refs: [],
              flattenRefs: new Set(),
            };

            const responseProperty = getProperty('schema', responseSchema);
            if (responseProperty) {
              response.schema = responseProperty;
            }

            const responseRefPaths = findAllRefPaths(responseObj);
            for (const responseRefPath of responseRefPaths) {
              const responseRefObj = getObjectFromRefPath(
                fileObject,
                responseRefPath,
              );
              const refObjectResponseTree = buildTreeOfComponent({
                fileObject,
                obj: responseRefObj,
                path: pathNode,
                parent: pathNode,
                components,
                flattenRefs: response.flattenRefs,
              });

              if (refObjectResponseTree) {
                response.refs?.push(refObjectResponseTree);
              }
            }

            responses.push(response);
          }

          pathNode.responses = responses;
        }

        pathsTree[`${pathNode.method.toUpperCase()} ${pathNode.path}`] =
          pathNode;
      } catch (_) {}
    }
  }

  return { pathsTree, components };
};

/**
 * Build doubly linked tree of component
 * @param {Object} param
 * @param param.fileObject - parsed object of openAPI yaml file
 * @param param.obj - object to build tree from, have the following structure: {[objectName]: object}
 * @param param.parent - object to build tree from
 * @param param.components - record of all tree nodes, also for prevent circular recursion
 * @param param.flattenRefs - list of ref objects, flatten in a Set instead of ref (a tree)
 * @returns doubly linked tree of that component
 */
type BuildTreeOfComponentParam = {
  fileObject: OpenAPIFileSchema;
  obj: any;
  parent: PathNode | ComponentNode;
  path: PathNode;
  components: Record<string, ComponentNode>;
  flattenRefs: Set<ComponentNode>;
};
const buildTreeOfComponent = ({
  fileObject,
  obj,
  path,
  parent,
  components,
  flattenRefs,
}: BuildTreeOfComponentParam) => {
  // Make sure object is not empty and is an actual object
  if (!isObject(obj) || isEmpty(obj)) {
    return;
  }

  // This is for prevent circular recursion and for doubly link: link to its parent and path
  const componentName = Object.keys(obj)[0];
  if (components[componentName]) {
    const componentNode = components[componentName];
    componentNode.parents?.add(parent);
    addPathToComponentAndAllItsRef(componentNode, path);
    addComponentAndAllItsRefToFlattenRefs(componentNode, flattenRefs);
    return components[componentName];
  }

  // Component node
  const componentDetail = Object.values(obj)[0];
  const componentNode: ComponentNode = {
    name: componentName,
    rawDefinition: obj,
    enums: getEnumProperty(componentName, obj[componentName])?.type,
    paths: new Set([path]),
    parents: new Set([parent]),
    properties: getProperties(componentDetail),
    allOf: getAllOf(componentDetail),
    oneOf: getOneOf(componentDetail),
    refs: [],
  };

  components[componentName] = componentNode;

  // Recursion
  const refPaths = findAllRefPaths(obj);
  for (const refPath of refPaths) {
    const refObj = getObjectFromRefPath(fileObject, refPath);
    const refObjTree = buildTreeOfComponent({
      fileObject,
      obj: refObj,
      path,
      parent: componentNode,
      components,
      flattenRefs,
    });

    if (refObjTree) {
      flattenRefs.add(refObjTree);
      componentNode.refs?.push(refObjTree);
    }
  }

  return componentNode;
};

const addPathToComponentAndAllItsRef = (
  component: ComponentNode,
  path: PathNode,
) => {
  component.paths?.add(path);

  if (component.refs) {
    for (const children of component.refs) {
      addPathToComponentAndAllItsRef(children, path);
    }
  }
};

const addComponentAndAllItsRefToFlattenRefs = (
  component: ComponentNode,
  flattenRefs: Set<ComponentNode>,
) => {
  flattenRefs.add(component);

  if (component.refs) {
    for (const children of component.refs) {
      addComponentAndAllItsRefToFlattenRefs(children, flattenRefs);
    }
  }
};

const parameterPropertySchema = z.array(
  z.looseObject({
    name: z.string(),
    in: z.nullish(z.string()),
    description: z.nullish(z.string()),
    schema: z.nullish(
      z.looseObject({
        type: z.nullish(z.string()),
        enum: z.nullish(z.array(z.string())),
      }),
    ),
  }),
);

const getParameters = (obj: any) => {
  try {
    const parameters = parameterPropertySchema.parse(obj);

    const properties: Property[] = [];
    for (const parameter of parameters) {
      if (parameter.schema?.enum) {
        properties.push({
          name: parameter.name,
          type: parameter.schema.enum.join(' | '),
        });
      } else {
        properties.push({
          name: parameter.name,
          type: parameter.schema?.type,
        });
      }
    }

    return properties;
  } catch (_) {}

  return undefined;
};

const objectPropertySchema = z.looseObject({
  type: z.literal('object'),
  required: z.nullish(z.array(z.string())),
  properties: z.record(
    z.string(),
    z.looseObject({
      type: z.nullish(z.string()),
      $ref: z.nullish(z.string()),
      allOf: z.nullish(z.any()),
      oneOf: z.nullish(z.any()),
    }),
  ),
});

const arrayPropertySchema = z.looseObject({
  type: z.literal('array'),
  items: z.looseObject({
    type: z.nullish(z.string()),
    $ref: z.nullish(z.string()),
  }),
});

const enumPropertySchema = z.looseObject({
  type: z.any(),
  enum: z.array(z.string()),
});

const getProperties = (obj: any) => {
  try {
    const properties: Property[] = [];

    const component = objectPropertySchema.parse(obj);
    const componentProperties = component.properties;
    if (!componentProperties) {
      return [];
    }

    for (const [name, propertyDefinition] of Object.entries(
      componentProperties,
    )) {
      const property = getProperty(name, propertyDefinition);
      property &&
        properties.push({
          ...property,
          isRequired:
            component.required?.findIndex(
              (requiredProperty) => requiredProperty === name,
            ) !== -1,
        });
    }

    return properties;
  } catch (_) {}
};

const getProperty = (
  propertyName: string,
  propertyDefinition: any,
): Property | undefined => {
  if (!propertyDefinition || isEmpty(propertyDefinition)) {
    return;
  }

  // Handle array
  try {
    const arrayProperty = arrayPropertySchema.parse(propertyDefinition);
    if (arrayProperty.items.$ref) {
      return {
        name: propertyName,
        type: `${getObjectNameFromRefPath(arrayProperty.items.$ref)}[]`,
        isRef: true,
      };
    } else if (arrayProperty.items.type === 'object') {
      return {
        name: propertyName,
        type: `${arrayProperty.items.type}[]`,
        properties: getProperties(arrayProperty.items),
      };
    } else {
      return {
        name: propertyName,
        type: `${arrayProperty.items.type}[]`,
      };
    }
  } catch (_) {}

  // Handle nested object
  try {
    const objectProperty = objectPropertySchema.parse(propertyDefinition);
    return {
      name: propertyName,
      type: 'object',
      properties: getProperties(objectProperty),
    };
  } catch (_) {}

  // Handle allOf
  if (propertyDefinition.allOf) {
    return {
      name: propertyName,
      type: 'allOf',
      allOf: getAllOf(propertyDefinition),
    };
  }

  // Handle oneOf
  if (propertyDefinition.oneOf) {
    return {
      name: propertyName,
      type: 'oneOf',
      oneOf: getOneOf(propertyDefinition),
    };
  }

  // Handle enum
  const enumProperty = getEnumProperty(propertyName, propertyDefinition);
  if (enumProperty) {
    return enumProperty;
  }

  // Handle string, number, ref object
  if (propertyDefinition.$ref) {
    return {
      name: propertyName,
      type: getObjectNameFromRefPath(propertyDefinition.$ref),
      isRef: true,
    };
  } else {
    return {
      name: propertyName,
      type: propertyDefinition.type,
    };
  }
};

const allOfObjectSchema = z.looseObject({
  allOf: z.array(
    z.union([
      z.looseObject({
        $ref: z.string(),
      }),
      objectPropertySchema,
    ]),
  ),
});

const oneOfObjectSchema = z.looseObject({
  oneOf: z.array(
    z.union([
      z.looseObject({
        $ref: z.string(),
      }),
      objectPropertySchema,
    ]),
  ),
});

const getEnumProperty = (propertyName: string, propertyDefinition: any) => {
  try {
    const enumProperty = enumPropertySchema.parse(propertyDefinition);
    return {
      name: propertyName,
      type: enumProperty.enum.join(' | '),
    };
  } catch (_) {}
};

// oneOf and allOf
const getOneOf = (obj: any) => {
  const oneOfs: Combinator[] = [];

  try {
    const component = oneOfObjectSchema.parse(obj);
    for (const refItem of component.oneOf) {
      if (typeof refItem.$ref === 'string') {
        const refObjName = getObjectNameFromRefPath(refItem.$ref);
        refObjName && oneOfs.push(refObjName);
      } else {
        const property = getProperties(refItem);
        property && oneOfs.push(property);
      }
    }

    return oneOfs;
  } catch (_) {}

  return [];
};

const getAllOf = (obj: any) => {
  const allOfs: Combinator[] = [];

  try {
    const component = allOfObjectSchema.parse(obj);
    for (const refItem of component.allOf) {
      if (typeof refItem.$ref === 'string') {
        const refObjName = getObjectNameFromRefPath(refItem.$ref);
        refObjName && allOfs.push(refObjName);
      } else {
        const property = getProperties(refItem);
        property && allOfs.push(property);
      }
    }

    return allOfs;
  } catch (_) {}

  return [];
};

const findAllRefPaths = (obj: any): string[] => {
  const refPaths: string[] = [];

  if (!isObject(obj)) {
    return refPaths;
  }

  for (const [key, value] of Object.entries(obj)) {
    if (key === '$ref' && typeof value === 'string') {
      refPaths.push(value);
    } else if (isObject(value)) {
      refPaths.push(...findAllRefPaths(value));
    }
  }

  return refPaths;
};

const getObjectNameFromRefPath = (refPath?: string) => {
  return refPath?.split('/').pop();
};

const getObjectFromRefPath = (
  fileObject: OpenAPIFileSchema,
  refPath?: string,
) => {
  if (!fileObject || !isObject(fileObject) || !refPath) {
    return;
  }

  const parts = refPath.split('/').splice(1); // Remove the '#' at the start of the ref path
  if (!parts) {
    return;
  }

  const objName = parts[parts.length - 1];
  if (!objName) {
    return;
  }

  let obj: any = fileObject;
  for (const part of parts) {
    obj = obj[part];
  }

  return { [objName]: obj };
};
