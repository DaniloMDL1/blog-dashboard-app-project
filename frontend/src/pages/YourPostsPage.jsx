import { Box, CircularProgress, Container, Grid, Pagination, Typography } from "@mui/material"
import PostCard from "../components/PostCard"
import { useGetUserPostsQuery } from "../redux/posts/postsApi"
import { useSelector } from "react-redux"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const YourPostsPage = () => {
    const { user } = useSelector((state) => state.user)

    const { search } = useLocation()
    const navigate = useNavigate()

    const [page, setPage] = useState(1)

    const { data, isLoading } = useGetUserPostsQuery({ userId: user._id, page })

    const handlePageChange = (e, page) => {
        setPage(page)

        const searchParams = new URLSearchParams(search)
        searchParams.set("page", page)
        navigate(`/your-posts?page=${page}`)
    }

    return (
        <Container maxWidth={"lg"} sx={{ mt: "40px", mb: "10px"}}>
            {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center"}}>
                    <CircularProgress size={24}/>
                </Box>
            )}
            {!isLoading && data && data.posts.length === 0 && (
                <Typography variant="h5" textAlign={"center"}>
                    You haven't created any post yet.
                </Typography>
            )}
            {data && data.posts.length > 0 && (
                <>
                    <Grid container spacing={3}>
                        {data.posts.map((post) => (
                            <Grid item key={post._id} xs={12} sm={6} lg={3}>
                                <PostCard post={post}/>
                            </Grid>
                        ))}
                    </Grid>
                    {data.totalPosts > 20 && (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4}}>
                            <Pagination 
                                count={Math.ceil(data.totalPosts / 20)}
                                page={page}
                                onChange={handlePageChange}
                                size="large"
                            />
                        </Box>
                    )}
                </>
            )}
        </Container>
    )
}

export default YourPostsPage