import { useEffect, useRef } from 'react';
import { delay, map, Subject, throttleTime } from 'rxjs';
import { cn } from './cn';

export const useRipple = () => {
  const subject = useRef(
    new Subject<React.MouseEvent<HTMLElement, MouseEvent>>(),
  );

  useEffect(() => {
    const subscription = subject.current
      .pipe(
        throttleTime(100),
        map((e) => {
          const element = e.currentTarget;
          const boundingClientRect = element.getBoundingClientRect();

          const rippleSize = 10;
          const ripple = document.createElement('span');
          ripple.className = cn(
            'absolute rounded-full bg-blue-200/50 animate-ripple',
          );
          ripple.style.width = `${rippleSize}px`;
          ripple.style.height = `${rippleSize}px`;
          ripple.style.left = `${e.clientX - (boundingClientRect.left + rippleSize / 2)}px`;
          ripple.style.top = `${e.clientY - (boundingClientRect.top + rippleSize / 2)}px`;

          element.appendChild(ripple);

          return ripple;
        }),
        delay(300),
      )
      .subscribe((ripple) => {
        ripple.remove();
      });

    return () => subscription.unsubscribe();
  }, []);

  return subject;
};
