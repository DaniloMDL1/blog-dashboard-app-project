import { useTheme } from "@emotion/react"
import { Box, Button, CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, Stack, TextField, Typography } from "@mui/material"
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useState } from "react"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useSigninMutation } from "../redux/user/authApi"
import { signIn } from "../redux/user/userSlice"
import { toast } from "react-toastify"

const SignInPage = () => {
  const theme = useTheme()

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const [showPassword, setShowPassword] = useState(false)
  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  })

  const [ signInApi, { isLoading } ] = useSigninMutation()

  const handleSignIn = async (e) => {
    e.preventDefault()
    try {
      const res = await signInApi(inputs).unwrap()

      dispatch(signIn({ ...res }))
      navigate("/")
      
    } catch(error) {
      if(error.data) {
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
              Sign In
          </Typography>
          <Stack onSubmit={handleSignIn} component={"form"} gap={"12px"} mb={1}>
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
              <Button type="submit" variant="contained" sx={{
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