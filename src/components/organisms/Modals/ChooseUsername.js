import { useState } from 'react'

// components
import Input from 'components/atoms/Input/Input'
import TextContent from 'components/atoms/TextContent/TextContent'
import Title from 'components/atoms/Title/Title'
import Modal from '../Modal/Modal'
import Button from 'components/atoms/Button/Button'


const ChooseUsername = ({ isOpen, handleCloseModal, handleRoomCreate }) => {

    const [ username, setUsername ] = useState('')

    const handleSubmit = e => {

        e.preventDefault()

        console.log(e)

        handleCloseModal()
        handleRoomCreate(username)
    }

    return(
        <Modal handleClose={handleCloseModal} isOpen={isOpen}>
            <Title type='small'>Siemka</Title>

            <form onSubmit={handleSubmit}>

                <TextContent>
                    <p>Aby przejść dalej musisz wybrać sobie tymczasową nazwę użytkownika</p>
                    <Input value={username} onChange={({target}) => setUsername(target.value)} width='100%'/>
                </TextContent>

                <TextContent center>
                    <Button width='200px' type='submit'>Stwórz pokój!</Button>
                </TextContent>

            </form>

            <TextContent center>
                <p>...lub</p>
                <p>Zalogować się!</p>
                <Button width='200px'>Przejdź do logowania!</Button>
            </TextContent>


        </Modal>
    )
}

export default ChooseUsername