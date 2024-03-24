import { Box, Button, CircularProgress, Container, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Pagination, Select, Stack, Typography } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search'
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useGetSearchPostsQuery } from "../redux/posts/postsApi"
import { useTheme } from "@emotion/react"
import { categories } from "../utils/constants"
import PostCard from "../components/PostCard"

const SearchPage = () => {
    const theme = useTheme()

    const { search } = useLocation()
    const navigate = useNavigate()

    const searchParams = new URLSearchParams(search)

    const [searchTerm, setSearchTerm] = useState("")
    const [category, setCategory] = useState("")
    const [page, setPage] = useState(1)

    useEffect(() => {
        const searchParamsSearchTerm = searchParams.get("searchTerm")
        const searchParamsCategory = searchParams.get("category")
        if(searchParamsSearchTerm) {
            setSearchTerm(searchParamsSearchTerm)
        }

        if(searchParamsCategory) {
            setCategory(searchParamsCategory)
        }
    }, [search, setSearchTerm, setCategory])

    const { data: searchPostData, isLoading: isSearchPostLoading } = useGetSearchPostsQuery({ searchTerm: searchParams.get("searchTerm") || "", page, category: searchParams.get("category") || "" })

    const handleFilter = () => {
        if(searchTerm.trim()) {
            navigate(`/search?searchTerm=${searchTerm}${category ? `&category=${category}` : ""}`)
        } else {
            navigate(`/search${category ? `?category=${category}` : ""}`)
        }
    }

    const handlePageChange = (e, page) => {
        setPage(page)

        searchParams.set("page", page)

        const searchParamsSearchTerm = searchParams.get("searchTerm")
        const searchParamsCategory = searchParams.get("category")

        if(searchParamsSearchTerm) {
            navigate(`/search?searchTerm=${searchParamsSearchTerm}${searchParamsCategory ? `&category=${searchParamsCategory}` : ""}&page=${page}`)
        } else {
            navigate(`/search${searchParamsCategory ? `?category=${searchParamsCategory}&page=${page}` : `?page=${page}`}`)
        }
    }

    return (
        <Container maxWidth={"lg"} sx={{ mt: "40px", mb: "20px"}}>
            <Stack flexDirection={"row"} alignItems={"center"} gap={1} flexWrap={"wrap"} mb={"40px"}>
                <FormControl size="small" sx={{ width: "240px"}}>
                    <OutlinedInput 
                        type="text"
                        size="small"
                        placeholder="Search posts"
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton sx={{ color: theme.palette.mode === "light" ? "#424242" : "#9e9e9e" }}>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                        autoComplete="off"
                        sx={{
                            "&.MuiOutlinedInput-root": {
                                borderRadius: "9999px"
                            },
                        }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </FormControl>
                <FormControl size="small" sx={{ width: "220px"}}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        label="Category"
                        MenuProps={{
                            anchorOrigin: {
                                vertical: "bottom",
                                horizontal: 0
                            },
                            transformOrigin: {
                                vertical: "top",
                                horizontal: 0
                            },
                            PaperProps: {
                                style: {
                                    height: "300px",
                                }
                            }
                        }}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {categories.map((c) => (
                            <MenuItem key={c.name} value={c.name}>
                                {c.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button onClick={handleFilter} variant="contained" sx={{ backgroundColor: theme.palette.secondary.main, "&:hover": {
                    backgroundColor: theme.palette.secondary.dark
                } }}>
                    Filter
                </Button>
            </Stack>
            {isSearchPostLoading && (
                <Box sx={{ display: "flex", justifyContent: "center"}}>
                    <CircularProgress size={24}/>
                </Box>
            )}
            {!isSearchPostLoading && searchPostData && searchPostData.posts.length === 0 && (
                <Typography variant="h5" textAlign={"center"}>
                    Posts not found.
                </Typography>
            )}    
            {searchPostData && searchPostData.posts && (
                <>
                    <Grid container spacing={3}>
                        {searchPostData.posts.map((post) => (
                            <Grid item key={post._id} xs={12} sm={6} lg={3}>
                                <PostCard post={post}/>
                            </Grid>
                        ))}
                    </Grid>
                    {searchPostData.totalPosts > 8 && (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4}}>
                            <Pagination
                                count={Math.ceil(searchPostData.totalPosts / 8)}
                                page={page}
                                onChange={handlePageChange}
                                size="large"
                                color="primary"
                            />
                        </Box>
                    )}
                </>
            )}               
        </Container>
    )
}

export default SearchPage