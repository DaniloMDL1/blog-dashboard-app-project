import { Stack } from "@mui/material"
import PeopleIcon from '@mui/icons-material/People'
import DescriptionIcon from '@mui/icons-material/Description'
import CommentIcon from '@mui/icons-material/Comment'
import TotalNumberCard from "./TotalNumberCard"
import { useGetTotalNumberOfCommentsQuery } from "../redux/comments/commentsApi"
import { useGetTotalNumberOfPostsQuery } from "../redux/posts/postsApi"
import { useGetTotalNumberOfUsersQuery } from "../redux/user/usersApi"

const DashboardHome = () => {

    const { data: commentsTotal } = useGetTotalNumberOfCommentsQuery()
    const { data: postsTotal } = useGetTotalNumberOfPostsQuery()
    const { data: usersTotal } = useGetTotalNumberOfUsersQuery()

    return (
        <>
            <Stack flexDirection={"row"} alignItems={"center"} gap={6}>
                <TotalNumberCard total={usersTotal?.totalUsers} totalLastMonth={usersTotal?.totalUsersLastMonth} Icon={PeopleIcon} label={"USERS"}/>
                <TotalNumberCard total={postsTotal?.totalPosts} totalLastMonth={postsTotal?.totalPostsLastMonth} Icon={DescriptionIcon} label={"POSTS"}/>
                <TotalNumberCard total={commentsTotal?.totalComments} totalLastMonth={commentsTotal?.totalCommentsLastMonth} Icon={CommentIcon} label={"COMMENTS"}/>
            </Stack>
        </>
    )
}

export default DashboardHome