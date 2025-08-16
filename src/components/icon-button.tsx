import { cn } from '../lib/cn';
import { useRipple } from '../lib/useRipple';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

type Props = {
  className?: string;
  children?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  tooltip?: string;
  tooltipPosition?: 'right' | 'top' | 'bottom' | 'left';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const IconButton: React.FC<Props> = ({
  className,
  children,
  selected,
  disabled,
  tooltip,
  tooltipPosition,
  onClick,
}) => {
  const subject = useRipple();

  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          'relative overflow-hidden p-2 rounded-xl cursor-pointer duration-500',
          {
            'text-neutral-500 hover:bg-blue-100/80 dark:hover:text-neutral-300 dark:hover:bg-neutral-800':
              !disabled,
            'text-neutral-400 dark:text-neutral-600': disabled,
            'text-blue-600/70 dark:text-neutral-300 bg-blue-100 dark:bg-neutral-800':
              selected,
          },
          className,
        )}
        disabled={disabled}
        onClick={(e) => {
          subject.current.next(e);
          onClick?.(e);
        }}
      >
        <div className="relative z-10 flex flex-wrap items-center justify-center">
          {children}
        </div>
      </TooltipTrigger>
      <TooltipContent side={tooltipPosition}>{tooltip}</TooltipContent>
    </Tooltip>
  );
};
