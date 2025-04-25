import { configureStore } from "@reduxjs/toolkit";
import authSlicer from "./slicer/auth";
import workSlicer from "./slicer/work";
import workApi from "./api/work";
import taskApi from "./api/task";
import diaryApi from "./api/diary";
import fillingApi from "./api/filling";
import monthlyGoalApi from "./api/monthlyGoal";
import weeklyGoalApi from "./api/weeklyGoal";
import yearlyGoalApi from "./api/yearlyGoal";
import movieApi from "./api/movie";
import passwordApi from "./api/password";
import photoApi from "./api/photo";
import skillApi from "./api/skill";
import userApi from "./api/user";
import goalApi from "./api/goal";
import calendarApi from "./api/calendar";

const store = configureStore({
  reducer: {
    [authSlicer.name]: authSlicer.reducer,
    [workSlicer.name]: workSlicer.reducer,
    [workApi.reducerPath]: workApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
    [goalApi.reducerPath]: goalApi.reducer,
    [diaryApi.reducerPath]: diaryApi.reducer,
    [fillingApi.reducerPath]: fillingApi.reducer,
    [monthlyGoalApi.reducerPath]: monthlyGoalApi.reducer,
    [weeklyGoalApi.reducerPath]: weeklyGoalApi.reducer,
    [yearlyGoalApi.reducerPath]: yearlyGoalApi.reducer,
    [movieApi.reducerPath]: movieApi.reducer,
    [passwordApi.reducerPath]: passwordApi.reducer,
    [photoApi.reducerPath]: photoApi.reducer,
    [skillApi.reducerPath]: skillApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [calendarApi.reducerPath]: calendarApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      workApi.middleware,
      taskApi.middleware,
      diaryApi.middleware,
      fillingApi.middleware,
      monthlyGoalApi.middleware,
      weeklyGoalApi.middleware,
      yearlyGoalApi.middleware,
      movieApi.middleware,
      passwordApi.middleware,
      photoApi.middleware,
      skillApi.middleware,
      goalApi.middleware,
      userApi.middleware,
      calendarApi.middleware
    ),
});

export default store;
