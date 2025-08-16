import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { useEffect, useRef } from 'react';
import { delay, map, Subject, throttleTime } from 'rxjs';
import { cn } from '../lib/cn';

const buttonVariants = cva(
  "relative overflow-hidden cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  onClick,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  const subject = useRef(
    new Subject<React.MouseEvent<HTMLButtonElement, MouseEvent>>(),
  );

  useEffect(() => {
    const subscription = subject.current
      .pipe(
        throttleTime(100),
        map((e) => {
          const button = e.currentTarget;

          const rippleSize = 25;
          const ripple = document.createElement('span');
          ripple.className = cn(
            'absolute top-0 left-0 rounded-full animate-ripple',
            {
              'bg-neutral-500': variant === 'default',
              'bg-red-400': variant === 'destructive',
              'bg-neutral-200': variant === 'link',
              'bg-neutral-300':
                variant === 'ghost' ||
                variant === 'outline' ||
                variant === 'secondary',
            },
          );
          ripple.style.width = `${rippleSize}px`;
          ripple.style.height = `${rippleSize}px`;
          ripple.style.left = `${e.clientX - (e.currentTarget.offsetLeft + rippleSize / 2)}px`;
          ripple.style.top = `${e.clientY - (e.currentTarget.offsetTop + rippleSize / 2)}px`;

          button.appendChild(ripple);

          return ripple;
        }),
        delay(300),
      )
      .subscribe((ripple) => {
        ripple.remove();
      });

    return () => subscription.unsubscribe();
  }, [variant]);

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={(e) => {
        subject.current.next(e);
        onClick?.(e);
      }}
      {...props}
    >
      <div className="z-10">{children}</div>
    </Comp>
  );
}

export { Button, buttonVariants };
