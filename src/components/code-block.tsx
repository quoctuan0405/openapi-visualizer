import { memo, useState } from 'react';
import { FaCaretDown, FaCopy } from 'react-icons/fa6';
import ShikiHighlighter, {
  createHighlighterCore, // re-exported from shiki/core
  createJavaScriptRegexEngine, // re-exported from shiki/engine/javascript
} from 'react-shiki/core';
import { useSnapshot } from 'valtio';
import { cn } from '../lib/cn';
import { store as darkModeStore } from '../store/darkmode';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible';
import { IconButton } from './icon-button';

// Create custom highlighter with dynamic imports to optimize client-side bundle size
const highlighter = await createHighlighterCore({
  themes: [
    import('@shikijs/themes/catppuccin-latte'),
    import('@shikijs/themes/catppuccin-mocha'),
  ],
  langs: [import('@shikijs/langs/yml')],
  engine: createJavaScriptRegexEngine(),
});

type Props = {
  title?: string;
  code?: string;
};

export const CodeBlock: React.FC<Props> = memo(({ title, code }) => {
  const { isDarkMode } = useSnapshot(darkModeStore);

  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex flex-row flex-wrap items-center gap-2 w-full pl-5 group cursor-pointer">
        <FaCaretDown
          className={cn(
            'text-neutral-500 group-hover:text-neutral-600 dark:text-neutral-400 group-hover:dark:text-neutral-300 duration-200',
            {
              'rotate-0': isOpen,
              '-rotate-90': !isOpen,
            },
          )}
        />

        <p className="py-2 font-semibold text-neutral-600 group-hover:text-neutral-700 dark:text-neutral-400 group-hover:dark:text-neutral-300 duration-200">
          {title}
        </p>

        <IconButton
          className="rounded-lg"
          tooltip="Copy code"
          onClick={(e) => {
            e.stopPropagation();
            code && navigator.clipboard.writeText(code);
          }}
        >
          <FaCopy className="text-neutral-400/80 text-xl" />
        </IconButton>
      </CollapsibleTrigger>

      <CollapsibleContent
        className={cn({
          'animate-collapsible-up': !isOpen,
          'animate-collapsible-down': isOpen,
        })}
      >
        <ShikiHighlighter
          highlighter={highlighter}
          showLanguage={false}
          language="yml"
          theme={cn({
            'catppuccin-latte': !isDarkMode,
            'catppuccin-mocha': isDarkMode,
          })}
        >
          {code?.trim() || ''}
        </ShikiHighlighter>
      </CollapsibleContent>
    </Collapsible>
  );
});
