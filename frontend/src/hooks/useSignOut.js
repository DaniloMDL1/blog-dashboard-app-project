import { useState } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { signOutUser } from "../redux/user/userSlice"

const useSignOut = () => {
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    
    const handleSignOut = async () => {
        setIsLoading(true)
        try {
            const res = await axios.post("/api/auth/signout")

            dispatch(signOutUser())
            
        } catch(error) {
            console.error("Error", error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoading,
        handleSignOut
    }
}

export default useSignOut