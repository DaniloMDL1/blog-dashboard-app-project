import mongoose from "mongoose"

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI)
        console.log("MongoDB has been connected.")
        
    } catch(error) {
        console.log(error)
    }
}

export default connectToMongoDB