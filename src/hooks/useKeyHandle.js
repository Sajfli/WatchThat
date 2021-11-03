import { useEffect } from 'react'

const useKeyHandle = (key, cb) => {

    useEffect(() => {

        const check = k => Array.isArray(key) ? key.includes(k) : true

        const handleKey = (e) => {
            if(check(e.key) && e.target.tagName.toLowerCase() !== 'input')
                cb(e)
        }

        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)},

    [key, cb]);


}

export default useKeyHandle