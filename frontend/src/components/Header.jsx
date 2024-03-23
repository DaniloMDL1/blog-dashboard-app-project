import { useTheme } from "@emotion/react"
import { Avatar, Button, CircularProgress, Container, IconButton, Link, Menu, MenuItem, Stack, Tooltip } from "@mui/material"
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import PostAddIcon from '@mui/icons-material/PostAdd'
import SearchIcon from '@mui/icons-material/Search'
import { useDispatch, useSelector } from "react-redux"
import { Link as RouterLink, useLocation } from "react-router-dom"
import { setMode, signOut } from "../redux/user/userSlice"
import { useEffect, useState } from "react"
import { useSignoutMutation } from "../redux/user/authApi"
import SearchInputModal from "./SearchInputModal"

const Header = () => {
    const theme = useTheme()
    
    const { user, mode } = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const { pathname } = useLocation()

    const [openSearchModal, setOpenSearchModal] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleOpenSearchModal = () => setOpenSearchModal(true)
    const handleCloseSearchModal = () => setOpenSearchModal(false)

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const [ signOutApi, { isLoading }] = useSignoutMutation()

    const handleSignOut = async () => {
        try {
            const res = await signOutApi().unwrap()

            dispatch(signOut())
            
        } catch(error) {
            console.error("Error", error.message)
        }
    }

    useEffect(() => {
        return () => setAnchorEl(null)
    }, [pathname])

    return (
        <>
            {!user ? (
                <Container maxWidth="md" sx={{ py: "10px" }}>
                    <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                        <Link component={RouterLink} to={"/"} variant="h5" sx={{ textDecoration: "none", color: theme.palette.text.primary, "&:hover": { color: theme.palette.primary.main}}}>
                            Blog App
                        </Link>
                        <Stack flexDirection={"row"} alignItems={"center"} gap={3}>
                            <Tooltip title="Search" arrow>
                                <IconButton onClick={handleOpenSearchModal} sx={{ color: theme.palette.mode === "light" ? "#424242" : "#9e9e9e" }}>
                                    <SearchIcon />
                                </IconButton>
                            </Tooltip>
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
                    <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                        <Link component={RouterLink} to={"/"} variant="h5" sx={{ textDecoration: "none", color: theme.palette.text.primary, "&:hover": { color: theme.palette.primary.main}}}>
                            Blog App
                        </Link>
                        <Stack flexDirection={"row"} alignItems={"center"} gap={3}>
                            <Tooltip title="Search" arrow>
                                <IconButton onClick={handleOpenSearchModal} sx={{ color: theme.palette.mode === "light" ? "#424242" : "#9e9e9e" }}>
                                    <SearchIcon />
                                </IconButton>
                            </Tooltip>
                            <SearchInputModal open={openSearchModal} handleClose={handleCloseSearchModal}/>
                            <Tooltip title="Create Post" arrow>
                                <Button component={RouterLink} to={"/create-post"} variant="contained" sx={{ height: "32px", display: "flex", alignItems: "center", gap: "3px"}}>
                                    <PostAddIcon />
                                </Button>
                            </Tooltip>
                            <Tooltip title="Switch theme" arrow>
                                <IconButton onClick={() => dispatch(setMode())} sx={{ color: theme.palette.text.primary }}>
                                    {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
                                </IconButton>
                            </Tooltip>
                            <IconButton onClick={handleClick}>
                                <Avatar src={user.profilePicture} sx={{ width: 32, height: 32 }} />
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
                                <MenuItem component={RouterLink} to={`/profile/${user.username}`}>Profile</MenuItem>
                                <MenuItem component={RouterLink} to={"/your-posts?page=1"}>Your Posts</MenuItem>
                                {user.isAdmin && (
                                    <MenuItem component={RouterLink} to={`/dashboard/users`}>Dashboard</MenuItem>
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