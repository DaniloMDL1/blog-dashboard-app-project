import express from "express"
import { deleteUser, getAllUsers, getUser, updateUserProfile } from "../controllers/userControllers.js"
import protectRoute from "../middlewares/protectRoute.js"

const router = express.Router()

router.get("/:userId", protectRoute, getUser)
router.get("/all", protectRoute, getAllUsers)
router.put("/update/profile/:userId", protectRoute, updateUserProfile)
router.delete("/delete/:userId", protectRoute, deleteUser)

export default router