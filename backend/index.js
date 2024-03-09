import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { v2 as cloudinary } from "cloudinary"
import connectToMongoDB from "./db/connectToMongoDB.js"

dotenv.config()
const app = express()
app.use(express.json({ limit: "30mb" }))
app.use(express.urlencoded({ limit: "30mb", extended: true }))
app.use(cookieParser())

const PORT = process.env.PORT || 6001
connectToMongoDB()
app.listen(PORT, () => console.log(`Server port is: ${PORT}`))
