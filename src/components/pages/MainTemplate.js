// components
import SideBar from 'components/organisms/SideBar/SideBar'
import Modal from 'components/organisms/Modal/Modal'
import AuthComponent from 'components/organisms/Auth/Auth'

// hooks
import useModal from 'hooks/useModal'

const MainTemplate = ({children}) => {

    const { isOpen, handleOpenModal, handleCloseModal } = useModal()

    return(
        <div className='App'>

            <SideBar authPopupCallback={handleOpenModal} />

            <Modal isOpen={isOpen} handleClose={handleCloseModal}>
                <AuthComponent authPopupCallback={handleCloseModal} />
            </Modal>

            {children}
        </div>
    )
}

export default MainTemplate