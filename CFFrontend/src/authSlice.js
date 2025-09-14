import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axiosClient from './utils/axiosClient'

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/register', userData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Registration failed'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/login', credentials);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Login failed'
      );
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get("/user/check");
      return data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Authentication check failed'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post('/user/logout');
      return null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Logout failed'
      );
    }
  }
);

// Add this new async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put('/user/profile', userData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 
        error.response?.data?.message || 
        error.message || 
        'Profile update failed'
      );
    }
  }
);

// Add this new async thunk for updating user plan (simplified to just isPaid)
export const updateUserPlan = createAsyncThunk(
  'auth/updatePlan',
  async (planData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/updatePlan', planData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 
        error.response?.data?.message || 
        error.message || 
        'Plan update failed'
      );
    }
  }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        profileUpdateLoading: false, // Separate loading state for profile updates
        profileUpdateError: null, // Separate error state for profile updates
        planUpdateLoading: false, // Loading state for plan updates
        planUpdateError: null, // Error state for plan updates
    },
    reducers: {
        // Add a reducer to clear errors
        clearError: (state) => {
            state.error = null;
            state.profileUpdateError = null;
            state.planUpdateError = null;
        },
        // Add a reducer to manually update user data (for immediate UI updates)
        updateUser: (state, action) => {
          if (state.user) {
            state.user = { ...state.user, ...action.payload };
          }
        },
        // Add a reducer to manually update isPaid status
        updateUserPlanStatus: (state, action) => {
          if (state.user) {
            state.user.isPaid = action.payload.isPaid;
          }
        }
    },
    extraReducers: (builder) => {
        builder
        // Register User Cases
        .addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
            state.error = null;
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
            state.user = null;
        })

        // Login User Cases
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
            state.error = null;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
            state.user = null;
        })

        // Check Auth Cases
        .addCase(checkAuth.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(checkAuth.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = !!action.payload;
            state.user = action.payload;
            state.error = null;
        })
        .addCase(checkAuth.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
            state.user = null;
        })

        // Logout User Cases
        .addCase(logoutUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(logoutUser.fulfilled, (state) => {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        })
        .addCase(logoutUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
            state.user = null;
        })
        
        // Update Profile Cases
        .addCase(updateUserProfile.pending, (state) => {
            state.profileUpdateLoading = true;
            state.profileUpdateError = null;
        })
        .addCase(updateUserProfile.fulfilled, (state, action) => {
            state.profileUpdateLoading = false;
            state.user = action.payload;
            state.profileUpdateError = null;
        })
        .addCase(updateUserProfile.rejected, (state, action) => {
            state.profileUpdateLoading = false;
            state.profileUpdateError = action.payload;
        })
        
        // Update Plan Cases
        .addCase(updateUserPlan.pending, (state) => {
            state.planUpdateLoading = true;
            state.planUpdateError = null;
        })
        .addCase(updateUserPlan.fulfilled, (state, action) => {
            state.planUpdateLoading = false;
            state.user = action.payload;
            state.planUpdateError = null;
        })
        .addCase(updateUserPlan.rejected, (state, action) => {
            state.planUpdateLoading = false;
            state.planUpdateError = action.payload;
        })
    }
});

export const { clearError, updateUser, updateUserPlanStatus } = authSlice.actions;
export default authSlice.reducer;