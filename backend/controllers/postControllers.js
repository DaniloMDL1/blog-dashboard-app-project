import { v2 as cloudinary } from "cloudinary"
import Post from "../models/postModel.js"

export const createPost = async (req, res) => {
    try {
        const loggedInUserId = req.user.userId
        const { title, desc, category, userId } = req.body
        let { postPicture } = req.body

        if(!title || !desc || !category) return res.status(400).json({ error: "Title, desc and category are required when creating a post." })

        if(loggedInUserId.toString() !== userId) return res.status(403).json({ error: "User is not allowed to create a post." })

        if(postPicture) {
            const uploadedResponse = await cloudinary.uploader.upload(postPicture)
            postPicture = uploadedResponse.secure_url
        }

        const slug = title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, "-")

        const newPost = new Post({
            title,
            desc,
            category,
            postPicture,
            userId,
            slug
        })
        const savedPost = await newPost.save()
        res.status(201).json(savedPost)
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params
        const loggedInUserId = req.user.userId
        const loggedInUserIsAdmin = req.user.isAdmin

        const post = await Post.findById(postId)
        if(!post) return res.status(404).json({ error: "Post not found." })

        if(!loggedInUserIsAdmin && loggedInUserId.toString() !== post.userId) return res.status(403).json({ error: "User is not allowed to delete the post." })

        if(post.postPicture) {
            const postPictureId = post.postPicture.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(postPictureId)
        }

        await Post.findByIdAndDelete(postId)

        res.status(200).json({ msg: "Post has been deleted successfully." })
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const updatePost = async (req, res) => {
    try {
        const { title, desc, category } = req.body
        let { postPicture } = req.body
        const { postId } = req.params
        const loggedInUserId = req.user.userId
        const loggedInUserIsAdmin = req.user.isAdmin

        let post = await Post.findById(postId)
        if(!post) return res.status(404).json({ error: "Post not found." })

        if(!loggedInUserIsAdmin && loggedInUserId.toString() !== post.userId) return res.status(403).json({ error: "User is not allowed to update the post." })

        if(postPicture) {
            const uploadedResponse = await cloudinary.uploader.upload(postPicture)
            postPicture = uploadedResponse.secure_url
        }

        post.title = title || post.title
        post.desc = desc || post.desc
        post.category = category || post.category
        post.postPicture = postPicture || post.postPicture
        
        post = await post.save()

        res.status(200).json(post)

    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()

        res.status(200).json(posts)
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const getPost = async (req, res) => {
    try {
        const { slug } = req.params

        const post = await Post.findOne({ slug })
        if(!post) return res.status(404).json({ error: "Post not found." })

        res.status(200).json(post)
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params

        const posts = await Post.find({ userId })

        res.status(200).json(posts)
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const getPostsByCategory = async (req, res) => {
    try {
        const { category } = req.query

        const posts = await Post.find({ category })

        res.status(200).json(posts)
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}