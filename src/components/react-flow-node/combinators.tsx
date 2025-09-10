import { memo } from 'react';
import type { Combinator } from '../../store/yamlFile/type-and-utils';
import { PropertyItem } from './property';
import { type Color, textColorMapper } from './type';

type CombinatorsProps = {
  color?: Color;
  combinators?: Combinator[];
};

// Handle oneOf, allOf
export const Combinators: React.FC<CombinatorsProps> = memo(
  ({ color = 'blue', combinators }) => {
    return (
      <div className="flex flex-col flex-wrap select-text">
        {combinators?.map((combinator, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: it's ok to use index as key here
            key={index}
            className="flex flex-row flex-wrap gap-2 mt-1"
          >
            <div className="text-sm text-neutral-500 font-semibold">-</div>
            {typeof combinator === 'string' ? (
              <p className={`${textColorMapper[color]} text-sm font-semibold`}>
                {combinator}
              </p>
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
