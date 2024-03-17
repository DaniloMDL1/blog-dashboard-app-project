import { useState } from "react"
import { toast } from "react-toastify"

const usePreviewImg = () => {
    const [previewImg, setPreviewImg] = useState(null)

    const handleImgChange = (e) => {
        const file = e.target.files[0]

        if(file && file.type.startsWith("image/")) {
            const reader = new FileReader()

            reader.onloadend = () => {
                setPreviewImg(reader.result)
            }

            reader.readAsDataURL(file)
        } else {
            toast.error("You must select an image file.")
            setPreviewImg(null)
        }
    }

    return {
        handleImgChange,
        previewImg,
        setPreviewImg
    }
}

export default usePreviewImg