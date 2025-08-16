import { NodeToolbar, Position } from '@xyflow/react';
import { memo, useEffect, useState } from 'react';
import { cn } from '../../lib/cn';
import { ColorCircle } from './color-circle';
import type { Color } from './type';

type ColorPaletteProps = {
  ref?: React.RefObject<HTMLDivElement | null>;
  isVisible?: boolean;
  onSetColor?: (color: Color) => void;
};

export const ColorPalette: React.FC<ColorPaletteProps> = memo(
  (props) => {
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
      <NodeToolbar
        isVisible={isVisible}
        position={Position.Right}
        align="start"
      >
        <div
          ref={props.ref}
          className={cn(
            'bg-white dark:bg-neutral-900 shadow rounded-2xl p-3 duration-150',
            {
              'animate-in fade-in opacity-100': props.isVisible,
              'opacity-0': !props.isVisible,
            },
          )}
        >
          <div className="flex flex-col flex-wrap gap-3">
            <div className="flex flex-row flex-wrap gap-3">
              <ColorCircle
                className="bg-red-500"
                tooltip="red"
                onClick={() => props.onSetColor?.('red')}
              />
              <ColorCircle
                className="bg-orange-500"
                tooltip="orange"
                onClick={() => props.onSetColor?.('orange')}
              />
              <ColorCircle
                className="bg-amber-500"
                tooltip="amber"
                onClick={() => props.onSetColor?.('amber')}
              />
              <ColorCircle
                className="bg-yellow-500"
                tooltip="yellow"
                onClick={() => props.onSetColor?.('yellow')}
              />
              <ColorCircle
                className="bg-lime-500"
                tooltip="lime"
                onClick={() => props.onSetColor?.('lime')}
              />
              <ColorCircle
                className="bg-green-500"
                tooltip="green"
                onClick={() => props.onSetColor?.('green')}
              />
              <ColorCircle
                className="bg-emerald-500"
                tooltip="emerald"
                onClick={() => props.onSetColor?.('emerald')}
              />
            </div>
            <div className="flex flex-row flex-wrap gap-3">
              <ColorCircle
                className="bg-teal-500"
                tooltip="teal"
                onClick={() => props.onSetColor?.('teal')}
              />
              <ColorCircle
                className="bg-cyan-500"
                tooltip="cyan"
                onClick={() => props.onSetColor?.('cyan')}
              />
              <ColorCircle
                className="bg-sky-500"
                tooltip="sky"
                onClick={() => props.onSetColor?.('sky')}
              />
              <ColorCircle
                className="bg-blue-500"
                tooltip="blue"
                onClick={() => props.onSetColor?.('blue')}
              />
              <ColorCircle
                className="bg-indigo-500"
                tooltip="indigo"
                onClick={() => props.onSetColor?.('indigo')}
              />
              <ColorCircle
                className="bg-violet-500"
                tooltip="violet"
                onClick={() => props.onSetColor?.('violet')}
              />
              <ColorCircle
                className="bg-purple-500"
                tooltip="purple"
                onClick={() => props.onSetColor?.('purple')}
              />
            </div>
            <div className="flex flex-row flex-wrap gap-3">
              <ColorCircle
                className="bg-fuchsia-500"
                tooltip="fuchsia"
                onClick={() => props.onSetColor?.('fuchsia')}
              />
              <ColorCircle
                className="bg-pink-500"
                tooltip="pink"
                onClick={() => props.onSetColor?.('pink')}
              />
              <ColorCircle
                className="bg-rose-500"
                tooltip="rose"
                onClick={() => props.onSetColor?.('rose')}
              />
              <ColorCircle
                className="bg-slate-500"
                tooltip="slate"
                onClick={() => props.onSetColor?.('slate')}
              />
              <ColorCircle
                className="bg-zinc-500"
                tooltip="zinc"
                onClick={() => props.onSetColor?.('zinc')}
              />
              <ColorCircle
                className="bg-neutral-500"
                tooltip="neutral"
                onClick={() => props.onSetColor?.('neutral')}
              />
              <ColorCircle
                className="bg-stone-500"
                tooltip="stone"
                onClick={() => props.onSetColor?.('stone')}
              />
            </div>
          </div>
        </div>
      </NodeToolbar>
    );
  },
  (prevProps, nextProps) => prevProps.isVisible === nextProps.isVisible,
);
