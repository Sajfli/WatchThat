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

                    <ViewHeader>{l('hello')}</ViewHeader>

                    <TextContent>
                        <p>{l('youNeedToJoinARoom')}</p>
                    </TextContent>

                        <Buttons
                            btnProps={btnProps}
                            btns={buttons}

                        />
                    {children}
                </div>
            </PosterBgWrapper>


        // </div>
    )

}

export default HomeTemplate