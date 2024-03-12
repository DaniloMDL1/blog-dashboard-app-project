import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: null,
    mode: "light"
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light"
        },
        setSignUpUser: (state, action) => {
            state.user = action.payload.user
        },
        setSignInUser: (state, action) => {
            state.user = action.payload.user
        },
        signOutUser: (state) => {
            state.user = null
        },
        updateUserProfile: (state, action) => {
            state.user = action.payload.user
        },
        deleteUser: (state) => {
            state.user = null
        }
    }
})

export const { setMode, setSignUpUser, setSignInUser, signOutUser, updateUserProfile, deleteUser } = userSlice.actions

export default userSlice.reducer