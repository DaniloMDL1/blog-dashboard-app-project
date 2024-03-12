import { Routes, Route, Navigate } from "react-router-dom"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import SignInPage from "./pages/SignInPage"
import ProfilePage from "./pages/ProfilePage"
import CssBaseline from '@mui/material/CssBaseline'
import HeaderLayout from "./layouts/HeaderLayout"
import { ThemeProvider, createTheme } from "@mui/material"
import { useSelector } from "react-redux"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const { mode, user } = useSelector((state) => state.user)

  const theme = createTheme({
    palette: {
      mode: mode
    }
  })

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route element={<HeaderLayout />}>
            <Route path="/" element={<HomePage />}/>
            <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to={"/signin"}/>}/>
            <Route path="/signup" element={<SignUpPage />}/>
            <Route path="/signin" element={<SignInPage />}/>
          </Route>
        </Routes>
      </ThemeProvider>
      <ToastContainer theme={mode === "light" ? "light" : "dark"} autoClose={3000} position="top-center" pauseOnHover={false} pauseOnFocusLoss={false}/>
    </>
  )
}

export default App
