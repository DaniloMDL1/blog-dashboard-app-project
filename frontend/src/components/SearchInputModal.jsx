import { useTheme } from "@emotion/react"
import { Box, FormControl, IconButton, InputAdornment, Modal, OutlinedInput } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search'
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const SearchInputModal = ({ open, handleClose }) => {
    const theme = useTheme()

    const navigate = useNavigate()
    const { search } = useLocation()

    const [searchTerm, setSearchTerm] = useState("")

    const handleSearch = (e) => {
        e.preventDefault()
        if(!searchTerm.trim()) {
            toast.error("You need to type something to get results.")
            return
        }

        const searchParams = new URLSearchParams(search)
        searchParams.set("searchTerm", searchTerm)
        navigate(`/search?searchTerm=${searchTerm}`)
        setSearchTerm("")
        handleClose()
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={{ position: "absolute", top: "13%", left: "50%", transform: "translate(-50%, -50%)", width: {xs: "300px", sm: "460px", backgroundColor: theme.palette.background.default, border: "none", borderRadius: "9999PX" }}}>
                <FormControl onSubmit={handleSearch} component={"form"} size="small" fullWidth>
                    <OutlinedInput 
                        type="text"
                        size="small"
                        placeholder="Search posts"
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton onClick={() => {
                                    navigate("/search")
                                    handleClose()
                                }} sx={{ color: theme.palette.mode === "light" ? "#424242" : "#9e9e9e" }}>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                        autoComplete="off"
                        sx={{
                            "&.MuiOutlinedInput-root": {
                                borderRadius: "9999px"
                            }
                        }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </FormControl>
            </Box>
        </Modal>
    )
}

export default SearchInputModal