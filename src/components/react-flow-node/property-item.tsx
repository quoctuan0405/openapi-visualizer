import { memo } from 'react';
import { cn } from '../../lib/cn';
import { isEmpty } from '../../lib/isEmpty';
import type { Property } from '../../store/yamlFile/type-and-utils';
import { Checkbox, useCheckbox } from '../checkbox';
import { Combinators } from './combinators';
import { type Color, textColorMapper } from './type';

type PropertiesProps = {
  color?: Color;
  property: Property;
};

export const PropertyItem: React.FC<PropertiesProps> = memo(
  ({ color = 'blue', property }) => {
    const { isChecked, isShowCheckbox, toggleIsChecked } = useCheckbox();

    return (
      <div>
        {/** biome-ignore lint/a11y/noStaticElementInteractions: it's ok this is not a button */}
        {/** biome-ignore lint/a11y/useKeyWithClickEvents: it's ok this is not a button */}
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

          <p className="select-text">
            {property.isAnotherComponent && (
              <span
                className={`${textColorMapper[color]} text-sm font-semibold`}
              >
                {property.isAnotherComponent}
              </span>
            )}

            {!property.isAnotherComponent && (
              <span
                className={`${textColorMapper[color]} text-sm font-semibold`}
              >
                {property.name}
              </span>
            )}

            {property.isRequired && <span className="text-red-500">*</span>}

            {!property.isAnotherComponent && property.type && (
              <span
                className={cn('text-sm font-semibold', {
                  'text-neutral-400': !property.isRef,
                  [textColorMapper[color]]:
                    property.isRef ||
                    !isEmpty(property.allOf) ||
                    !isEmpty(property.oneOf),
                })}
              >
                : {property.type}
              </span>
            )}

            {!property.isAnotherComponent &&
              !property.type &&
              isEmpty(property.allOf) &&
              isEmpty(property.oneOf) &&
              isEmpty(property.properties) && (
                <span className="text-sm font-semibold text-neutral-400/50 italic">
                  : empty
                </span>
              )}
          </p>
        </div>

        {!isEmpty(property.allOf) && (
          <div className="pl-3">
            <Combinators combinators={property.allOf} color={color} />
          </div>
        )}

        {!isEmpty(property.oneOf) && (
          <div className="pl-3">
            <Combinators combinators={property.oneOf} color={color} />
          </div>
        )}

        {!isEmpty(property.properties) && (
          <div className="flex flex-col flex-wrap gap-1 mt-1 pl-3 border-l-2">
            {property.properties?.map((property) => (
              <PropertyItem
                key={property.name}
                property={property}
                color={color}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);
