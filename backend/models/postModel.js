import mongoose from "mongoose"

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        desc: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        postPicture: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true,
            unique: true
        },
        views: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

const Post = mongoose.model("Post", postSchema)

export default Post