import mongoose from "mongoose"

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
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
            default: ""
        },
        category: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Post = mongoose.model("Post", postSchema)

export default Post