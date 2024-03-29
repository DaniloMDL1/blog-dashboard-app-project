import Comment from "../models/commentModel.js"

export const createComment = async (req, res) => {
    try {
        const loggedInUserId = req.user.userId
        const { comment, postId, userId } = req.body

        if(!comment || !postId || !userId) return res.status(400).json({ error: "Comment is required." })

        if(loggedInUserId.toString() !== userId) return res.status(403).json({ error: "User is not allowed to create a comment."})

        const newComment = new Comment({
            comment,
            postId,
            userId
        })
        const savedComment = await newComment.save()

        res.status(201).json(savedComment)
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params
        const loggedInUserId = req.user.userId
        const loggedInUserAdmin = req.user.isAdmin

        if(!req.body.comment) return res.status(400).json({ error: "Comment is required." })

        const comment = await Comment.findById(commentId)
        if(!comment) return res.status(404).json({ error: "Comment not found." })

        if(!loggedInUserAdmin && loggedInUserId.toString() !== comment.userId.toString()) return res.status(403).json({ error: "User is not allowed to update the comment."})

        const updatedComment = await Comment.findByIdAndUpdate(commentId, { $set: { comment: req.body.comment } }, { new: true })

        res.status(200).json(updatedComment)
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params
        const loggedInUserId = req.user.userId
        const loggedInUserAdmin = req.user.isAdmin

        const comment = await Comment.findById(commentId)
        if(!comment) return res.status(404).json({ error: "Comment not found." })

        if(!loggedInUserAdmin && loggedInUserId.toString() !== comment.userId.toString()) return res.status(403).json({ error: "User is not allowed to delete the comment." })

        await Comment.findByIdAndDelete(commentId)

        res.status(200).json({ msg: "Comment has been successfully deleted." })
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const getPostComments = async (req, res) => {
    try {
        const { postId } = req.params

        const comments = await Comment.find({ postId }).sort({ createdAt: -1 })

        res.status(200).json(comments)
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const likeUnlikeComment = async (req, res) => {
    try {
        const { commentId } = req.params
        const loggedInUserId = req.user.userId

        const comment = await Comment.findById(commentId)
        if(!comment) return res.status(404).json({ error: "Comment not found." })

        const isLiked = comment.likes.includes(loggedInUserId)

        if(isLiked) {
            await Comment.findByIdAndUpdate(commentId, { $pull: { likes: loggedInUserId } }, { new: true })
            return res.status(200).json({ msg: "Comment has been unliked."})
        } else {
            await Comment.findByIdAndUpdate(commentId, { $push: { likes: loggedInUserId } }, { new: true })
            return res.status(200).json({ msg: "Comment has been liked."})
        }
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const getAllComments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0
        const pageSize = parseInt(req.query.pageSize) || 20

        const comments = await Comment.find().skip(page * pageSize).limit(pageSize).populate("postId")

        const totalComments = await Comment.countDocuments()

        res.status(200).json({ comments, totalComments })
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

export const getTotalNumberOfComments = async (req, res) => {
    try {
        const currentDate = new Date()
        const lastMonthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)

        const totalComments = await Comment.countDocuments()
        const totalCommentsLastMonth = await Comment.countDocuments({ createdAt: { $gte: lastMonthStartDate }})

        res.status(200).json({ totalComments, totalCommentsLastMonth })
        
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}