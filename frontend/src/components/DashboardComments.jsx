import { Box, IconButton, Typography } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { DataGrid } from "@mui/x-data-grid"
import { useDeleteCommentMutation, useGetAllComentsQuery } from "../redux/comments/commentsApi"
import { useEffect, useState } from "react"
import DeleteCommentFromDataGridModal from "./DeleteCommentFromDataGridModal"
import { toast } from "react-toastify"
import UpdateCommentModal from "./UpdateCommentModal"
import { Link } from "react-router-dom"

const DashboardComments = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5
  })
  const [rowCountState, setRowCountState] = useState(0)
  const [openDeleteCommentModal, setOpenDeleteCommentModal] = useState(null)
  const [openUpdateModal, setOpenUpdateModal] = useState(null)

  const handleUpdateModalOpen = (commentId) => setOpenUpdateModal(commentId)
  const handleUpdateModalClose = () => setOpenUpdateModal(null)

  const handleDeleteCommentModalOpen = (commentId) => setOpenDeleteCommentModal(commentId)
  const handleDeleteCommentModalClose = () => setOpenDeleteCommentModal(null)

  // get all comments
  const { data , isLoading } = useGetAllComentsQuery(paginationModel)

  useEffect(() => {
    if(data) {
      setRowCountState(data.totalComments)
    }
  }, [data])

  // delete comment
  const [ deleteCommentApi, { isLoading: isDeleteCommentLoading } ] = useDeleteCommentMutation()

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await deleteCommentApi({ commentId }).unwrap()

      toast.success("Comment has been deleted successfully.")
      handleDeleteCommentModalClose()
      
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
      field: "comment",
      headerName: "Comment",
      width: 210
    },
    {
      field: "likes",
      headerName: "Likes",
      width: 130,
      renderCell: (params) => (
        <Typography>
          {params.row.likes.length} likes
        </Typography>
      ) 
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 80,
      renderCell: (params) => {
        return (
          <>
            <IconButton onClick={() => handleDeleteCommentModalOpen(params.row._id)} sx={{ color: "#d32f2f"}}>
              <DeleteIcon />
            </IconButton>
            <DeleteCommentFromDataGridModal 
              isLoading={isDeleteCommentLoading}
              open={openDeleteCommentModal === params.row._id}
              handleClose={handleDeleteCommentModalClose}
              handleDeleteComment={handleDeleteComment}
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
          <>
            <IconButton onClick={() => handleUpdateModalOpen(params.row._id)} sx={{ color: "#00897b"}}>
              <EditIcon />
            </IconButton>
            <UpdateCommentModal 
              open={openUpdateModal === params.row._id}
              handleClose={handleUpdateModalClose}
              comment={params.row.comment}
              commentId={params.row._id}
            />
          </>
        )
      }
    },
    {
      field: "postPicture",
      headerName: "For Post",
      width: 100,
      renderCell: (params) => {
        const postPicture = params.row.postId.postPicture

        return (
          <Link to={`/post/${params.row.postId._id}`}>
              <img src={postPicture} width={40} height={40}/>
          </Link>
        )
      }
    }
  ]

  return (
    <Box width={{ xs: "300px", sm: "600px", lg: "870px"}} height={"370px"}>
      <DataGrid 
        loading={isLoading}
        rows={data?.comments || []}
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

export default DashboardComments