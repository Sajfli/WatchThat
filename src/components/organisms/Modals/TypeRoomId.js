import { useState } from 'react'

// components
import Input from 'components/atoms/Input/Input'
import TextContent from 'components/atoms/TextContent/TextContent'
import Title from 'components/atoms/Title/Title'
import Modal from '../Modal/Modal'
import Button from 'components/atoms/Button/Button'


const TypeRoomId = ({ isOpen, handleCloseModal, handleRoomJoin }) => {

    const [ roomId, setRoomId ] = useState('')

    const handleSubmit = async e => {

        e.preventDefault()

        if(!roomId) return

        try {
            const joined = await handleRoomJoin(roomId)

            if(joined)
                handleCloseModal()

        } catch(err) {
            console.error(err)
        }

    }

    return(
        <Modal handleClose={handleCloseModal} isOpen={isOpen}>
            <Title type='small'>Dołączanie do pokoju</Title>

            <form onSubmit={handleSubmit}>

                <TextContent>
                    <p>Wpisz ID pokoju, do którego chcesz dołączyć</p>
                    <Input value={roomId} onChange={({target}) => setRoomId(target.value)} width='100%'/>
                </TextContent>

                <TextContent center>
                    <Button width='200px' type='submit'>Dołącz do pokoju!</Button>
                </TextContent>

            </form>


        </Modal>
    )
}

export default TypeRoomId