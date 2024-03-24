import { v2 as cloudinary } from "cloudinary"
import Post from "../models/postModel.js"
import mongoose from "mongoose"

export const createPost = async (req, res) => {
    try {
        const loggedInUserId = req.user.userId
        const { title, desc, category, userId } = req.body
        let { postPicture } = req.body

        if(!title || !desc || !category || !postPicture) return res.status(400).json({ error: "Title, desc, category and picture are required when creating a post." })

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

        if(!loggedInUserIsAdmin && loggedInUserId.toString() !== post.userId.toString()) return res.status(403).json({ error: "User is not allowed to delete the post." })

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

        if(loggedInUserId.toString() !== post.userId.toString() && !loggedInUserIsAdmin) return res.status(403).json({ error: "User is not allowed to update the post." })

        if(postPicture) {
            const uploadedResponse = await cloudinary.uploader.upload(postPicture)
            postPicture = uploadedResponse.secure_url
        }

        if(title) {
            const slug = title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, "-")
            post.slug = slug
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
        const page = parseInt(req.query.page) || 0
        const pageSize = parseInt(req.query.pageSize) || 5
        const skip = page * pageSize

        const posts = await Post.find().skip(skip).limit(pageSize).sort({ createdAt: -1 })

        const totalPosts = await Post.countDocuments()

        res.status(200).json({ posts, totalPosts })
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const getPost = async (req, res) => {
    try {
        const { query } = req.params

        let post

        if(mongoose.Types.ObjectId.isValid(query)) {
            post = await Post.findOne({ _id: query })
        } else {
            post = await Post.findOneAndUpdate({ slug: query }, { $inc: { views: 1 }}, { new: true })
        }

        if(!post) return res.status(404).json({ error: "Post not found."})

        res.status(200).json(post)
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params
        const page = parseInt(req.query.page) || 0
        const pageSize = parseInt(req.query.pageSize) || 20

        const posts = await Post.find({ userId }).skip((page - 1) * pageSize).limit(pageSize).sort({ createdAt: -1 })

        const totalPosts = await Post.countDocuments({ userId })

        res.status(200).json({ posts, totalPosts })
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const getRecentPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).limit(20)

        res.status(200).json(posts)
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const getSearchPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0
        const pageSize = parseInt(req.query.pageSize) || 8
        let totalPosts

        const posts = await Post.find({ 
            ...(req.query.searchTerm && {
                $or: [
                    {
                        title: { $regex: req.query.searchTerm, $options: "i" }
                    },
                    {
                        desc: { $regex: req.query.searchTerm, $options: "i" }
                    },
                ],
            }),
            ...(req.query.category && { category: req.query.category })
        }).skip((page - 1) * pageSize).limit(pageSize)

        if(req.query.searchTerm) {
            totalPosts = await Post.countDocuments({ 
                $or: [
                    {
                        title: { $regex: req.query.searchTerm, $options: "i" }
                    },
                    {
                        desc: { $regex: req.query.searchTerm, $options: "i" }
                    },
                ],
                ...(req.query.category && { category: req.query.category })
            })
        } else {
            totalPosts = await Post.countDocuments(req.query.category ? { category: req.query.category} : {})
        }

        res.status(200).json({ posts, totalPosts })
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const getPopularPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ views: -1 }).limit(8)

        res.status(200).json(posts)
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}