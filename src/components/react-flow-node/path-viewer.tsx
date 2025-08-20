import { Handle, type Node, type NodeProps, Position } from '@xyflow/react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import { isEmpty } from '../../lib/isEmpty';
import type { Side } from '../../store/focusSide';
import { dragHandleClass } from '../../store/reactFlow';
import {
  setSelectedPathLeft,
  setSelectedPathRight,
} from '../../store/selectedItem';
import type {
  Property,
  RequestBody,
  Response,
} from '../../store/yamlFile/type-and-utils';
import { ColorCircle } from './color-circle';
import { ColorPalette } from './color-palette';
import { PropertyItem } from './property';
import { type Color, textColorMapper } from './type';

export type PathViewerData = {
  path: string;
  method: string;
  parameters?: Property[];
  requestBody?: RequestBody;
  responses?: Response[];
  graphSide?: Side;
};

export type PathViewerNode = Node<PathViewerData, 'path-viewer'>;

export type PathViewerProps = NodeProps<PathViewerNode>;

export const PathViewer: React.FC<PathViewerProps> = ({ data }) => {
  // Open and close color palette
  const componentViewerRef = useRef<HTMLDivElement>(null);
  const colorPaletteRef = useRef<HTMLDivElement>(null);

  const [isOpenColorPalette, setIsOpenColorPalette] = useState<boolean>(false);
  const [color, setColor] = useState<Color>('blue');

  useEffect(() => {
    if (isOpenColorPalette) {
      const handleClick = (e: MouseEvent) => {
        if (
          // biome-ignore lint/suspicious/noExplicitAny: in this case e.target must be any
          !componentViewerRef.current?.contains(e.target as any) &&
          // biome-ignore lint/suspicious/noExplicitAny: in this case e.target must be any
          !colorPaletteRef.current?.contains(e.target as any)
        ) {
          setIsOpenColorPalette(false);
        }
      };

      window.addEventListener('click', handleClick);

      return () => {
        window.removeEventListener('click', handleClick);
      };
    }
  }, [isOpenColorPalette]);

  // Ctrl + hover on title
  const [isCtrlHoverTitle, setIsCtrlHoverTitle] = useState<boolean>(false);

  // Ctrl + hover on title
  const [isCtrlHoverPath, setIsCtrlHoverPath] = useState<boolean>(false);

  // Ctrl + click on title
  const onCtrlClickTitleOrPath = (
    e: React.MouseEvent | React.KeyboardEvent,
  ) => {
    if (e.ctrlKey) {
      e.preventDefault();

      const path = `${data.method.toUpperCase()} ${data.path}`;
      if (data.graphSide === 'left') {
        setSelectedPathLeft(path);
      } else if (data.graphSide === 'right') {
        setSelectedPathRight(path);
      }
    }
  };

  return (
    <>
      <div
        ref={componentViewerRef}
        className="shadow backdrop-blur-2xl dark:border-2 dark:border-neutral-800 rounded-2xl"
      >
        <div
          className={`flex flex-row flex-wrap items-center gap-5 pl-5 pr-3 py-2 border-b-2 border-neutral-200 dark:border-neutral-800 ${dragHandleClass}`}
        >
          <p
            className={cn(
              `flex-1 py-2 ${textColorMapper[color]} font-semibold duration-200`,
              {
                'brightness-75 cursor-pointer underline': isCtrlHoverTitle,
              },
            )}
            onMouseEnter={(e) => e.ctrlKey && setIsCtrlHoverTitle(true)}
            onMouseMove={(e) => e.ctrlKey && setIsCtrlHoverTitle(true)}
            onMouseLeave={() => setIsCtrlHoverTitle(false)}
            onClick={onCtrlClickTitleOrPath}
            onKeyDown={onCtrlClickTitleOrPath}
          >
            Path
          </p>

          {/* Color palette trigger */}
          <ColorCircle
            className={`bg-${color}-500 opacity-30 dark:opacity-50`}
            tooltip="Select color"
            onClick={() => setIsOpenColorPalette((prev) => !prev)}
          />
        </div>

        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />

        <div className="px-5 py-2 opacity-80 dark:opacity-100 select-auto cursor-auto">
          <p
            className={cn(
              `mb-1 ${textColorMapper[color]} font-semibold select-text`,
              {
                'brightness-75 cursor-pointer underline': isCtrlHoverPath,
              },
            )}
            onMouseEnter={(e) => e.ctrlKey && setIsCtrlHoverPath(true)}
            onMouseMove={(e) => e.ctrlKey && setIsCtrlHoverPath(true)}
            onMouseLeave={() => setIsCtrlHoverPath(false)}
            onClick={onCtrlClickTitleOrPath}
            onKeyDown={onCtrlClickTitleOrPath}
          >
            <span className="uppercase">{data.method} </span>
            <span>{data.path}</span>
          </p>

          <div className={`mt-2 font-semibold text-sm select-text`}>
            <p className={`${textColorMapper[color]}`}>
              <span>Parameters: </span>
              <span>
                {isEmpty(data.parameters) && (
                  <span className="text-sm font-semibold text-neutral-400/50 italic">
                    empty
                  </span>
                )}
              </span>
            </p>
            {!isEmpty(data.parameters) && (
              <div className="flex flex-col flex-wrap gap-2 mt-2 pl-3 border-l-2">
                {data.parameters?.map((property) => (
                  <PropertyItem
                    key={property.name}
                    property={property}
                    color={color}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mt-2">
            <PropertyItem
              color={color}
              property={{ ...data.requestBody?.schema, name: 'Request body' }}
            />
          </div>

          {data.responses?.map((response) => (
            <div key={response.status} className="mt-2">
              <PropertyItem
                color={color}
                property={{ ...response.schema, name: response.status }}
              />
            </div>
          ))}
        </div>
      </div>

      <ColorPalette
        ref={colorPaletteRef}
        isVisible={isOpenColorPalette}
        onSetColor={(color) => setColor(color)}
      />
    </>
  );
};
