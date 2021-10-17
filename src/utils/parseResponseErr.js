const parseResponseError = (errArray) => {
    const resp = {}

    // take objects from array and return it as one object
    for(let err of errArray) {
        const key = Object.keys(err)[0]
        resp[key] = err[key]
    }

    return resp
}

export default parseResponseError