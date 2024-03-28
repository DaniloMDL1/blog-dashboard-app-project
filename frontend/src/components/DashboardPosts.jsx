import { Box, IconButton, Typography } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { DataGrid } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { useDeletePostMutation, useGetAllPostsQuery } from "../redux/posts/postsApi"
import DeletePostFromDataGridModal from "./DeletePostFromDataGridModal"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import formatCategory from "../utils/formatCategory"

const DashboardPosts = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5
  })
  const [rowCountState, setRowCountState] = useState(0)
  const [openDeletePostModal, setOpenDeletePostModal] = useState(null)

  const handleDeletePostOpen = (postId) => setOpenDeletePostModal(postId)
  const handleDeletePostClose = () => setOpenDeletePostModal(null)

  // get all posts
  const { data, isLoading } = useGetAllPostsQuery(paginationModel)

  // delete post
  const [ deletePostApi, { isLoading: isDeletePostLoading }] = useDeletePostMutation()

  useEffect(() => {
    if(data) {
      setRowCountState(data.totalPosts)
    }
  }, [data, setRowCountState])

  const handleDeletePostFromDataGrid = async (postId) => {
    try {
      const res = await deletePostApi({ postId }).unwrap()

      handleDeletePostClose()
      toast.success("Post has been successfully deleted.")
      
    } catch(error) {
      if(error.data) {
        toast.error(error.data.error)
      } else {
        toast.error(error.message)
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
        field: "title",
        headerName: "Title", 
        width: 200
    },
    {
        field: "desc",
        headerName: "Description", 
        width: 200
    },
    {
      field: "category",
      headerName: "Category", 
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2">
          {formatCategory(params.row.category)}
        </Typography>
      )
    },
    {
        field: "postPicture",
        headerName: "Post Picture", 
        width: 120,
        renderCell: (params) => {
          return (
            <Link to={`/post/${params.row._id}`}>
              <img src={params.row.postPicture} width={40} height={40}/>
            </Link>
          )
        }
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 80,
      renderCell: (params) => {
        return (
          <>
            <IconButton onClick={() => handleDeletePostOpen(params.row._id)} sx={{ color: "#d32f2f"}}>
              <DeleteIcon />
            </IconButton>
            <DeletePostFromDataGridModal 
              open={openDeletePostModal === params.row._id}
              handleClose={handleDeletePostClose}
              handleDeletePost={handleDeletePostFromDataGrid}
              isLoading={isDeletePostLoading}
              rowId={params.row._id}
            />
          </>
        )
      }
    },
    {
      field: "update",
      headerName: "Update",
      width: 80,
      renderCell: (params) => {
        return (
          <Link to={`/update-post/${params.row._id}`}>
            <IconButton sx={{ color: "#00897b"}}>
              <EditIcon />
            </IconButton>
          </Link>
        )
      }
    }
  ]

  return (
    <Box width={{ xs: "300px", sm: "600px", lg: "940px"}} height={"387px"}>
      <DataGrid 
        loading={isLoading}
        rows={data?.posts || []}
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

export default DashboardPosts