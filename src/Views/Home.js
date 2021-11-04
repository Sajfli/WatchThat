// components
import HomeTemplate from 'components/pages/HomeTemplate'
import ChooseUsername from 'components/organisms/Modals/ChooseUsername'

// hooks
import useLocalisation from 'hooks/useLocalisation'
import useAuth from 'hooks/useAuth'
import useModal from 'hooks/useModal'

const Home = () => {

    const l = useLocalisation()
    const auth = useAuth()

    const { isOpen, handleCloseModal, handleOpenModal } = useModal()

    const handleRoomCreate = () => {
        if(!auth.user)
            handleOpenModal()
    }

    const handleRoomJoin = () => {
        console.log('join')
    }

    const buttons = [
        {
            label: l('createNewRoom'),
            onClick: handleRoomCreate
        }, {
            label: l('joinExistingRoom'),
            onClick: handleRoomJoin
        }
    ]

    return(
        <HomeTemplate
            buttons={buttons}
        >
            {!auth.user &&  <ChooseUsername isOpen={isOpen} handleCloseModal={handleCloseModal} />}
        </HomeTemplate>
    )
}

export default Home