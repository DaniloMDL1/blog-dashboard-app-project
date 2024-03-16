import { useTheme } from "@emotion/react"
import { Avatar, Box, Button, CircularProgress, Container, FormControl, IconButton, InputLabel, Link, Menu, MenuItem, Modal, Select, Stack, TextField, Typography } from "@mui/material"
import { Link as RouterLink, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setMode } from "../redux/user/userSlice"
import { useEffect, useRef, useState } from "react"
import useSignOut from "../hooks/useSignOut"
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import AddIcon from '@mui/icons-material/Add'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import HideImageIcon from '@mui/icons-material/HideImage';
import { categories } from "../utils/constants"
import usePreviewImg from "../hooks/usePreviewImg"
import { toast } from "react-toastify"
import axios from "axios"

const Header = () => {
    const theme = useTheme()
    const { mode, user } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const { isLoading, handleSignOut } = useSignOut()
    const { pathname } = useLocation()
    const [openCreateModal, setOpenCreateModal] = useState(false)
    const [inputs, setInputs] = useState({
        title: "",
        desc: "",
        category: ""
    })
    const postPictureRef = useRef(null)
    const previewImgRef = useRef(null)
    const { handlePreviewImgChange, previewImg, errorMsg, setPreviewImg } = usePreviewImg()
    const [isCreatePostLoading, setIsCreatePostLoading] = useState(false)

    const handleOpenCreateModal = () => setOpenCreateModal(true)
    const handleCloseCreateModal = () => setOpenCreateModal(false)

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

    useEffect(() => {
        setTimeout(() => {
            previewImgRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
    }, [previewImg])

    const handleCreatePost = async (e) => {
        e.preventDefault()
        if(!inputs.title || !inputs.desc || !inputs.category) {
            toast.error("Title, description and category are required.")
            return
        }
        setIsCreatePostLoading(true)
        try {
            const res = await axios.post("/api/posts/create", {
                ...inputs,
                userId: user._id,
                postPicture: previewImg
            })

            console.log(res.data)
            toast.success("Post has been created successfully.")
            setInputs({
                title: "",
                desc: "",
                category: ""
            })
            handleCloseCreateModal()
            
        } catch(error) {
            toast.error(error.message)
        } finally {
            setIsCreatePostLoading(false)
        }
    }

    return (
        <>
            {!user ? (
                <Container maxWidth="md" sx={{ py: "10px" }}>
                    <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
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
                    <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
                        <Link component={RouterLink} to={"/"} variant="h5" sx={{ textDecoration: "none", color: theme.palette.text.primary, "&:hover": { color: theme.palette.primary.main}}}>
                            Blog App
                        </Link>
                        <Stack flexDirection={"row"} alignItems={"center"} gap={3}>
                            <Button onClick={handleOpenCreateModal} variant="contained" sx={{ height: "28px"}}>
                                <AddIcon />
                            </Button>
                            <Modal
                                open={openCreateModal}
                                onClose={handleCloseCreateModal}
                            >
                                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: { xs: "340px", sm: "400px"}, backgroundColor: theme.palette.background.default, border: "none", height: "410px", overflow: "auto"}}>
                                    <Typography textAlign={"center"} sx={{ mb: "12px", fontSize: "22px", mt: "5px"}}>
                                        Create Post
                                    </Typography>
                                    <Stack onSubmit={handleCreatePost} component={"form"} gap={2} px={4} py={2}>
                                        <TextField 
                                            label="Title"
                                            type="text"
                                            size="small"   
                                            autoComplete="off" 
                                            value={inputs.title}
                                            onChange={(e) => setInputs({ ...inputs, title: e.target.value })}
                                        />
                                        <TextField 
                                            label="Description"
                                            autoComplete="off"
                                            multiline
                                            rows={3}
                                            value={inputs.desc}
                                            onChange={(e) => setInputs({ ...inputs, desc: e.target.value })}
                                        />
                                        <FormControl size="small">
                                            <InputLabel>Category</InputLabel>
                                            <Select
                                                label="Category"
                                                MenuProps={{
                                                    anchorOrigin: {
                                                        vertical: "top",
                                                        horizontal: 0
                                                    },
                                                    transformOrigin: {
                                                        vertical: "bottom",
                                                        horizontal: 0
                                                    },
                                                    PaperProps: {
                                                        style: {
                                                            height: "300px"
                                                        }
                                                    }
                                                }}
                                                value={inputs.category}
                                                onChange={(e) => setInputs({ ...inputs, category: e.target.value })}
                                            >
                                                {categories.map((c) => (
                                                    <MenuItem key={c.name} value={c.name}>
                                                        {c.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {!previewImg ? (
                                            <IconButton onClick={() => postPictureRef.current.click()} sx={{ width: "40px"}}>
                                                <AddPhotoAlternateIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton onClick={() => setPreviewImg(null)} sx={{ width: "40px"}}>
                                                <HideImageIcon />
                                            </IconButton>
                                        )}
                                        <input type="file" hidden ref={postPictureRef} onChange={handlePreviewImgChange}/>
                                        {previewImg && (
                                            <img src={previewImg} ref={previewImgRef}/>
                                        )}
                                        <Button type="submit" variant="contained" disabled={isCreatePostLoading} sx={{
                                            "&.Mui-disabled": {
                                                backgroundColor: theme.palette.primary.main
                                            }
                                        }}>
                                            {isCreatePostLoading ? <CircularProgress size={24} sx={{ color: "#ffffff"}}/> : "Post"}   
                                        </Button>            
                                    </Stack>
                                </Box>
                            </Modal>
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