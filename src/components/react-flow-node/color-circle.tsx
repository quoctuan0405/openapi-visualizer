import { memo } from 'react';
import { cn } from '../../lib/cn';
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';

type ColorCircleProps = {
  className?: string;
  tooltip?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const ColorCircle: React.FC<ColorCircleProps> = memo(
  ({ className, tooltip, onClick }) => {
    return (
      <Tooltip>
        <TooltipTrigger
          className={cn(
            'ml-auto hover:brightness-110 active:brightness-90 rounded-full size-8 duration-200 cursor-pointer',
            className,
          )}
          onClick={onClick}
        />
        {tooltip && <TooltipContent side="top">{tooltip}</TooltipContent>}
      </Tooltip>
    );
  },
  (prevProps, nextProps) =>
    prevProps.className === nextProps.className &&
    prevProps.tooltip === nextProps.tooltip,
);
