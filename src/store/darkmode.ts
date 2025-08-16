import { proxy } from 'valtio';

type Store = {
  isDarkMode: boolean;
};

export const store = proxy<Store>({
  isDarkMode: false,
});

export const toggleDarkMode = () => {
  store.isDarkMode = !store.isDarkMode;

  const root = window.document.documentElement;
  if (store.isDarkMode) {
    // Switch to light mode
    root.classList.add('dark');
  } else {
    // Switch to dark mode
    root.classList.remove('dark');
  }
};
