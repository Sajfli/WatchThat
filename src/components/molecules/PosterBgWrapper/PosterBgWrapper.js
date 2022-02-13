import Poster from 'components/atoms/Poster/Poster'

import style from './PosterBgWrapper.module.scss'

const PosterBgWrapper = ({ src, children }) => {
    return (
        <div className={style.posterBgWrapper}>
            {children}

            <Poster className={style.poster} src={src} />
        </div>
    )
}

PosterBgWrapper.propTypes = {
    src: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
}

export default PosterBgWrapper
