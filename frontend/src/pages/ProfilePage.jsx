import { Alert, Avatar, Box, Button, CircularProgress, FormControl, InputLabel, Stack, TextField, Typography } from "@mui/material"
import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import usePreviewImg from "../hooks/usePreviewImg"
import { toast } from "react-toastify"
import axios from "axios"
import { updateUserProfile } from "../redux/user/userSlice"

const ProfilePage = () => {
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
            <Stack onSubmit={handleUpdateProfile} component={"form"} width={{ xs: "300px", sm: "420px"}} sx={{ border: "1px solid grey", p: 3}}>
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
                        type="text"
                        size="small"
                        placeholder="Password"
                        autoComplete="off"
                        sx={{ mt: 5}}
                        value={inputs.password}
                        onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                    />
                </FormControl>
                <Button type="submit" sx={{ textTransform: "capitalize", fontSize: "15px", mt: "18px"}} disabled={isLoading} variant="contained">
                    {isLoading ? <CircularProgress size={18}/> : "Update Profile"}
                </Button>
            </Stack>
        </Box>
    )
}

export default ProfilePage