import { useTheme } from "@emotion/react"
import { Box, Button, CircularProgress, Container, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material"
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import ClearIcon from '@mui/icons-material/Clear'
import { categories } from "../utils/constants"
import { useRef, useState } from "react"
import usePreviewImg from "../hooks/usePreviewImg"
import { useCreatePostMutation } from "../redux/posts/postsApi"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

const CreatePostPage = () => {
    const theme = useTheme()

    const navigate = useNavigate()

    const { user } = useSelector((state) => state.user)

    const { handleImgChange, previewImg, setPreviewImg } = usePreviewImg()

    const [inputs, setInputs] = useState({
        title: "",
        desc: "",
        category: ""
    })
    const postPictureRef = useRef(null)

    const [ createPostApi, { isLoading } ] = useCreatePostMutation()

    const handleCreatePost = async (e) => {
        e.preventDefault()
        try {
            const res = await createPostApi({ ...inputs, userId: user._id, postPicture: previewImg }).unwrap()

            toast.success("Post is created successfully.")
            setInputs({
                title: "",
                desc: "",
                category: ""
            })
            setPreviewImg(null)
            navigate(`/post/${res.slug}`)
            
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
        <Container maxWidth={"xs"} sx={{ mt: "40px", py: "10px"}}>
            <Typography variant="h6" textAlign={"center"} sx={{ mb: "14px"}}>
                Create Post
            </Typography>
            <Stack onSubmit={handleCreatePost} component={"form"} gap={3}>
                <FormControl size="small">
                    <InputLabel>Category</InputLabel>
                    <Select
                        label="Category"
                        MenuProps={{
                            anchorOrigin: {
                                vertical: "bottom",
                                horizontal: 0
                            },
                            transformOrigin: {
                                vertical: "top",
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
                            <MenuItem key={c.name} value={c.urlName}>
                                {c.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField 
                    label="Post Title"
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
                <IconButton onClick={() => postPictureRef.current.click()} sx={{ alignSelf: "flex-start"}}>
                    <AddPhotoAlternateIcon sx={{ width: "32px", height: "32px"}}/>
                </IconButton>
                <input type="file" hidden ref={postPictureRef} onChange={handleImgChange}/>
                {previewImg && (
                    <Box position={"relative"} mt={2}>
                        <IconButton onClick={() => setPreviewImg(null)} sx={{ position: "absolute", top: "-44px", right: "4px"}}>
                            <ClearIcon sx={{ width: "30px", height: "30px"}}/>
                        </IconButton>
                        <img src={previewImg} style={{ borderRadius: "6px", overflow: "hidden", width: "100%"}}/>
                    </Box>
                )}
                <Button type="submit" variant="contained" disabled={isLoading} sx={{
                    "&.Mui-disabled": {
                        backgroundColor: theme.palette.primary.main
                    }
                }}>
                    {isLoading ? <CircularProgress size={24} sx={{ color: "#ffffff"}}/> : "Post"}   
                </Button>             
            </Stack>
        </Container>
    )
}

export default CreatePostPage