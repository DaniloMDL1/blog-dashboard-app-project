const formatCategory = (category) => {
    const words = category.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1))

    return words.length > 1 ? words.join(" & ") : words[0]
} 

export default formatCategory