import { createContext, useContext, useState } from 'react'
import deleteFromObject from '@/utils/deleteFromObject'

const PorterContext = createContext({})

const PorterProvider = ({ children }) => {
    const [functions, setFunctions] = useState({})

    const addFunction = (key, func) => {
        if (typeof key !== 'string' || typeof func !== 'function') return

        setFunctions({
            ...functions,
            [key]: func,
        })
    }

    const removeFunction = (key) => {
        setFunctions(deleteFromObject(functions, key))
    }

    const verifyFunction = (key) => {
        return !!functions[key]
    }

    const func = (key) => {
        if (!verifyFunction(key)) return () => {}
        return functions[key]
    }

    return (
        <PorterContext.Provider
            value={{
                func,
                removeFunction,
                addFunction,
                verifyFunction,
            }}
        >
            {children}
        </PorterContext.Provider>
    )
}

const usePorter = () => {
    const porter = useContext(PorterContext)

    return porter
}

PorterProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export { PorterProvider }
export default usePorter
