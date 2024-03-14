import { Alert, Avatar, Box, Button, CircularProgress, FormControl, InputLabel, Modal, Stack, TextField, Typography } from "@mui/material"
import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import usePreviewImg from "../hooks/usePreviewImg"
import { toast } from "react-toastify"
import axios from "axios"
import { updateUserProfile } from "../redux/user/userSlice"
import { useTheme } from "@emotion/react"
import useDeleteUser from "../hooks/useDeleteUser"
import useSignOut from "../hooks/useSignOut"

const ProfilePage = () => {
    const theme = useTheme()
    const avatarRef = useRef(null)
    const { user } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [inputs, setInputs] = useState({
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        password: ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const { previewImg, handlePreviewImgChange, errorMsg } = usePreviewImg()
    const { handleDeleteUser, isLoading: isDeleteLoading } = useDeleteUser()
    const { handleSignOut } = useSignOut()
    const [open, setOpen] = useState(false)

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await axios.put(`/api/users/update/profile/${user._id}`, {
                ...inputs,
                profilePicture: previewImg
            }, { withCredentials: true })

            dispatch(updateUserProfile({ user: res.data }))
            toast.success("Profile has been updated successfully.")
            
        } catch(error) {
            if(error.response && error.response.status === 400) {
                const errorMsg = error.response.data.error
                toast.error(errorMsg)
            } else {
                toast.error("An error occured on the server.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ minHeight: "calc(100vh - 68px)"}}>
            <Stack onSubmit={handleUpdateProfile} component={"form"} width={{ xs: "300px", sm: "420px"}} sx={{ border: "1px solid", borderColor: theme.palette.mode === "light" ? "#d4d4d8" : "#404040", borderRadius: "8px", p: 3}}>
                <Typography variant="h6" mb={"14px"}>Update Profile</Typography>
                {errorMsg && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMsg}
                    </Alert>
                )}
                <Stack flexDirection={"row"} alignItems={"center"} gap={4}>
                    <Avatar src={previewImg || user.profilePicture} sx={{ width: 64, height: 64 }}/>
                    <input type="file" hidden ref={avatarRef} onChange={handlePreviewImgChange}/>
                    <Button onClick={() => avatarRef.current.click()} variant="contained">Change Avatar</Button>
                </Stack>
                <FormControl >
                    <InputLabel sx={{ mx: "-10px"}}>Full Name</InputLabel>
                    <TextField 
                        type="text"
                        size="small"
                        placeholder="Full Name"
                        autoComplete="off"
                        sx={{ mt: 5}}
                        value={inputs.fullName}
                        onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
                    />
                </FormControl>
                <FormControl>
                    <InputLabel sx={{ mx: "-10px"}}>Username</InputLabel>
                    <TextField 
                        type="text"
                        size="small"
                        placeholder="Username"
                        autoComplete="off"
                        sx={{ mt: 5}}
                        value={inputs.username}
                        onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                    />
                </FormControl>
                <FormControl>
                    <InputLabel sx={{ mx: "-10px"}}>Email Address</InputLabel>
                    <TextField 
                        type="text"
                        size="small"
                        placeholder="Email Address"
                        autoComplete="off"
                        sx={{ mt: 5}}
                        value={inputs.email}
                        onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                    />
                </FormControl>
                <FormControl>
                    <InputLabel sx={{ mx: "-10px"}}>Password</InputLabel>
                    <TextField 
                        type="password"
                        size="small"
                        placeholder="Password"
                        autoComplete="off"
                        sx={{ mt: 5}}
                        value={inputs.password}
                        onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                    />
                </FormControl>
                <Button type="submit" sx={{ fontSize: "15px", mt: "18px", "&.Mui-disabled": {
                    backgroundColor: theme.palette.primary.main
                }, height: "40px"}} disabled={isLoading} variant="contained">
                    {isLoading ? <CircularProgress size={24} sx={{ color: "#ffffff"}}/> : "Update Profile"}
                </Button>
                <Stack flexDirection={"row"} justifyContent={"space-between"} px={1}>
                    <Box onClick={handleOpen} sx={{ color: "#d32f2f", cursor: "pointer", mt: "12px"}}>
                        Delete Account
                    </Box>
                    <Box onClick={handleSignOut} sx={{ color: "#d32f2f", cursor: "pointer", mt: "12px"}}>
                        Sign Out
                    </Box>
                </Stack>
                <Modal
                    open={open}
                    onClose={handleClose}
                >
                    <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: {xs: "260px", sm: "460px", height: "140px", backgroundColor: theme.palette.background.default, border: "none" }}}>
                        <Box sx={{ p: 3}}>
                            <Typography sx={{ fontSize: { xs: "14px", sm: "18px"}}}>
                                Are you sure you want to delete your account?
                            </Typography>
                            <Stack flexDirection={"row"} mt={3} alignItems={"center"} gap={3} justifyContent={"flex-end"}>
                                <Button onClick={() => handleDeleteUser(user._id)} disabled={isDeleteLoading} variant="contained" sx={{ backgroundColor: "#f44336", color: "#ffffff", "&:hover": {
                                    backgroundColor: "#d32f2f"
                                }, fontSize: {xs: "13px", sm: "15px"}, width: "80px", height: "37px", "&.Mui-disabled": {
                                    backgroundColor: "#f44336"
                                }}}>
                                    {isDeleteLoading ? <CircularProgress size={16} sx={{ color: "#ffffff"}}/> : "Delete"}
                                </Button>
                                <Button onClick={handleClose} sx={{ backgroundColor: "#757575", color: "#ffffff", "&:hover": {
                                    backgroundColor: "#616161"
                                }, fontSize: {xs: "13px", sm: "15px"}, width: "80px"}}>
                                    Cancel
                                </Button>
                            </Stack>
                        </Box>
                    </Box>
                </Modal>
            </Stack>
        </Box>
    )
}

export default ProfilePage