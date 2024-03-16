import { useEffect, useState } from "react"
import axios from "axios"
import { Box, Button, CircularProgress, IconButton, Modal, Stack, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import DeleteIcon from '@mui/icons-material/Delete'
import { useTheme } from "@emotion/react"
import { toast } from "react-toastify"

const DashboardUsers = () => {
  const theme = useTheme()
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5
  })
  const [rowCountState, setRowCountState] = useState(0)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [open, setOpen] = useState(null)

  const handleOpen = (rowId) => setOpen(rowId)
  const handleClose = () => setOpen(null)

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const res = await axios.get(`/api/users/all?page=${paginationModel.page}&pageSize=${paginationModel.pageSize}`, { withCredentials: true })

        setUsers(res.data.users)
        setRowCountState(res.data.totalUsers)
        
      } catch(error) {
        console.error("Error" + error.message)
      } finally {
        setIsLoading(false)
      }
    }

    getAllUsers()
  }, [paginationModel])

  const handleDeleteAnotherUser = async (userId) => {
    setIsDeleteLoading(true)
    try {
      const res = await axios.delete(`/api/users/delete/${userId}`)

      const filterUser = users.filter((user) => user._id !== userId)
      setUsers(filterUser)
      handleClose()
      toast.success("User has been deleted successfully.")

    } catch(error) {
      console.error("Error" + error.message)
    } finally {
      setIsDeleteLoading(false)
    }
  }

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      width: 210
    }, 
    {
      field: "fullName",
      headerName: "Full Name", 
      width: 200
    },
    {
      field: "username",
      headerName: "Username", 
      width: 200
    },
    {
      field: "email",
      headerName: "Email Address", 
      width: 240
    },
    {
      field: "deleteUser",
      headerName: "Delete",
      width: 80,
      renderCell: (params) => {
        return (
          <>
            <IconButton sx={{ color: "#d32f2f"}} onClick={() => handleOpen(params.row._id)}>
              <DeleteIcon />
            </IconButton>
            <Modal
                open={open === params.row._id}
                onClose={handleClose}
            >
              <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: {xs: "260px", sm: "460px", height: "160px", backgroundColor: theme.palette.background.default, border: "none" }}}>
                <Box sx={{ p: 3}}>
                  <Typography sx={{ fontSize: { xs: "14px", sm: "17px"}}}>
                      Are you sure you want to delete {params.row.username}'s account?
                  </Typography>
                  <Stack flexDirection={"row"} mt={3} alignItems={"center"} gap={3} justifyContent={"flex-end"}>
                      <Button onClick={() => handleDeleteAnotherUser(params.row._id)} disabled={isDeleteLoading} variant="contained" sx={{ backgroundColor: "#f44336", color: "#ffffff", "&:hover": {
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
          </>
        )
      }
    }
  ]

  return (
    <Box width={{ xs: "300px", sm: "600px", lg: "940px"}} height={"370px"}>
      <DataGrid 
        loading={isLoading}
        rows={users}
        getRowId={(row) => row._id}
        columns={columns}
        rowCount={rowCountState}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20, 50, 100]}
      />
    </Box>
  )
}

export default DashboardUsers