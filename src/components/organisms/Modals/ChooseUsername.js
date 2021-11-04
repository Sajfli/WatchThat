// components
import Input from 'components/atoms/Input/Input'
import TextContent from 'components/atoms/TextContent/TextContent'
import Title from 'components/atoms/Title/Title'
import Modal from '../Modal/Modal'
import Button from 'components/atoms/Button/Button'


const ChooseUsername = ({ isOpen, handleCloseModal }) => {

    return(
        <Modal handleClose={handleCloseModal} isOpen={isOpen}>
            <Title type='small'>Siemka</Title>

            <TextContent>
                <p>Aby przejść dalej musisz wybrać sobie tymczasową nazwę użytkownika</p>
                <Input width={'100%'}/>
            </TextContent>

            <TextContent center>
                <p>...lub</p>
                <p>Zalogować się!</p>
                <Button width='200px'>Przejdź do logowania!</Button>
            </TextContent>


        </Modal>
    )
}

export default ChooseUsername