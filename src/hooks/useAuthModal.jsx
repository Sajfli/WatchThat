import { useState, useContext, createContext } from 'react'

const AuthModalContext = createContext({})

const AuthModalProvider = ({ children }) => {
    const [isOpen, setModalState] = useState(false)

    const handleOpenModal = () => setModalState(true)
    const handleCloseModal = () => setModalState(false)

    return (
        <AuthModalContext.Provider
            value={{ isOpen, handleCloseModal, handleOpenModal }}
        >
            {children}
        </AuthModalContext.Provider>
    )
}

AuthModalProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

const useAuthModal = () => {
    const { isOpen, handleOpenModal, handleCloseModal } =
        useContext(AuthModalContext)

    return [isOpen, handleOpenModal, handleCloseModal]
}

export { AuthModalProvider }
export default useAuthModal
