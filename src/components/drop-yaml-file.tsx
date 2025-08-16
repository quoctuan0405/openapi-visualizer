import { memo, useCallback, useMemo } from 'react';
import { type DropzoneOptions, useDropzone } from 'react-dropzone';
import {
  BsFileEarmarkFill,
  BsFiletypeJson,
  BsFiletypeYml,
} from 'react-icons/bs';
import { cn } from '../lib/cn';
import { getFileExtension } from '../lib/getFileExtenstion';

type Props = {
  className?: string;
  fileName?: string;
  disabled?: boolean;
  onFileDrop?: (fileName: string, fileContent: string) => void;
};

export const DropYamlFile: React.FC<Props> = memo(
  ({ className, disabled, fileName, onFileDrop }) => {
    const onDrop: DropzoneOptions['onDrop'] = useCallback(
      async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
          const fileContent = await file.text();
          onFileDrop?.(file.name, fileContent);
        }
      },
      [onFileDrop],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: { '.yml,.yaml,.json': [] },
      disabled,
    });

    const fileExtension = useMemo(() => {
      if (fileName) {
        return getFileExtension(fileName);
      }
    }, [fileName]);

    return (
      <div className={cn('w-full h-full', className)} {...getRootProps()}>
        <div
          className={cn(
            'flex flex-row flex-wrap items-center justify-center w-full h-full p-5 border-2 border-dashed hover:border-neutral-300 dark:hover:border-neutral-500 rounded-2xl cursor-pointer duration-200',
            {
              'bg-blue-100/70 dark:bg-neutral-800': isDragActive,
            },
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col flex-wrap items-center justify-center gap-4">
            {!fileName && (
              <BsFileEarmarkFill className="text-7xl text-neutral-300 dark:text-neutral-500" />
            )}

            {(fileExtension === 'yaml' || fileExtension === 'yml') && (
              <BsFiletypeYml className="text-7xl text-purple-400 dark:text-purple-500/70" />
            )}

            {fileExtension === 'json' && (
              <BsFiletypeJson className="text-7xl text-lime-500 dark:text-lime-500/70" />
            )}

            {fileName ? (
              <p
                className={cn('font-medium', {
                  'text-purple-500 dark:text-purple-500/90':
                    fileExtension === 'yaml' || fileExtension === 'yml',
                  'text-lime-600 dark:text-lime-500/70':
                    fileExtension === 'json',
                })}
              >
                {fileName}
              </p>
            ) : (
              <p className="text-center text-sm text-neutral-400">
                Drop your OpenAPI yaml/ <br /> Swagger json here
              </p>
            )}
          </div>
        </div>
      </div>
    );
  },
);
