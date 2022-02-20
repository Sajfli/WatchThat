const deleteFromObject = (obj, keyToRemove) => {
    const newObj = {}

    for (const key in obj) {
        if (key !== keyToRemove) newObj[key] = obj[key]
    }

    return newObj
}

export default deleteFromObject
