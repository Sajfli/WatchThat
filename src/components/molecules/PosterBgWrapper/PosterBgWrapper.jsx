import classnames from 'classnames'

import Poster from '@/components/atoms/Poster/Poster'

import style from './PosterBgWrapper.module.scss'

const PosterBgWrapper = ({ src, children, fullOnSmall, author }) => {
    return (
        <div
            className={classnames(
                style.posterBgWrapper,
                fullOnSmall && style.fullOnSmall
            )}
        >
            {children}

            <Poster className={style.poster} author={author} src={src} />
        </div>
    )
}

PosterBgWrapper.propTypes = {
    src: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    fullOnSmall: PropTypes.bool,
    author: PropTypes.shape({
        author: PropTypes.shape({
            name: PropTypes.string,
            url: PropTypes.string,
        }),
        image: PropTypes.shape({
            url: PropTypes.string,
        }),
    }),
}

export default PosterBgWrapper
