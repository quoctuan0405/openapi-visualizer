import { memo } from 'react';
import { cn } from '../../lib/cn';
import type { Combinator } from '../../store/yamlFile/type-and-utils';
import { Checkbox, useCheckbox } from '../checkbox';
import { PropertyItem } from './property-item';
import { type Color, textColorMapper } from './type';

type CombinatorsProps = {
  color?: Color;
  combinators?: Combinator[];
};

// Handle oneOf, allOf
export const Combinators: React.FC<CombinatorsProps> = memo(
  ({ color = 'blue', combinators }) => {
    return (
      <div className="flex flex-col flex-wrap gap-1 select-text">
        {combinators?.map((combinator, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: it's ok to use index as key here
            key={index}
            className="flex flex-row flex-wrap gap-2 mt-1"
          >
            <div className="text-sm text-neutral-500 font-semibold">-</div>
            {typeof combinator === 'string' ? (
              <TextItem color={textColorMapper[color]} item={combinator} />
            ) : (
              <div className="flex flex-col flex-wrap gap-1">
                {combinator.map((property) => (
                  <PropertyItem
                    key={property.name}
                    property={property}
                    color={color}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  },
);

type TextItemProps = {
  item: string;
  color: string;
};

const TextItem: React.FC<TextItemProps> = memo(({ item, color }) => {
  const { isChecked, isShowCheckbox, toggleIsChecked } = useCheckbox();

  return (
    /** biome-ignore lint/a11y/noStaticElementInteractions: it's ok this is not a button */
    /** biome-ignore lint/a11y/useKeyWithClickEvents: it's ok this is not a button */
    <div
      className={cn('flex flex-row flex-wrap items-center', {
        'cursor-pointer': isShowCheckbox,
      })}
      onClick={toggleIsChecked}
    >
      {isShowCheckbox && (
        <Checkbox
          className="mr-2"
          isChecked={isChecked}
          onClick={toggleIsChecked}
        />
      )}

      <p className={`${color} text-sm font-semibold`}>{item}</p>
    </div>
  );
});
