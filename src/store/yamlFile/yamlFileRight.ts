import { proxy } from 'valtio';
import { parse } from 'yaml';
import { getFileExtension } from '../../lib/getFileExtenstion';
import {
  buildTreeOfFile,
  openAPIFileSchema,
  type Store,
} from './type-and-utils';

// Store
export const store = proxy<Store>({});

// Actions
export const setFileContent = async (fileName: string, fileContent: string) => {
  store.fileName = fileName;

  let fileObject: object;

  const fileExtension = getFileExtension(fileName);
  if (fileExtension === 'yaml' || fileExtension === 'yml') {
    fileObject = parse(fileContent);
  } else if (fileExtension === 'json') {
    fileObject = JSON.parse(fileContent);
  } else {
    return;
  }

  try {
    const doc = await openAPIFileSchema.parseAsync(fileObject);

    store.doc = doc;
    store.fileContent = fileContent;

    const { pathsTree, components } = await buildTreeOfFile(doc);
    store.pathsTree = pathsTree;
    store.components = components;
  } catch (_) {}
};
