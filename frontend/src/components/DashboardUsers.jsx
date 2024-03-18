import { DataGrid } from "@mui/x-data-grid"
import { useDeleteUserAccountMutation, useGetAllUsersQuery } from "../redux/user/usersApi"
import { useEffect, useState } from "react"
import { Box, IconButton } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from "react-toastify"
import DeleteUserFromDataGridModal from "./DeleteUserFromDataGridModal"

const DashboardUsers = () => {
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5
    })
    const [rowCountState, setRowCountState] = useState(0)
    const [openDeleteModal, setOpenDeleteModal] = useState(null)

    const handleOpen = (userId) => setOpenDeleteModal(userId)
    const handleClose = () => setOpenDeleteModal(null)

    // get all users
    const { data, isLoading } = useGetAllUsersQuery(paginationModel)

    // delete user
    const [ deleteUserApi, { isLoading: isDeleteUserLoading } ] = useDeleteUserAccountMutation()

    useEffect(() => {
        if(data) {
            setRowCountState(data.totalUsers)
        }
    }, [data, setRowCountState])

    const handleDeleteUserFromDataGrid = async (userId) => {
        try {
            const res = await deleteUserApi({ _id: userId }).unwrap()
            
            handleClose()
            toast.success("User has been deleted successfully.")
            
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
                        <DeleteUserFromDataGridModal open={openDeleteModal === params.row._id} handleClose={handleClose} isLoading={isDeleteUserLoading} handleDeleteUser={handleDeleteUserFromDataGrid} rowId={params.row._id} username={params.row.username}/>
                    </>
                )
            }
        }
    ]

    return (
        <Box width={{ xs: "300px", sm: "600px", lg: "940px"}} height={"370px"}>
            <DataGrid 
                loading={isLoading}
                getRowId={(row) => row._id}
                rows={data?.users || []}
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