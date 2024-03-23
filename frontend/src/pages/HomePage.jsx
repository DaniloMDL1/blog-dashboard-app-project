import { Box, CircularProgress, Container, Grid, Typography } from "@mui/material"
import { useGetRecentPostsQuery } from "../redux/posts/postsApi"
import PostCard from "../components/PostCard"

const HomePage = () => {

  const { data: postData, isLoading } = useGetRecentPostsQuery()

  return (
    <Container maxWidth={"lg"} sx={{ mt: "40px", mb: "10px"}}>
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center"}}>
            <CircularProgress size={24}/>
        </Box>
      )}
      {!isLoading && !postData && (
        <Typography variant="h5" textAlign={"center"}>
          There is no posts yet.
        </Typography>
      )}
      {postData && (
        <>
          <Typography variant="h5" sx={{ mb: "20px", pl: "10px"}}>
            Recent Posts
          </Typography>
          <Grid container spacing={3}>
            {postData.map((post) => (
              <Grid item key={post._id} xs={12} sm={6} lg={3}>
                <PostCard post={post}/>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  )
}

export default HomePage