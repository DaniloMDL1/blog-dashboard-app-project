import { useTheme } from "@emotion/react"
import { Avatar, CircularProgress, Container, IconButton, Link, Menu, MenuItem, Stack } from "@mui/material"
import { Link as RouterLink, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setMode } from "../redux/user/userSlice"
import { useEffect, useState } from "react"
import useSignOut from "../hooks/useSignOut"
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

const Header = () => {
    const theme = useTheme()
    const { mode, user } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const { isLoading, handleSignOut } = useSignOut()
    const { pathname } = useLocation()

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    useEffect(() => {
        return () => {
            setAnchorEl(null)
        }
    }, [pathname])

    return (
        <>
            {!user ? (
                <Container maxWidth="md" sx={{ py: "10px" }}>
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
                        </Stack>
                    </Stack>
                </Container>
            ) : (
                <Container maxWidth="md" sx={{ py: "10px" }}>
                    <Stack flexDirection={"row"} justifyContent={"space-between"}>
                        <Link component={RouterLink} to={"/"} variant="h5" sx={{ textDecoration: "none", color: theme.palette.text.primary, "&:hover": { color: theme.palette.primary.main}}}>
                            Blog App
                        </Link>
                        <Stack flexDirection={"row"} alignItems={"center"} gap={3}>
                            <IconButton sx={{ color: theme.palette.text.primary }} onClick={() => dispatch(setMode())}>
                                {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
                            </IconButton>
                            <IconButton onClick={handleClick}>
                                <Avatar src={user.profilePicture} sx={{ width: 32, height: 32 }}>{user.username[0].toUpperCase()}</Avatar>
                            </IconButton>
                            <Menu
                                elevation={3}
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                sx={{
                                    "& .MuiMenu-list": {
                                        py: 0,
                                        width: "140px"
                                    },
                                    "& .MuiMenuItem-root": {
                                        py: 1,
                                    }
                                }}
                            >
                                <MenuItem component={RouterLink} to="/profile">Profile</MenuItem>
                                {user.isAdmin && (
                                    <MenuItem component={RouterLink} to="/dashboard/users">Dashboard</MenuItem>
                                )}
                                <MenuItem onClick={handleSignOut} disabled={isLoading}>
                                    {isLoading ? <CircularProgress size={18}/> : "Sign Out"}
                                </MenuItem>
                            </Menu>
                        </Stack>
                    </Stack>
                </Container>
            )}
        </>
    )
}

export default Header