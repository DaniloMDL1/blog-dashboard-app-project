import User from "../models/userModel.js"
import bcrypt from "bcryptjs"
import { v2 as cloudinary } from "cloudinary"

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
            const uploadedResponse = await cloudinary.uploader.upload(profilePicture)
            profilePicture = uploadedResponse.secure_url
        }

        user.fullName = fullName || user.fullName
        user.username = username || user.username
        user.email = email || user.email
        user.profilePicture = profilePicture || user.profilePicture

        user = await user.save()
        res.status(200).json(user)
        
    } catch(error) {
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
        if(!loggedInUserIsAdmin) return res.status(403).json({ error: "User is not allowed to get all users." })

        const users = await User.find({ _id: { $ne: loggedInUserId}}).select("-password")

        res.status(200).json(users)
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}