import { useTheme } from "@emotion/react"
import { categories } from "../utils/constants"
import { Button, CircularProgress, Container, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material"
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useGetPostQuery, useUpdatePostMutation } from "../redux/posts/postsApi"
import usePreviewImg from "../hooks/usePreviewImg"
import { toast } from "react-toastify"

const UpdatePostPage = () => {
    const theme = useTheme()

    const { postId } = useParams()
    const navigate = useNavigate()

    const { data: postData } = useGetPostQuery(postId)

    const [inputs, setInputs] = useState({
        title: "",
        desc: "",
        category: ""
    })
    const postPictureRef = useRef(null)

    const { handleImgChange, previewImg, setPreviewImg } = usePreviewImg()

    useEffect(() => {
        if(postData) {
            setInputs({
                title: postData.title,
                desc: postData.desc,
                category: postData.category
            })
            setPreviewImg(postData.postPicture)
        }
    }, [postData, setInputs])

    const [ updatePostApi, { isLoading } ] = useUpdatePostMutation()

    const handleUpdatePost = async (e) => {
        e.preventDefault()
        try {
            const res = await updatePostApi({ ...inputs, postId, postPicture: previewImg }).unwrap()

            toast.success("Post has been successfully updated.")
            navigate(`/post/${res.slug}`)
            
        } catch(error) {
            if(error.data) {
                toast.error(error.data.error)
                return
            } else {
                toast.error(error.message)
            }
        }
    }

    return (
        <Container maxWidth={"xs"} sx={{ mt: "40px", py: "10px"}}>
            <Typography variant="h6" textAlign={"center"} sx={{ mb: "14px"}}>
                Update Post
            </Typography>
            <Stack onSubmit={handleUpdatePost} component={"form"} gap={3}>
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
                    <img src={previewImg}/>
                )}
                <Button type="submit" disabled={isLoading} variant="contained" sx={{
                    "&.Mui-disabled": {
                        backgroundColor: theme.palette.primary.main
                    }
                }}>
                    {isLoading ? <CircularProgress size={24} sx={{ color: "#ffffff"}}/> : "Update Post"} 
                </Button>             
            </Stack>
        </Container>
    )
}

export default UpdatePostPage