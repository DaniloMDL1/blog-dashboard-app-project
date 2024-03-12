import { useTheme } from "@emotion/react"
import { Box, Stack, TextField, Typography, Button, Link, CircularProgress, Alert } from "@mui/material"
import { useState } from "react"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setSignUpUser } from "../redux/user/userSlice"

const SignUpPage = () => {
    const theme = useTheme()
    const [inputs, setInputs] = useState({
        fullName: "",
        username: "",
        email: "",
        password: ""
    })
    const [errorMsg, setErrorMsg] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSignUp = async (e) => {
        e.preventDefault()
        if(!inputs.fullName.trim() || !inputs.username.trim() || !inputs.email.trim() || !inputs.password.trim()) {
            setErrorMsg("All fields are required.")
            return
        }
        setIsLoading(true)
        try {
            const res = await axios.post("/api/auth/signup", inputs)

            dispatch(setSignUpUser({ user: res.data }))
            navigate("/")
            
        } catch(error) {
            if(error.response && error.response.status === 400) {
                const errorMessage = error.response.data.error
                setErrorMsg(errorMessage)
                console.error("Error: " + errorMessage)
            } else {
                setErrorMsg("An error occured on the server.")
                console.error("An error occured: " + error.message)
            }

        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ minHeight: "calc(100vh - 52px)"}}>
            <Box width={{ xs: "280px", sm: "340px"}} sx={{ border: "1px solid", borderColor: theme.palette.mode === "light" ? "#d4d4d8" : "#404040", borderRadius: "8px", p: 2}}>
                <Typography variant="h6" textAlign={"center"} mb={2}>
                    Sign Up
                </Typography>
                {errorMsg && (
                    <Alert severity="error" sx={{ my: "10px"}}>
                        {errorMsg}
                    </Alert>
                )}
                <Stack onSubmit={handleSignUp} component={"form"} gap={"8px"} mb={1}>
                    <TextField 
                        type="text"
                        label="Full Name"
                        size="small"
                        autoComplete="off"
                        value={inputs.fullName}
                        onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
                    />
                    <TextField 
                        type="text"
                        label="Username"
                        size="small"
                        autoComplete="off"
                        value={inputs.username}
                        onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                    />
                    <TextField 
                        type="text"
                        label="Email Address"
                        size="small"
                        autoComplete="off"
                        value={inputs.email}
                        onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                    />
                    <TextField 
                        type="password"
                        label="Password"
                        size="small"
                        autoComplete="off"
                        value={inputs.password}
                        onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                    />
                    <Button type="submit" disabled={isLoading} variant="contained">
                        {isLoading ? <CircularProgress size={20}/> : "Sign Up"}
                    </Button>
                </Stack>
                <Link component={RouterLink} to={"/signin"} variant="body1">
                    Already have an account? Sign In
                </Link>
            </Box>
        </Box>
    )
}

export default SignUpPage