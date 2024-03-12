import axios from "axios"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { deleteUser } from "../redux/user/userSlice"
import { toast } from "react-toastify"

const useDeleteUser = () => {
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()

    const handleDeleteUser = async (userId) => {
        setIsLoading(true)
        try {
            const res = await axios.delete(`/api/users/delete/${userId}`, { withCredentials: true })

            dispatch(deleteUser())
            toast.success("Account has been successfully deleted.")
            
        } catch(error) {
            console.error("Error" + error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoading,
        handleDeleteUser
    }
}

export default useDeleteUser