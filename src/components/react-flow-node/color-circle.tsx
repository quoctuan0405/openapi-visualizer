import { memo } from 'react';
import { cn } from '../../lib/cn';
import { useRipple } from '../../lib/useRipple';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';

type ColorCircleProps = {
  className?: string;
  tooltip?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const ColorCircle: React.FC<ColorCircleProps> = memo(
  ({ className, tooltip, onClick }) => {
    const subject = useRipple();

    return (
      <Tooltip>
        <TooltipTrigger
          className={cn(
            'overflow-hidden ml-auto hover:brightness-105 active:brightness-95 rounded-full size-8 duration-200 cursor-pointer',
            className,
          )}
          onClick={(e) => {
            onClick?.(e);
            subject.current.next(e);
          }}
        />
        {tooltip && <TooltipContent side="top">{tooltip}</TooltipContent>}
      </Tooltip>
    );
  },
  (prevProps, nextProps) =>
    prevProps.className === nextProps.className &&
    prevProps.tooltip === nextProps.tooltip,
);
