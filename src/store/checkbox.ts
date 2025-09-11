import { proxy } from 'valtio';

type Store = {
  isShowCheckbox: boolean;
};

export const store = proxy<Store>({
  isShowCheckbox: false,
});

export const toggleIsShowCheckbox = () => {
  store.isShowCheckbox = !store.isShowCheckbox;
};
