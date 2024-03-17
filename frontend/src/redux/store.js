import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./user/userSlice"
import { api } from "./api"

const store = configureStore({
    reducer: {
        user: userReducer,
        [api.reducerPath]: api.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
    devTools: true
})

export default store