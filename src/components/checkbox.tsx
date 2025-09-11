import { memo, useCallback, useState } from 'react';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';
import { useSnapshot } from 'valtio';
import { cn } from '../lib/cn';
import { store as checkboxStore } from '../store/checkbox';

type Props = {
  className?: string;
  isChecked?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const Checkbox: React.FC<Props> = memo(
  ({ className, isChecked, onClick }) => {
    return (
      <button
        type="button"
        className={cn('text-lg cursor-pointer', className)}
        onClick={onClick}
      >
        {isChecked ? (
          <ImCheckboxChecked className="text-blue-500" />
        ) : (
          <ImCheckboxUnchecked className="text-neutral-400 dark:text-neutral-600" />
        )}
      </button>
    );
  },
);

export const useCheckbox = () => {
  const { isShowCheckbox } = useSnapshot(checkboxStore);

  const [isChecked, setIsChecked] = useState<boolean>(false);

  const toggleIsChecked = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsChecked((prev) => !prev);
  }, []);

  return { isShowCheckbox, isChecked, toggleIsChecked } as const;
};
