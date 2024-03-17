import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: localStorage.getItem("user-info") ? JSON.parse(localStorage.getItem("user-info")) : null,
    mode: localStorage.getItem("theme") || "light"
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light"
            localStorage.setItem("theme", state.mode)
        },
        signUp: (state, action) => {
            state.user = action.payload
            localStorage.setItem("user-info", JSON.stringify(action.payload))
        },
        signOut: (state) => {
            state.user = null
            localStorage.removeItem("user-info")
            localStorage.removeItem("theme")
        },
        signIn: (state, action) => {
            state.user = action.payload
            localStorage.setItem("user-info", JSON.stringify(action.payload))
        },
        updateUserProfile: (state, action) => {
            state.user = action.payload
            localStorage.setItem("user-info", JSON.stringify(action.payload))
        },
        deleteUserAccount: (state) => {
            state.user = null
            localStorage.removeItem("user-info")
        }
    }
})

export const { setMode, signUp, signOut, signIn, updateUserProfile, deleteUserAccount } = userSlice.actions

export default userSlice.reducer