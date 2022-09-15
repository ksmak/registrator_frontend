import { configureStore } from "@reduxjs/toolkit";
import userRequestsReducer from "../slices/userRequestsSlice";

export default configureStore({
    reducer: {
        userRequests: userRequestsReducer,
    },
})