const getRandom = (radix = 16) => {
    const randomBuffer = new Uint32Array(1)
    window.crypto.getRandomValues(randomBuffer)

    return (
        Date.now() +
        `${randomBuffer[0]}` +
        Math.random().toString(radix).slice(2) +
        radix * 2
    )
}

export default getRandom
