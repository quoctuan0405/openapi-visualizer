import {
  Handle,
  type Node,
  type NodeProps,
  NodeToolbar,
  Position,
} from '@xyflow/react';
import type React from 'react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { PiWarningFill } from 'react-icons/pi';
import { cn } from '../../lib/cn';
import { isEmpty } from '../../lib/isEmpty';
import type { Side } from '../../store/focusSide';
import { dragHandleClass } from '../../store/reactFlow';
import {
  setSelectedComponentLeft,
  setSelectedComponentRight,
} from '../../store/selectedItem';
import type {
  ComponentNode,
  PathNode,
} from '../../store/yamlFile/type-and-utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';
import { ColorCircle } from './color-circle';
import { ColorPalette } from './color-palette';
import { Combinators } from './combinators';
import { PropertyItem } from './property';
import { type Color, textColorMapper } from './type';

export type ComponentViewerData = ComponentNode & {
  graphSide?: Side;
};

export type ComponentViewerNode = Node<ComponentViewerData, 'component-viewer'>;

export type ComponentViewerProps = NodeProps<ComponentViewerNode>;

export const ComponentViewer: React.FC<ComponentViewerProps> = memo(
  ({
    data: {
      name,
      graphSide,
      isAMissingRef,
      paths,
      enums,
      properties,
      allOf,
      oneOf,
      isAnotherComponent,
    },
  }) => {
    // Open and close color palette
    const componentViewerRef = useRef<HTMLDivElement>(null);
    const colorPaletteRef = useRef<HTMLDivElement>(null);

    const [isOpenColorPalette, setIsOpenColorPalette] =
      useState<boolean>(false);

    const [color, setColor] = useState<Color>(
      isAMissingRef ? 'yellow' : 'blue',
    );

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

    const onColorCircleClick = useCallback(
      () => setIsOpenColorPalette((prev) => !prev),
      [],
    );

    const onSetColor = useCallback((color: Color) => setColor(color), []);

    // Ctrl + hover on title
    const [isCtrlHoverTitle, setIsCtrlHoverTitle] = useState<boolean>(false);

    // Ctrl + click on title
    const onCtrlClickTitle = (e: React.MouseEvent | React.KeyboardEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();

        if (graphSide === 'left') {
          setSelectedComponentLeft(name);
        } else if (graphSide === 'right') {
          setSelectedComponentRight(name);
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
            className={`flex flex-row flex-wrap items-center gap-5 pl-5 pr-3 border-b-2 border-neutral-200 dark:border-neutral-800 ${dragHandleClass}`}
          >
            {isAMissingRef && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <PiWarningFill className="text-3xl text-yellow-500 dark:text-yellow-600" />
                </TooltipTrigger>
                <TooltipContent>
                  This component is reference to but not exist
                </TooltipContent>
              </Tooltip>
            )}

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
              onClick={onCtrlClickTitle}
              onKeyDown={onCtrlClickTitle}
              onDoubleClick={async () => {
                navigator.clipboard.writeText(name);

                const toast = (await import('../toast')).default;
                toast.success('Copy successfully');
              }}
            >
              {name}
            </p>

            {/* Color palette trigger */}
            <ColorCircle
              className={`bg-${color}-500 opacity-30 dark:opacity-50`}
              tooltip="Select color"
              onClick={onColorCircleClick}
            />
          </div>

          <Handle type="target" position={Position.Left} />
          <Handle type="source" position={Position.Right} />

          <div className="px-5 py-2 opacity-80 dark:opacity-100 select-auto cursor-auto">
            <div className="flex flex-col flex-wrap gap-1">
              {properties?.map((property) => (
                <PropertyItem
                  key={property.name}
                  property={property}
                  color={color}
                />
              ))}
            </div>

            {!isEmpty(isAnotherComponent) && (
              <span
                className={`${textColorMapper[color]} select-text text-sm font-semibold`}
              >
                {isAnotherComponent}
              </span>
            )}

            {!isEmpty(allOf) && (
              <div>
                <div
                  className={`text-sm ${textColorMapper[color]} font-semibold`}
                >
                  allOf:{' '}
                </div>
                <Combinators combinators={allOf} color={color} />
              </div>
            )}
            {!isEmpty(oneOf) && (
              <div>
                <div
                  className={`text-sm ${textColorMapper[color]} font-semibold`}
                >
                  oneOf:{' '}
                </div>
                <Combinators combinators={oneOf} color={color} />
              </div>
            )}
            {enums && (
              <span className="text-sm font-semibold text-neutral-400 select-text">
                {enums}
              </span>
            )}
          </div>
        </div>

        <ColorPalette
          ref={colorPaletteRef}
          isVisible={isOpenColorPalette}
          onSetColor={onSetColor}
        />

        <PathsTooltip
          paths={Array.from(paths || [])}
          isVisible={isCtrlHoverTitle}
        />
      </>
    );
  },
);

type PathsTooltipProps = {
  isVisible?: boolean;
  paths?: PathNode[];
};

const PathsTooltip: React.FC<PathsTooltipProps> = (props) => {
  // Local isShow (delay for animate nodeToolbar disappear)
  const [isVisible, setIsVisible] = useState<boolean>();

  useEffect(() => {
    if (props.isVisible) {
      setIsVisible(true);
    } else {
      const timeoutId = setTimeout(() => setIsVisible(false), 150);

      return () => clearTimeout(timeoutId);
    }
  }, [props.isVisible]);

  return (
    <NodeToolbar isVisible={isVisible} position={Position.Right} align="start">
      <div
        className={cn(
          'bg-white dark:bg-neutral-900 rounded-2xl border-2 border-neutral-100 dark:border-neutral-900 py-2 px-5 duration-150',
          {
            'animate-in fade-in opacity-100': props.isVisible,
            'opacity-0': !props.isVisible,
          },
        )}
      >
        <div className="flex flex-col flex-wrap gap-1.5">
          {props.paths?.map(({ method, path }) => (
            <div key={`${method} ${path}`} className="text-sm text-neutral-400">
              <span className="uppercase">{method}</span> <span>{path}</span>
            </div>
          ))}
        </div>
      </div>
    </NodeToolbar>
  );
};
