import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import { tokenUtil } from '@/utils/token';
import { baseApi } from '@/store/baseApi';
import type { AppDispatch, RootState } from '@/store';

/**
 * Auth State slice for Redux store.
 * Manages in-memory authentication state and persists to storage via tokenUtil.
 */

const initialState = {
  data: {},
  isLogined: !!tokenUtil.getLoggedUser(),
  loggedUser: (tokenUtil.getLoggedUser() as any) || null,
  permissions: [] as string[],
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearState: () => {
      tokenUtil.removeToken();
      tokenUtil.removeLoggedUser();
      return initialState;
    },

    updateLoggedUser: (state, action: PayloadAction<any>) => {
      state.loggedUser = { ...state.loggedUser, ...action.payload };
      tokenUtil.setLoggedUser(state.loggedUser);
    },

    updateFullname: (state, action: PayloadAction<string>) => {
      if (state.loggedUser) {
        state.loggedUser.fullname = action.payload;
        tokenUtil.setLoggedUser(state.loggedUser);
      }
    },
  },
  extraReducers: (builder) => {
    // 1. Success matching for Login
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
      const { user, ...token } = payload.result;
      
      // Persist access token and user info
      tokenUtil.setToken(token.access_token);
      tokenUtil.setLoggedUser(user);
      
      state.loggedUser = user;
      state.isLogined = true;
    });

    // 2. Token validation results
    builder.addMatcher(authApi.endpoints.validateToken.matchFulfilled, (state, { payload }) => {
      tokenUtil.setLoggedUser(payload);
      state.loggedUser = payload;
      state.isLogined = true;
    });
  },
});

export const {
  clearState,
  updateLoggedUser,
  updateFullname,
} = authSlice.actions;

export default authSlice.reducer;

/**
 * Professional logout thunk to clear state across the store.
 */
export const performLogout = () => (dispatch: AppDispatch) => {
  try {
    tokenUtil.removeToken();
    tokenUtil.removeLoggedUser();
  } finally {
    // Reset all API states and clear auth data
    dispatch(baseApi.util.resetApiState());
    dispatch(clearState());
  }
};

// Selectors
export const selectIsLogined = (state: RootState) => state.auth.isLogined;
export const selectLoggedUser = (state: RootState) => state.auth.loggedUser;
