import { Box, CircularProgress, Container, Grid, Typography } from "@mui/material"
import PostCard from "../components/PostCard"
import { useGetUserPostsQuery } from "../redux/posts/postsApi"
import { useSelector } from "react-redux"

const YourPostsPage = () => {
    const { user } = useSelector((state) => state.user)

    const { data, isLoading } = useGetUserPostsQuery({ userId: user._id })

    return (
        <Container maxWidth={"lg"} sx={{ mt: "40px"}}>
            {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center"}}>
                    <CircularProgress size={24}/>
                </Box>
            )}
            {!isLoading && !data && (
                <Typography variant="h5" textAlign={"center"}>
                    You haven't created any post yet.
                </Typography>
            )}
            {data && (
                <Grid container spacing={3}>
                    {data.posts.map((post) => (
                        <Grid item key={post._id} xs={12} sm={6} lg={3}>
                            <PostCard post={post}/>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    )
}

export default YourPostsPage