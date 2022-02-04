import { useState } from 'react'

// components
import Input from 'components/atoms/Input/Input'
import TextContent from 'components/atoms/TextContent/TextContent'
import Title from 'components/atoms/Title/Title'
import Modal from '../Modal/Modal'
import Button from 'components/atoms/Button/Button'

import useAuthModal from 'hooks/useAuthModal'

import validateUsername from 'utils/validateUsername'

import LineError from 'components/atoms/LineError/LineError'


const ChooseUsername = ({ isOpen, handleCloseModal, cb }) => {

    const [ username, setUsername ] = useState('')
    const [ , openAuthModal ] = useAuthModal()
    const [ errors, setErrors ] = useState(null)

    const handleSubmit = e => {

        e.preventDefault()

        // validate
        validateUsername(username, (err) => {
            if(!err) {
                localStorage.setItem('tempUsername', username)
                handleCloseModal()
            } else {
                setErrors(err)
            }

        })
    }

    const goToAuth = () => {
        handleCloseModal()
        openAuthModal()
    }

    return(
        <Modal handleClose={handleCloseModal} isOpen={isOpen}>
            <Title type='small' center>Nazwa użytkownika</Title>

            <form onSubmit={handleSubmit}>

                <TextContent>
                    <p style={{textAlign: 'center'}}>Aby przejść dalej musisz wybrać tymczasową nazwę użytkownika</p>
                    <Input value={username} onChange={({target}) => setUsername(target.value)} width='100%'/>

                    <LineError errors={errors} all center />
                </TextContent>

                <TextContent center>
                    <Button width='200px' type='submit'>Ustaw nazwe użytkownika</Button>
                </TextContent>


            </form>

            <TextContent center>
                <div style={{marginBottom: 8}}>
                    ...lub<br/>
                    Zalogować się!
                </div>
                <Button width='200px' onClick={goToAuth}>Przejdź do logowania!</Button>
            </TextContent>


        </Modal>
    )
}

export default ChooseUsername