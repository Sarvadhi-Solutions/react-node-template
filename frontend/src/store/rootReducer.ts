import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

// Register new feature slices here:
// import usersReducer from './slices/usersSlice';
// import projectsReducer from './slices/projectsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  // users: usersReducer,
  // projects: projectsReducer,
});

export default rootReducer;
