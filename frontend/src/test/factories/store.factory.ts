import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '@/store/rootReducer';

type RootState = ReturnType<typeof rootReducer>;

export function createTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as RootState,
  });
}
