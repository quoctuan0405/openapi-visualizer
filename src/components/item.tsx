import { memo, useEffect, useRef } from 'react';
import { cn } from '../lib/cn';
import { useRipple } from '../lib/useRipple';

type Props = {
  children?: React.ReactNode;
  selected?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isHover?: boolean;
};

export const Item: React.FC<Props> = memo(
  ({ children, selected, onClick, isHover }) => {
    const itemRef = useRef<HTMLButtonElement>(null);
    const subject = useRipple();

    useEffect(() => {
      if ((selected || isHover) && itemRef.current) {
        const options = {
          root: null, // null means the viewport
          threshold: 0, // Callback fires as soon as any part of the target element enters or leaves the viewport
        };

        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              // Element is outside the viewport
              itemRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest',
              });
            }

            // Scroll down only once: cancel right after this function is being called once
            itemRef.current && observer.unobserve(itemRef.current);
          });
        }, options);

        observer.observe(itemRef.current);

        return () => observer.disconnect();
      }
    }, [isHover, selected]);

    return (
      <button
        ref={itemRef}
        type="button"
        className={cn(
          'relative overflow-hidden text-neutral-600/80 dark:text-neutral-300 cursor-pointer py-2 px-5 rounded-lg duration-400',
          {
            'hover:bg-blue-100/60 dark:hover:bg-neutral-800': !selected,
            'bg-blue-100/60 dark:bg-neutral-700': isHover,
            'bg-blue-100 dark:bg-neutral-700 text-blue-600/70': selected,
          },
        )}
        onClick={(e) => {
          onClick?.(e);
          subject.current.next(e);
        }}
      >
        <div className="text-left text-pretty relative z-10">{children}</div>
      </button>
    );
  },
  (prevProps, nextProps) =>
    prevProps.isHover === nextProps.isHover &&
    prevProps.selected === nextProps.selected,
);
