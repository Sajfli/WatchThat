// components
import SideBar from 'components/organisms/SideBar/SideBar'
import Modal from 'components/organisms/Modal/Modal'
import AuthComponent from 'components/organisms/Auth/Auth'
import Toasts from 'components/molecules/Toasts/Toasts'

// hooks
import useAuthModal from 'hooks/useAuthModal'

const MainTemplate = ({ children }) => {
    const [isOpen, handleOpenModal, handleCloseModal] = useAuthModal()

    return (
        <div className="App">
            <Toasts />

            <SideBar authPopupCallback={handleOpenModal} />

            <Modal isOpen={isOpen} handleClose={handleCloseModal}>
                <AuthComponent authPopupCallback={handleCloseModal} />
            </Modal>

            {children}
        </div>
    )
}

MainTemplate.propTypes = {
    children: PropTypes.node,
}

export default MainTemplate
