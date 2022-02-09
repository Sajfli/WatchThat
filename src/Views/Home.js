
import ky from 'ky'

import HomeTemplate from 'components/pages/HomeTemplate'
import TypeRoomId from 'components/organisms/Modals/TypeRoomId'

import useLocalisation from 'hooks/useLocalisation'
import useModal from 'hooks/useModal'
import useError from 'hooks/useError'

import { useHistory } from 'react-router'

const Home = () => {

    const l = useLocalisation()
    const handleError = useError()
    // const auth = useAuth()

    const history = useHistory()
    const roomIdModal = useModal()

    const createRoom = async () => {

        try {
            let response = await ky.get('/api/v1/room/generateId')
            response = await response.json()

            if(response && response.id) {
                history.push('/room/' + response.id)
            } else {
                alert('error')
            }
        } catch(err) {
            if(err.name === 'HTTPError') {
                const errCode = (await err.response.json()).err
                handleError({statusCode: errCode})
            }
        }

    }

    const joinRoom = (roomId) => new Promise((resolve, reject) => {
        if(!roomId)
            reject('No room ID')

        history.push('/room/' + roomId)
        resolve(true)
    })

    const buttons = [
        {
            label: l('createNewRoom'),
            onClick: createRoom
        }
    ]

    return(
        <HomeTemplate
            buttons={buttons}
        >
            {/* {!auth.user && !localStorage.getItem('tempUsername') &&
                <ChooseUsername
                    isOpen={usernameModal.isOpen}
                    handleCloseModal={usernameModal.handleCloseModal}
                    cb={handleUsername}
                />
            } */}

            {
                <TypeRoomId
                    isOpen={roomIdModal.isOpen}
                    handleCloseModal={roomIdModal.handleCloseModal}
                    handleRoomJoin={joinRoom}
                />
            }
        </HomeTemplate>
    )
}

export default Home