import express from "express"
import { createPost, deletePost, getAllPosts, getPost, getPostsByCategory, getUserPosts, updatePost } from "../controllers/postControllers.js"
import protectRoute from "../middlewares/protectRoute.js"

const router = express.Router()

router.get("/all", getAllPosts)
router.get("/:postId", getPost)
router.get("/user/:userId", getUserPosts)
router.get("/category/posts", getPostsByCategory)
router.post("/create", protectRoute, createPost)
router.delete("/delete/:postId", protectRoute, deletePost)
router.put("/update/:postId", protectRoute, updatePost)

export default router