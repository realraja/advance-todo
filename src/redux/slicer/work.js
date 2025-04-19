import { WORK_DATA } from "@/constants/localConst";
import { getOrSaveLocalStorage } from "@/lib/localStorage";
import { createSlice } from "@reduxjs/toolkit";

const workSlicer = createSlice({
  name: "work",
  initialState: {
    workData:  getOrSaveLocalStorage({key:WORK_DATA,get:true}) || [],
    workDataLoading:true,
  },
  reducers: {
    setWorkData: (state,action) =>{
        state.workData = action.payload;
        state.workDataLoading = false;
    },
    clearWorkData: (state,action) =>{
        state.workData = [];
        state.workDataLoading = false;
    }
  },
  extraReducers(builder){}
});


export const {setWorkData,clearWorkData} = workSlicer.actions;

export default workSlicer;