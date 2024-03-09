export const updateUserProfile = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body
        let { profilePicture } = req.body
        const { userId } = req.params
        const loggedInUserId = req.user.userId

        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}