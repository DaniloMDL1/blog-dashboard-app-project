import jwt from "jsonwebtoken"

const protectRoute = (req, res, next) => {
    try {
        const token = req.cookies.token
        if(!token) return res.status(401).json({ error: "User is unauthorized." })

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export default protectRoute