import express from "express"
import { createPost, deletePost, getAllPosts, getPopularPosts, getPost, getRecentPosts, getSearchPosts, getTotalNumberOfPosts, getUserPosts, updatePost } from "../controllers/postControllers.js"
import protectRoute from "../middlewares/protectRoute.js"

const router = express.Router()

router.get("/all", getAllPosts)
router.get("/recent", getRecentPosts)
router.get("/popular", getPopularPosts)
router.get("/search", getSearchPosts)
router.get("/total", getTotalNumberOfPosts)
router.get("/:query", getPost)
router.get("/user/:userId", protectRoute, getUserPosts)
router.post("/create", protectRoute, createPost)
router.delete("/delete/:postId", protectRoute, deletePost)
router.put("/update/:postId", protectRoute, updatePost)

export default router