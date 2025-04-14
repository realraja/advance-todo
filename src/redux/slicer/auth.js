import { IS_USER_LOGGED_IN, USER_DATA, USER_ID } from "@/constants/localConst";
import { getOrSaveLocalStorage } from "@/lib/localStorage";
import { createSlice } from "@reduxjs/toolkit";

const authSlicer = createSlice({
  name: "auth",
  initialState: {
    isUser:  getOrSaveLocalStorage({key:IS_USER_LOGGED_IN,get:true}) ||false,
    userId: getOrSaveLocalStorage({key:USER_ID,get:true}) ||null,
    userData:  getOrSaveLocalStorage({key:USER_DATA,get:true}) ||{},
    loading:true,
    isAdmin:false,
  },
  reducers: {
    login: (state,action) =>{
        state.isUser = true;
        state.userId = action.payload._id;
        state.userData = action.payload;
        state.loading = false;
    },
    logout: (state,action) =>{
        state.isUser = false;
        state.userId = null;
        state.userData = {};
        state.loading = false;
    }
  },
  extraReducers(builder){}
});


export const {login, logout} = authSlicer.actions;

export default authSlicer;