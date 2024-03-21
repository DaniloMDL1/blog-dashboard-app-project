import User from "../models/userModel.js"
import bcrypt from "bcryptjs"
import { v2 as cloudinary } from "cloudinary"
import Post from "../models/postModel.js"

export const updateUserProfile = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body
        let { profilePicture } = req.body
        const { userId } = req.params
        const loggedInUserId = req.user.userId

        let user = await User.findById(userId)
        if(!user) return res.status(404).json({ error: "User not found." })

        if(userId !== loggedInUserId.toString()) return res.status(403).json({ error: "User is not allowed to update other user's profile."})

        if(password) {
            const salt = await bcrypt.genSalt(10)
            const passwordHash = await bcrypt.hash(password, salt)
            user.password = passwordHash
        }

        if(profilePicture) {
            if(user.profilePicture) {
                const userProfilePictureId = user.profilePicture.split("/").pop().split(".")[0]
                await cloudinary.uploader.destroy(userProfilePictureId)
            }

            const uploadedResponse = await cloudinary.uploader.upload(profilePicture)
            profilePicture = uploadedResponse.secure_url
        }

        user.fullName = fullName || user.fullName
        user.username = username || user.username
        user.email = email || user.email
        user.profilePicture = profilePicture || user.profilePicture

        user = await user.save()

        const { password: pass, ...userInfo } = user._doc
        res.status(200).json(userInfo)
        
    } catch(error) {
        if(error.code === 11000) {
            if(error.keyPattern.email) return res.status(400).json({ error: "Email already exists."})
            if(error.keyPattern.username) return res.status(400).json({ error: "Username already exists."})
        }

        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params
        const loggedInUserId = req.user.userId
        const loggedInUserIsAdmin = req.user.isAdmin

        if(loggedInUserId.toString() !== userId && !loggedInUserIsAdmin) return res.status(403).json({ error: "User is not allowed to delete other user's profile." })

        const user = await User.findById(userId)
        if(!user) return res.status(404).json({ error: "User not found." })

        if(user.profilePicture) {
            const userProfilePictureId = user.profilePicture.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(userProfilePictureId)
        }

        await Post.deleteMany({ userId: userId })
        await User.findByIdAndDelete(userId)

        res.status(200).json({ msg: "User is successfully deleted." })
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user.userId
        const loggedInUserIsAdmin = req.user.isAdmin
        const page = parseInt(req.query.page) || 0
        const pageSize = parseInt(req.query.pageSize) || 5
        const skip = page * pageSize

        if(!loggedInUserIsAdmin) return res.status(403).json({ error: "User is not allowed to get all users." })

        const users = await User.find({ _id: { $ne: loggedInUserId}}).select("-password").skip(skip).limit(pageSize)

        const totalUsers = await User.countDocuments({ _id : { $ne: loggedInUserId }})

        res.status(200).json({ users, totalUsers })
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const getUser = async (req, res) => {
    try {
        const { userId } = req.params

        const user = await User.findById(userId).select("-password")
        if(!user) return res.status(404).json({ error: "User not found." })

        res.status(200).json(user)
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}