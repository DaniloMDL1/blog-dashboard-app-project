import express from "express"
import { deleteUser, getAllUsers, getTotalNumberOfUsers, getUser, updateUserProfile } from "../controllers/userControllers.js"
import protectRoute from "../middlewares/protectRoute.js"

const router = express.Router()

router.get("/all", protectRoute, getAllUsers)
router.get("/total", getTotalNumberOfUsers)
router.get("/:userId", getUser)
router.put("/update/profile/:userId", protectRoute, updateUserProfile)
router.delete("/delete/:userId", protectRoute, deleteUser)

export default router