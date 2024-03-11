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
        }
    }
})

export const { setMode, setSignUpUser, setSignInUser } = userSlice.actions

export default userSlice.reducer