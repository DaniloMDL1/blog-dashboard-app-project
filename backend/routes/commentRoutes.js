import express from "express"
import protectRoute from "../middlewares/protectRoute.js"
import { createComment, deleteComment, getPostComments, updateComment } from "../controllers/commentControllers.js"

const router = express.Router()

router.get("/post/:postId", getPostComments)
router.post("/create", protectRoute, createComment)
router.put("/update/:commentId", protectRoute, updateComment)
router.delete("/delete/:commentId", protectRoute, deleteComment)

export default router