import { useTheme } from "@emotion/react"
import { Box, Button, CircularProgress, Modal, Stack, Typography } from "@mui/material"

const DeleteAccountModal = ({ open, handleClose, handleDeleteUserAccount, isLoading }) => {
    const theme = useTheme()

    return (
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
                        <Button onClick={handleDeleteUserAccount} disabled={isLoading} variant="contained" sx={{ backgroundColor: "#f44336", color: "#ffffff", "&:hover": {
                            backgroundColor: "#d32f2f"
                        }, fontSize: {xs: "13px", sm: "15px"}, width: "80px", height: "37px", "&.Mui-disabled": {
                            backgroundColor: "#f44336"
                        }}}>
                             {isLoading ? <CircularProgress size={16} sx={{ color: "#ffffff"}}/> : "Delete"}
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
    )
}

export default DeleteAccountModal