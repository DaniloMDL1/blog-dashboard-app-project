import { Avatar, Box, Stack, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import PeopleIcon from '@mui/icons-material/People'
import DescriptionIcon from '@mui/icons-material/Description'
import CommentIcon from '@mui/icons-material/Comment'
import TotalNumberCard from "./TotalNumberCard"
import { useGetTotalNumberOfCommentsQuery } from "../redux/comments/commentsApi"
import { useGetRecentPostsQuery, useGetTotalNumberOfPostsQuery } from "../redux/posts/postsApi"
import { useGetRecentUsersQuery, useGetTotalNumberOfUsersQuery } from "../redux/user/usersApi"
import { Link } from "react-router-dom"

const DashboardHome = () => {

    const { data: commentsTotal } = useGetTotalNumberOfCommentsQuery()
    const { data: postsTotal } = useGetTotalNumberOfPostsQuery()
    const { data: usersTotal } = useGetTotalNumberOfUsersQuery()

    const { data: recentPostsData, isLoading: isRecentPostsDataLoading } = useGetRecentPostsQuery({ limit: 5 })

    const postColumns = [
        {
            field: "postPicture",
            headerName: "Post picture",
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
            field: "title",
            headerName: "Title", 
            width: 200
        },
        {
            field: "desc",
            headerName: "Description", 
            width: 200
        }
    ]

    const { data: recentUsersData, isLoading: isRecentUsersDataLoading } = useGetRecentUsersQuery()

    const userColumns = [
        {
            field: "profilePicture",
            headerName: "Profile picture",
            width: 120,
            renderCell: (params) => {
                return (
                    <Avatar src={params.row.profilePicture}/>
                )
            }
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
        }
    ]

    return (
        <>
            <Stack flexDirection={"column"}>
                <Stack flexDirection={{ md: "row", xs: "column"}} alignItems={"center"} flexWrap={"wrap"} gap={6}>
                    <TotalNumberCard total={usersTotal?.totalUsers} totalLastMonth={usersTotal?.totalUsersLastMonth} Icon={PeopleIcon} label={"USERS"}/>
                    <TotalNumberCard total={postsTotal?.totalPosts} totalLastMonth={postsTotal?.totalPostsLastMonth} Icon={DescriptionIcon} label={"POSTS"}/>
                    <TotalNumberCard total={commentsTotal?.totalComments} totalLastMonth={commentsTotal?.totalCommentsLastMonth} Icon={CommentIcon} label={"COMMENTS"}/>
                </Stack>
                <Stack mt={"20px"} flexDirection={"column"}>
                    <Typography variant="h6">
                        Recent Users
                    </Typography>
                    <Box width={{ xs: "300px", sm: "600px", lg: "770px"}} height={"370px"} mb={"20px"} mt={"10px"}>
                        <DataGrid 
                            loading={isRecentUsersDataLoading}
                            rows={recentUsersData || []}
                            getRowId={(row) => row._id}
                            columns={userColumns}
                        />
                    </Box>
                    <Typography variant="h6">
                        Recent Posts
                    </Typography>
                    <Box width={{ xs: "300px", sm: "600px", lg: "570px"}} height={"387px"} mb={"20px"} mt={"10px"}>
                        <DataGrid 
                            loading={isRecentPostsDataLoading}
                            rows={recentPostsData || []}
                            getRowId={(row) => row._id}
                            columns={postColumns}
                        />
                    </Box>
                </Stack>
            </Stack>
        </>
    )
}

export default DashboardHome