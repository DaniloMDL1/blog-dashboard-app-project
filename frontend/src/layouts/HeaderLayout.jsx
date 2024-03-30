import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import ScrollToTop from "../components/ScrollToTop"
import { Box } from "@mui/material"

const HeaderLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Box pt={"55px"}>
        <Outlet />
      </Box>
    </>
  )
}

export default HeaderLayout