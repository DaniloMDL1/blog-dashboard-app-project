import { useTheme } from "@emotion/react"
import { Box, Button, CircularProgress, Modal, Stack, TextField } from "@mui/material"
import { useState } from "react"
import { useUpdateCommentMutation } from "../redux/comments/commentsApi"
import { toast } from "react-toastify"

const UpdateCommentModal = ({ open, handleClose, comment, commentId }) => {
    const theme = useTheme()

    const [updateCommentText, setUpdateCommentText] = useState(comment)

    // update comment
    const [ updateCommentApi, { isLoading } ] = useUpdateCommentMutation()

    const handleUpdateComment = async () => {
        try {
            const res = await updateCommentApi({ commentId, comment: updateCommentText }).unwrap()

            toast.success("Comment has been updated successfully.")
            handleClose()
            
        } catch(error) {
            if(error.data) {
                toast.error(error.data.error)
            } else {
                toast.error(error.message)
            }
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Box sx={{ width: {xs: "280px", sm: "460px"}, height: "160px", backgroundColor: theme.palette.background.default, border: "none", p: 2}}>
                <Stack>
                    <TextField 
                        autoComplete="off"
                        multiline
                        rows={2}
                        fullWidth
                        value={updateCommentText}
                        onChange={(e) => setUpdateCommentText(e.target.value)}
                    />
                    <Stack mt={2} flexDirection={"row"} alignItems={"center"} gap={3}>
                        <Button onClick={handleUpdateComment} disabled={isLoading} variant="contained" sx={{ width: "80px", "&.Mui-disabled": {
                            backgroundColor: theme.palette.primary.main
                        }}}>
                            {isLoading ? <CircularProgress size={24} sx={{ color: "#ffffff"}}/> : "Save"}
                        </Button>
                        <Button onClick={() => {
                            handleClose()
                            setUpdateCommentText(comment)
                        }} sx={{ backgroundColor: "#757575", color: "#ffffff", "&:hover": {
                            backgroundColor: "#616161"
                        }, fontSize: {xs: "13px", sm: "15px"}, width: "80px"}}>
                            Cancel
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Modal>
    )
}

export default UpdateCommentModal