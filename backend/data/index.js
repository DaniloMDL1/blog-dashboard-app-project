import mongoose from "mongoose"

const userIds = [
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId()
]

export const users = [
    {
        _id: userIds[0],
        fullName: "Wang Lin",
        username: "wanglin12",
        email: "wanglin12@gmail.com",
        password: "password12",
        profilePicture: "",
        isAdmin: false
    },
    {
        _id: userIds[1],
        fullName: "Zhang Wei",
        username: "zhangwei1",
        email: "zhangwei1@gmail.com",
        password: "password12",
        profilePicture: "",
        isAdmin: false
    },
    {
        _id: userIds[2],
        fullName: "Kim Minji",
        username: "kimminji11",
        email: "kimminji12@gmail.com",
        password: "password12",
        profilePicture: "",
        isAdmin: false
    },
    {
        _id: userIds[3],
        fullName: "Sato Misaki",
        username: "satomisaki12",
        email: "satomisaki12@gmail.com",
        password: "password12",
        profilePicture: "",
        isAdmin: false
    }
]