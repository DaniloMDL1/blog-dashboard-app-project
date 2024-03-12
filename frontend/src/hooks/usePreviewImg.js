import { useState } from "react"

const usePreviewImg = () => {
    const [previewImg, setPreviewImg] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)

    const handlePreviewImgChange = (e) => {
        const file = e.target.files[0]

        if(file && file.type.startsWith("image/")) {
            const reader = new FileReader()

            reader.onloadend = () => {
                setPreviewImg(reader.result)
            }

            reader.readAsDataURL(file)
        } else {
            setErrorMsg("You must select an image file.")
            setPreviewImg(null)
        }
    }

    return {
        previewImg,
        handlePreviewImgChange,
        errorMsg
    }
}

export default usePreviewImg