import jwt from "jsonwebtoken"

const generateTokenAndSetCookie = (userId, isAdmin, res) => {
    const token = jwt.sign({ userId, isAdmin }, process.env.JWT_SECRET, { expiresIn: "5d" })

    res.cookie("token", token, {
        maxAge: 5 * 60 * 60 * 24 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    })
}

export default generateTokenAndSetCookie