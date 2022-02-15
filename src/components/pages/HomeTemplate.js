import TextContent from 'components/atoms/TextContent/TextContent'
import ViewHeader from 'components/organisms/ViewHeader/ViewHeader'
import PosterBgWrapper from 'components/molecules/PosterBgWrapper/PosterBgWrapper'
import Buttons from 'components/molecules/Buttons/Buttons'

import useLocalisation from 'hooks/useLocalisation'

import style from './Home.module.scss'

import homePoster from 'res/img/posters/home.jpg'
const homePosterAuthor = {
    author: {
        name: 'Atul Vinayak',
        url: 'https://unsplash.com/@atulvi',
    },
    image: {
        url: 'https://unsplash.com/photos/SqRd6V8tu0M',
    },
}

const HomeTemplate = ({ buttons, children }) => {
    const l = useLocalisation()

    const btnProps = { width: '300px' }

    return (
        <PosterBgWrapper src={homePoster} author={homePosterAuthor} fullOnSmall>
            <div className={style.content}>
                <ViewHeader noTitleMargin>{l('hello')}</ViewHeader>

                <TextContent style={{ marginTop: 0, marginBottom: 30 }}>
                    <p>{l('youNeedToJoinARoom')}</p>
                </TextContent>

                <Buttons
                    btnProps={btnProps}
                    btns={buttons}
                    className={style.centerButtons}
                />

                <TextContent style={{ marginTop: 30 }}>
                    <p>{l('joinExistingRoom')}</p>
                </TextContent>

                {children}
            </div>
        </PosterBgWrapper>
    )
}

HomeTemplate.propTypes = {
    buttons: PropTypes.array,
    children: PropTypes.node,
}

export default HomeTemplate
