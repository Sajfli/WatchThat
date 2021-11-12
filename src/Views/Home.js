import { useContext } from 'react'

// components
import HomeTemplate from 'components/pages/HomeTemplate'
import ChooseUsername from 'components/organisms/Modals/ChooseUsername'

// hooks
import useLocalisation from 'hooks/useLocalisation'
import useAuth from 'hooks/useAuth'
import useModal from 'hooks/useModal'

// ctx
import { withSocket, SocketContext } from 'context/RoomSocket'
import { useHistory } from 'react-router'

const Home = () => {

    const l = useLocalisation()
    const auth = useAuth()

    const history = useHistory()
    const socket = useContext(SocketContext)

    const { isOpen, handleCloseModal, handleOpenModal } = useModal()

    const handleRoomCreate = () => {
        if(!auth.user)
            handleOpenModal()
        else createRoom()
    }

    const createRoom = (username) => {
        if(!auth.user && username)
            localStorage.setItem('tempUsername', username)

        if(!auth.user && !username)
            return handleOpenModal()

        socket.emit('get room id')
        socket.on('room id', id => {
            history.push(`/room/${id}`)
        })
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
            {!auth.user &&
            <ChooseUsername
                isOpen={isOpen}
                handleCloseModal={handleCloseModal}
                handleRoomCreate={createRoom}
            />}
        </HomeTemplate>
    )
}

export default withSocket(Home)