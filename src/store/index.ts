import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './baseApi';
// Import các slice: import authReducer from '../modules/auth/slice';

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  // Thêm các custom reducer nếu không dùng RTKQuery hoàn toàn
  // auth: authReducer, 
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      baseApi.middleware
    ),
  devTools: import.meta.env.MODE !== 'production',
});

// Setting up listeners for refetchOnReconnect / refetchOnFocus
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
