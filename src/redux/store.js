import { configureStore } from '@reduxjs/toolkit';
import authSlicer from './slicer/auth';
import workSlicer from './slicer/work';
import workApi from './api/work';
import taskApi from './api/task';

const store = configureStore({
  reducer: {
    [authSlicer.name]: authSlicer.reducer,
    [workSlicer.name]: workSlicer.reducer,
    [workApi.reducerPath]: workApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(workApi.middleware, taskApi.middleware),
});

export default store;
