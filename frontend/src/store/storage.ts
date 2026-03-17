import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

interface NoopStorage {
  getItem: (key: string) => Promise<null>;
  setItem: (key: string, value: string) => Promise<string>;
  removeItem: (key: string) => Promise<void>;
}

const createNoopStorage = (): NoopStorage => ({
  getItem: () => Promise.resolve(null),
  setItem: (_key: string, value: string) => Promise.resolve(value),
  removeItem: () => Promise.resolve(),
});

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage();

export default storage;
