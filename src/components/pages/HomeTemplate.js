// Components
import TextContent from 'components/atoms/TextContent/TextContent'
import ViewHeader from 'components/organisms/ViewHeader/ViewHeader'
import PosterBgWrapper from 'components/molecules/PosterBgWrapper/PosterBgWrapper'
import Buttons from 'components/molecules/Buttons/Buttons'

// hooks
import useLocalisation from 'hooks/useLocalisation'

// style

// img
import homePoster from 'res/img/posters/home.jpg'

const HomeTemplate = ({buttons, children}) => {

    const l = useLocalisation()

    const btnProps = {width: '300px'}

    return(
        // <div className={style.home}>

            <PosterBgWrapper src={homePoster}>
                <div>

                    <ViewHeader noTitleMargin>{l('hello')}</ViewHeader>

                    <TextContent style={{marginTop: 0, marginBottom: 30}}>
                        <p>{l('youNeedToJoinARoom')}</p>
                    </TextContent>

                    <Buttons
                        btnProps={btnProps}
                        btns={buttons}
                    />

                    <TextContent style={{marginTop: 30}}>
                        <p>{l('joinExistingRoom')}</p>
                    </TextContent>


                    {children}
                </div>
            </PosterBgWrapper>


        // </div>
    )

}

export default HomeTemplate