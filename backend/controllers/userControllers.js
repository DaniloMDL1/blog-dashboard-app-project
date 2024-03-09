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