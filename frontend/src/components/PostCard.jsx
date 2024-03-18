import { Avatar, Card, CardContent, CardHeader, CardMedia, Typography } from "@mui/material"
import { useGetUserQuery } from "../redux/user/usersApi"
import { Link } from "react-router-dom"

const PostCard = ({ post }) => {

    const { data: userData } = useGetUserQuery({ userId: post.userId })

    if(!userData) return null

    return (
        <Card sx={{ maxWidth: "440px"}}>
            <CardHeader 
                avatar={<Avatar src={userData.profilePicture} sx={{ width: 38, height: 38}}/>}
                title={userData.username}
            />
            <Link to={`/post/${post.slug}`}>
                <CardMedia 
                    component={"img"}
                    image={post.postPicture}
                    height={"300"}
                />
            </Link>
            <CardContent>
                <Typography fontSize={"17px"} noWrap>
                    {post.desc}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default PostCard