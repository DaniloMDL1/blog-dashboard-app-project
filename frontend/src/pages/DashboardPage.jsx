import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from "@mui/material"
import PeopleIcon from '@mui/icons-material/People'
import { Outlet, Link, useLocation } from "react-router-dom"
import { useTheme } from "@emotion/react"

const DashboardPage = () => {
    const theme = useTheme()
    const { pathname } = useLocation()

    return (
        <Box display={"flex"} flexDirection={"row"}>
            <Box width={{ sm: "180px"}}>
                <Stack height={"calc(100vh - 68px)"} sx={{ borderRight: "1px solid", borderColor: theme.palette.mode === "light" ? "#d4d4d8" : "#404040" }}>
                    <List sx={{ py: 0}}>
                        <ListItem selected={pathname === "/dashboard/users"} component={Link} to="/dashboard" sx={{ color: theme.palette.text.primary}} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <PeopleIcon />
                                </ListItemIcon>
                                <ListItemText primary="Users" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Stack>
            </Box>
            <Box width={"calc(100vw - 180px)"} sx={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Outlet />
            </Box>
        </Box>
    )
}

export default DashboardPage