import { Box, CircularProgress, Container, Grid, Typography } from "@mui/material"
import { useGetPopularPostsQuery, useGetRecentPostsQuery } from "../redux/posts/postsApi"
import PostCard from "../components/PostCard"

const HomePage = () => {

  // get recent posts
  const { data: recentPostData, isLoading: isRecentPostsLoading } = useGetRecentPostsQuery({ limit: 20 })

  // get popular posts
  const { data: popularPostData, isLoading: isPopularPostsLoading } = useGetPopularPostsQuery()

  return (
    <Container maxWidth={"lg"} sx={{ mt: "40px", mb: "10px"}}>
      {(isRecentPostsLoading || isPopularPostsLoading) && (
        <Box sx={{ display: "flex", justifyContent: "center"}}>
            <CircularProgress size={24}/>
        </Box>
      )}
      {recentPostData && (
        <>
          <Typography variant="h5" sx={{ mb: "20px", pl: "10px"}}>
            Recent Posts
          </Typography>
          <Grid container spacing={3}>
            {recentPostData.map((post) => (
              <Grid item key={post._id} xs={12} sm={6} lg={3}>
                <PostCard post={post}/>
              </Grid>
            ))}
          </Grid>
        </>
      )}
      {!isRecentPostsLoading && recentPostData?.length === 0 && (
        <Typography variant="h5" textAlign={"center"}>
          There is no recent posts yet.
        </Typography>
      )}
      {popularPostData && (
        <>
          <Typography variant="h5" sx={{ mb: "20px", pl: "10px", mt: "50px"}}>
            Popular posts
          </Typography>
          <Grid container spacing={3}>
            {popularPostData.map((post) => (
              <Grid item key={post._id} xs={12} sm={6} lg={3}>
                <PostCard post={post}/>
              </Grid>
            ))}
          </Grid>
        </>
      )}
      {!isPopularPostsLoading && popularPostData?.length === 0 && (
        <Typography variant="h5" textAlign={"center"}>
          There is no popular posts yet.
        </Typography>
      )}
    </Container>
  )
}

export default HomePage