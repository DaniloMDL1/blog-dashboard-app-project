import express from "express"
import { updateUserProfile } from "../controllers/userControllers.js"
import protectRoute from "../middlewares/protectRoute.js"

const router = express.Router()

router.put("/update/profile/:userId", protectRoute, updateUserProfile)

export default router