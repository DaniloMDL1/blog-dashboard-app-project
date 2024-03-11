import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import SignInPage from "./pages/SignInPage"
import CssBaseline from '@mui/material/CssBaseline'
import HeaderLayout from "./layouts/HeaderLayout"
import { ThemeProvider, createTheme } from "@mui/material"
import { useSelector } from "react-redux"

const App = () => {
  const { mode } = useSelector((state) => state.user)

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
          <Route path="/signup" element={<SignUpPage />}/>
          <Route path="/signin" element={<SignInPage />}/>
        </Route>
      </Routes>
    </ThemeProvider>
    </>
  )
}

export default App
