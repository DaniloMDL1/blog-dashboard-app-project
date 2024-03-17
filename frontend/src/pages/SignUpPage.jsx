import { useTheme } from "@emotion/react"
import { Box, Button, CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, Stack, TextField, Typography } from "@mui/material"
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useState } from "react"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useSignupMutation } from "../redux/user/authApi"
import { signUp } from "../redux/user/userSlice"
import { toast } from "react-toastify"

const SignUpPage = () => {
    const theme = useTheme()

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const [showPassword, setShowPassword] = useState(false)
    const [inputs, setInputs] = useState({
        fullName: "",
        username: "",
        email: "",
        password: ""
    })

    const [ signupApi, { isLoading }] = useSignupMutation()

    const handleSignUp = async (e) => {
        e.preventDefault()
        try {
            const res = await signupApi(inputs).unwrap()

            dispatch(signUp({ ...res }))
            navigate("/")
            
        } catch(error) {
            if(error.data.error) {
                toast.error(error.data.error)
                return
            } else {
                toast.error(error.message)
                return
            }
        }
    }

    return (
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ minHeight: "calc(100vh - 52px)"}}>
            <Box width={{ xs: "280px", sm: "340px"}} sx={{ border: "1px solid", borderColor: theme.palette.mode === "light" ? "#d4d4d8" : "#404040", borderRadius: "8px", p: 2}}>
                <Typography variant="h6" textAlign={"center"} mb={2}>
                    Sign Up
                </Typography>
                <Stack onSubmit={handleSignUp} component={"form"} gap={"12px"} mb={1}>
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
                    <FormControl size="small">
                        <InputLabel>Password</InputLabel>
                        <OutlinedInput 
                            type={showPassword ? "text" : "password"}
                            label="Password"
                            size="small"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            autoComplete="off"
                            value={inputs.password}
                            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                        />
                    </FormControl>
                    <Button type="submit" disabled={isLoading} variant="contained" sx={{
                        "&.Mui-disabled": {
                            backgroundColor: theme.palette.primary.main
                        }
                    }}>
                        {isLoading ? <CircularProgress size={24} sx={{ color: "#ffffff"}}/> : "Sign Up"}
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