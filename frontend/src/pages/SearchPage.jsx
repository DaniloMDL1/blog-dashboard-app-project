import { Container } from "@mui/material"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { useGetSearchPostsQuery } from "../redux/posts/postsApi"

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState("")

    const { search } = useLocation()

    useEffect(() => {
        const searchParams = new URLSearchParams(search)
        const searchParamsSearchTerm = searchParams.get("searchTerm")
        if(searchParamsSearchTerm) {
            setSearchTerm(searchParamsSearchTerm)
        }
    }, [search, setSearchTerm])

    const { data, isLoading } = useGetSearchPostsQuery({ searchTerm })

    return (
        <Container maxWidth={"lg"} sx={{ mt: "40px", mb: "20px"}}>
            asdas
        </Container>
    )
}

export default SearchPage