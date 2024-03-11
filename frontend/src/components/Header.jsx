import { useTheme } from "@emotion/react"
import { Container, IconButton, Link, Stack } from "@mui/material"
import { Link as RouterLink } from "react-router-dom"
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { useDispatch, useSelector } from "react-redux"
import { setMode } from "../redux/user/userSlice"

const Header = () => {
    const theme = useTheme()
    const { mode } = useSelector((state) => state.user)
    const dispatch = useDispatch()

    return (
        <Container maxWidth="md" sx={{ py: "10px"}}>
            <Stack flexDirection={"row"} justifyContent={"space-between"}>
                <Link component={RouterLink} to={"/"} variant="h5" sx={{ textDecoration: "none", color: theme.palette.text.primary, "&:hover": { color: theme.palette.primary.main}}}>
                    Blog App
                </Link>
                <Stack flexDirection={"row"} alignItems={"center"} gap={3}>
                    <Link component={RouterLink} to={"/signup"} variant="body1">
                        Sign Up
                    </Link>
                    <Link component={RouterLink} to={"/signin"} variant="body1">
                        Sign In
                    </Link>
                    <IconButton sx={{ color: theme.palette.text.primary }} onClick={() => dispatch(setMode())}>
                        {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
                    </IconButton>
                </Stack>
            </Stack>
        </Container>
    )
}

export default Header