import { IconButton, Paper, Stack, Typography } from "@mui/material"

const TotalNumberCard = ({ total, totalLastMonth, Icon, label }) => {
  return (
    <Paper elevation={1} sx={{ p: 1, width: "220px"}}>
        <Stack flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"}>
            <Typography variant="body1">
                TOTAL {label}
            </Typography>
            <IconButton>
                <Icon sx={{ width: 25, height: 25}}/>
            </IconButton>
        </Stack>
        <Typography variant="h5" mt={1}>
            {total}
        </Typography>
        <Stack flexDirection={"row"} alignItems={"center"} gap={3} mt={1}>
            <Typography>
                {totalLastMonth} last month
            </Typography>
        </Stack>
    </Paper>
  )
}

export default TotalNumberCard