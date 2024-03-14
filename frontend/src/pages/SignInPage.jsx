import { useTheme } from "@emotion/react"
import { Box, Stack, TextField, Typography, Button, Link, Alert, CircularProgress } from "@mui/material"
import axios from "axios"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { setSignInUser } from "../redux/user/userSlice"

const SignInPage = () => {
    const theme = useTheme()
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    })
    const [errorMsg, setErrorMsg] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSignIn = async (e) => {
        e.preventDefault()
        if(!inputs.email.trim() || !inputs.password.trim()) {
            setErrorMsg("All fields are required.")
            return
        }
        setIsLoading(true)
        try {
            const res = await axios.post("/api/auth/signin", inputs)

            dispatch(setSignInUser({ user: res.data }))
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
                    Sign In
                </Typography>
                {errorMsg && (
                    <Alert severity="error" sx={{ my: "20px"}}>
                        {errorMsg}
                    </Alert>
                )}
                <Stack onSubmit={handleSignIn} component={"form"} gap={"8px"} mb={1}>
                    <TextField 
                        type="text"
                        label="Email Address"
                        autoComplete="off"
                        size="small"
                        value={inputs.email}
                        onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                    />
                    <TextField 
                        type="password"
                        label="Password"
                        autoComplete="off"
                        size="small"
                        value={inputs.password}
                        onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                    />
                    <Button type="submit" disabled={isLoading} variant="contained" sx={{
                        "&.Mui-disabled": {
                            backgroundColor: theme.palette.primary.main
                        }
                    }}>
                        {isLoading ? <CircularProgress size={24} sx={{ color: "#ffffff"}}/> : "Sign In"}
                    </Button>
                </Stack>
                <Link component={RouterLink} to={"/signup"} variant="body1">
                    Don't have an account? Sign Up
                </Link>
            </Box>
        </Box>
    )
}

export default SignInPage