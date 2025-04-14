import { configureStore } from "@reduxjs/toolkit";
import authSlicer from "./slicer/auth";
// import chatSlicer from "./slicer/chat";
// import api from "./api/api";


const store = configureStore({
    reducer: {
        [authSlicer.name] : authSlicer.reducer,
        // [chatSlicer.name] : chatSlicer.reducer,
        // [api.reducerPath] : api.reducer,
    },
    // middleware:(defaultMiddleware)=>[...defaultMiddleware(),api.middleware],
})

export default store; 