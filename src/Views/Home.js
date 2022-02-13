import ky from 'ky'
import { useNavigate } from 'react-router'

import HomeTemplate from 'components/pages/HomeTemplate'
import useLocalisation from 'hooks/useLocalisation'
import useError from 'hooks/useError'

const Home = () => {
    const l = useLocalisation()
    const handleError = useError()

    const navigate = useNavigate()

    const createRoom = async () => {
        try {
            let response = await ky.get('/api/v1/room/generateId')
            response = await response.json()

            if (response && response.id) {
                navigate('/room/' + response.id)
            } else {
                alert('error')
            }
        } catch (err) {
            if (err.name === 'HTTPError') {
                const errCode = (await err.response.json()).err
                handleError({ statusCode: errCode })
            }
        }
    }

    const buttons = [
        {
            label: l('createNewRoom'),
            onClick: createRoom,
        },
    ]

    return <HomeTemplate buttons={buttons}></HomeTemplate>
}

export default Home
