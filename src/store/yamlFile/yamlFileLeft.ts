import { proxy } from 'valtio';
import { subscribeKey } from 'valtio/utils';
import { parse } from 'yaml';
import type { Toast } from '../../components/toast';
import { getFileExtension } from '../../lib/getFileExtenstion';
import {
  buildTreeOfFile,
  openAPIFileSchema,
  type Store,
} from './type-and-utils';

let toast: Toast | undefined;
import('../../components/toast').then((result) => {
  toast = result.default;
});

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

    const { pathsTree, components, missingRefComponents } =
      await buildTreeOfFile(doc);
    store.pathsTree = pathsTree;
    store.components = components;
    store.missingRefComponents = missingRefComponents;
  } catch (_) {}
};

// Subscription
subscribeKey(store, 'pathsTree', () => {
  if (store.fileName) {
    toast?.success(`Upload file ${store.fileName} successfully!`);
  }
});
