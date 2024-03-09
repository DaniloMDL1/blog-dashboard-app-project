import User from "../models/userModel.js"
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js"

export const signup = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body

        if(!fullName || !username || !email || !password) return res.status(400).json({ error: "All fields are required." })

        const user = await User.findOne({ $or: [ { username }, { email } ]})
        if(user) return res.status(400).json({ error: "Username or email already exists." })

        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            username,
            email,
            password: passwordHash
        })
        const savedUser = await newUser.save()
        generateTokenAndSetCookie(savedUser._id, savedUser.isAdmin, res)

        const { password: pass, ...userInfo } = savedUser._doc

        res.status(201).json(userInfo)
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body

        if(!email || !password) return res.status(400).json({ error: "All fields are required." })

        const user = await User.findOne({ email })
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        if(!user || !isPasswordCorrect) return res.status(400).json({ error: "Email or password is incorrect." })

        generateTokenAndSetCookie(user._id, user.isAdmin, res)

        const { password: pass, ...userInfo } = user._doc

        res.status(200).json(userInfo)
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const signout = async (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 })
        res.status(200).json({ msg: "User has been signed out." })
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}