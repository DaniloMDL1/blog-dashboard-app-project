import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import ScrollToTop from "../components/ScrollToTop"

const HeaderLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Outlet />
    </>
  )
}

export default HeaderLayout