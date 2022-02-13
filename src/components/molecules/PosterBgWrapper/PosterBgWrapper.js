import Poster from 'components/atoms/Poster/Poster'

import style from './PosterBgWrapper.module.scss'

const PosterBgWrapper = ({ src, children, fullOnSmall }) => {
    return (
        <div
            className={classnames(
                style.posterBgWrapper,
                fullOnSmall && style.fullOnSmall
            )}
        >
            {children}

            <Poster className={style.poster} src={src} />
        </div>
    )
}

PosterBgWrapper.propTypes = {
    src: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    fullOnSmall: PropTypes.bool,
}

export default PosterBgWrapper
