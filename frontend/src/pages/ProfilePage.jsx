import { useTheme } from "@emotion/react"
import { Avatar, Box, Button, CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack, TextField, Typography } from "@mui/material"
import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useDeleteUserAccountMutation, useUpdateUserProfileMutation } from "../redux/user/usersApi"
import { toast } from "react-toastify"
import { deleteUserAccount, signOut, updateUserProfile } from "../redux/user/userSlice"
import usePreviewImg from "../hooks/usePreviewImg"
import { useSignoutMutation } from "../redux/user/authApi"
import DeleteAccountModal from "../components/DeleteAccountModal"

const ProfilePage = () => {
    const theme = useTheme()

    const { mode, user } = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    const handleOpen = () => setOpenDeleteModal(true);
    const handleClose = () => setOpenDeleteModal(false);

    const [inputs, setInputs] = useState({
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        password: ""
    })
    const profilePictureRef = useRef(null)

    const { handleImgChange, previewImg } = usePreviewImg()

    // update user profile
    const [ updateUserProfileApi, { isLoading } ] = useUpdateUserProfileMutation()

    // signout user
    const [ signOutApi ] = useSignoutMutation()

    // delete user account
    const [ deleteUserAccountApi, { isLoading: isDeleteUserAccountLoading } ] = useDeleteUserAccountMutation()

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        try {
            const res = await updateUserProfileApi({ ...inputs, _id: user._id, profilePicture: previewImg }).unwrap()

            dispatch(updateUserProfile({ ...res }))
            toast.success("Profile has been successfully updated.")
            
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

    const handleSignOut = async () => {
        try {
            const res = await signOutApi().unwrap()

            dispatch(signOut())
            
        } catch(error) {
            console.error("Error" + error.message)
        }
    }

    const handleDeleteUserAccount = async () => {
        try {
            const res = await deleteUserAccountApi({ _id: user._id }).unwrap()

            dispatch(deleteUserAccount())
            toast.success("Your account has been successfully deleted.")
            
        } catch(error) {
            if(error.data) {
                toast.error(error.data.error)
                return
            } else {
                console.error("Error" + error.message)
            }
        }
    }

    return (
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{ minHeight: "calc(100vh - 68px)"}}>
            <Stack onSubmit={handleUpdateProfile} component={"form"} width={{ xs: "300px", sm: "420px"}} sx={{ border: "1px solid", borderColor: mode === "light" ? "#d4d4d8" : "#404040", borderRadius: "8px", p: 3}}>
                <Typography variant="h6" mb={"14px"}>Update Profile</Typography>
                <Stack flexDirection={"row"} alignItems={"center"} gap={4}>
                    <Avatar src={previewImg || user.profilePicture} sx={{ width: 64, height: 64 }}/>
                    <input type="file" hidden ref={profilePictureRef} onChange={handleImgChange}/>
                    <Button onClick={() => profilePictureRef.current.click()} variant="contained">Change Avatar</Button>
                </Stack>
                <FormControl>
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
                <Button variant="contained" type="submit" disabled={isLoading} sx={{ fontSize: "15px", mt: "18px", "&.Mui-disabled": { backgroundColor: theme.palette.primary.main }, height: "40px"}}>
                    {isLoading ? <CircularProgress size={24} sx={{ color: "#ffffff"}}/> : "Update Profile"}
                </Button>
                <Stack flexDirection={"row"} justifyContent={"space-between"} px={1}>
                    <Box onClick={handleOpen} sx={{ color: "#d32f2f", cursor: "pointer", mt: "12px"}}>
                        Delete Account
                    </Box>
                    <DeleteAccountModal open={openDeleteModal} handleClose={handleClose} handleDeleteUserAccount={handleDeleteUserAccount} isLoading={isDeleteUserAccountLoading}/>
                    <Box onClick={handleSignOut} sx={{ color: "#d32f2f", cursor: "pointer", mt: "12px"}}>
                        Sign Out
                    </Box>
                </Stack>
            </Stack>
        </Box>
    )
}

export default ProfilePage