export type Color =
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose'
  | 'slate'
  | 'zinc'
  | 'neutral'
  | 'stone';

export const textColorMapper: Record<Color, string> = {
  red: 'text-red-500 dark:text-red-400',
  orange: 'text-orange-500 dark:text-orange-400',
  amber: 'text-amber-500',
  yellow: 'text-yellow-600 dark:text-yellow-400',
  lime: 'text-lime-600 dark:text-lime-400',
  green: 'text-green-500',
  emerald: 'text-emerald-500',
  teal: 'text-teal-500',
  cyan: 'text-cyan-500',
  sky: 'text-sky-500',
  blue: 'text-blue-500 dark:text-blue-400',
  indigo: 'text-indigo-500 dark:text-indigo-300',
  violet: 'text-violet-500 dark:text-violet-400',
  purple: 'text-purple-500 dark:text-purple-400',
  fuchsia: 'text-fuchsia-500 dark:text-fuchsia-400',
  pink: 'text-pink-500 dark:text-pink-400',
  rose: 'text-rose-500 dark:text-rose-400',
  slate: 'text-slate-500 dark:text-slate-300',
  zinc: 'text-zinc-500 dark:text-zinc-300',
  neutral: 'text-neutral-500 dark:text-neutral-300',
  stone: 'text-stone-500 dark:text-stone-300',
};
