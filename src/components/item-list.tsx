import type { FuzzyResult } from '@nozbe/microfuzz';
import { Highlight, useFuzzySearchList } from '@nozbe/microfuzz/react';
import { memo, useCallback, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { FaSearch } from 'react-icons/fa';
import { Item } from './item';

type Props = {
  placeholder?: string;
  items: string[];
  selectedItem?: string;
  onSelectItem?: (item: string) => void;
};

export const ItemList: React.FC<Props> = memo(
  ({ placeholder, selectedItem, items, onSelectItem }) => {
    // Search
    const [queryText, setQueryText] = useState<string>('');

    const mapResultItem = useCallback(
      ({ item, matches: [highlightRanges] }: FuzzyResult<string>) => ({
        item,
        highlightRanges,
      }),
      [],
    );

    const filteredList = useFuzzySearchList({
      list: items,
      queryText,
      mapResultItem,
    });

    // Hotkeys: Focus and unfocus (blur) searchbox
    const searchBoxRef = useRef<HTMLInputElement>(null);

    useHotkeys('Ctrl + K', (e) => {
      e.preventDefault();
      searchBoxRef.current?.focus();
    });

    useHotkeys(
      'Esc',
      (e) => {
        e.preventDefault();
        searchBoxRef.current?.blur();
      },
      { enableOnFormTags: true },
    );

    // Hotkeys: Up and down arrow and enter to choose item
    const [hoverItemIndex, setHoverItemIndex] = useState<number>();

    useHotkeys(
      'Up',
      (e) => {
        e.preventDefault();
        setHoverItemIndex((prev) => {
          if (prev === 0) {
            return filteredList.length - 1;
          } else if (prev === undefined) {
            return filteredList.length - 1;
          } else {
            return prev - 1;
          }
        });
      },
      { enableOnFormTags: true },
    );

    useHotkeys(
      'Down',
      (e) => {
        e.preventDefault();
        setHoverItemIndex((prev) => {
          if (prev === filteredList.length - 1) {
            return 0;
          } else if (prev === undefined) {
            return 0;
          } else {
            return prev + 1;
          }
        });
      },
      { enableOnFormTags: true },
    );

    useHotkeys(
      'Enter',
      (e) => {
        if (hoverItemIndex !== undefined) {
          e.preventDefault();

          filteredList[hoverItemIndex] &&
            onSelectItem?.(filteredList[hoverItemIndex].item);
        }
      },
      { enableOnFormTags: true },
    );

    return (
      <>
        <div className="relative w-full mb-3">
          <input
            ref={searchBoxRef}
            className="w-full text-neutral-600 dark:text-neutral-300 rounded-lg py-2 px-3 focus-visible:ring-2 focus-visible:ring-blue-300 dark:focus-visible:ring-blue-500 focus-visible:ring-inset focus-visible:outline-0 transition-all duration-100"
            placeholder={placeholder}
            value={queryText}
            onChange={(e) => setQueryText(e.currentTarget.value)}
          />

          <FaSearch className="absolute top-3 right-3 text-neutral-400 dark:text-neutral-600" />
        </div>

        <div className="flex flex-col flex-wrap">
          {filteredList.map(({ item, highlightRanges }, index) => (
            <Item
              key={item}
              selected={selectedItem === item}
              isHover={hoverItemIndex === index}
              onClick={() => {
                setHoverItemIndex(index);
                onSelectItem?.(item);
              }}
            >
              <Highlight text={item} ranges={highlightRanges} />
            </Item>
          ))}
        </div>
      </>
    );
  },
);
