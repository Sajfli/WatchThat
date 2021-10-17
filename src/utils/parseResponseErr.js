const parseResponseError = (errArray) => {
    const resp = {}

    for(let err of errArray) {
        const key = Object.keys(err)[0]
        resp[key] = err[key]
    }

    return resp
}

export default parseResponseError