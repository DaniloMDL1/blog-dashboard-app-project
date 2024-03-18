import { useTheme } from "@emotion/react"
import { categories } from "../utils/constants"
import { Button, Container, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material"
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'

const UpdatePostPage = () => {
    const theme = useTheme()

    return (
        <Container maxWidth={"xs"} sx={{ mt: "40px", py: "10px"}}>
            <Typography variant="h6" textAlign={"center"} sx={{ mb: "14px"}}>
                Create Post
            </Typography>
            <Stack component={"form"} gap={3}>
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
                    >
                        {categories.map((c) => (
                            <MenuItem key={c.name} value={c.name}>
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
                />
                <TextField 
                    label="Description"
                    autoComplete="off"
                    multiline
                    rows={3}
                />
                <IconButton sx={{ alignSelf: "flex-start"}}>
                    <AddPhotoAlternateIcon sx={{ width: "32px", height: "32px"}}/>
                </IconButton>
                <input type="file" hidden/>
                <Button type="submit" variant="contained" sx={{
                    "&.Mui-disabled": {
                        backgroundColor: theme.palette.primary.main
                    }
                }}>
                    Update Post
                </Button>             
            </Stack>
        </Container>
    )
}

export default UpdatePostPage