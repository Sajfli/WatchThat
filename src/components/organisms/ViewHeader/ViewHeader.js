import Title from 'components/atoms/Title/Title'

const ViewHeader = ({children}) => {
    return(
        <div style={{alignSelf: 'flex-start'}}>
            <Title>
                {children}
            </Title>
        </div>
    )
}

export default ViewHeader