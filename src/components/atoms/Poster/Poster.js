import classnames from 'classnames'
import style from './Poster.module.scss'

const Poster = ({ src, className, author, ...rest }) => {
    return (
        <div {...rest} className={classnames(style.poster, className)}>
            <img src={src} alt="" className={style.img} />

            <div className={style.author}>
                <a href={author.image.url} target="_blank" rel="noreferrer">
                    Photo
                </a>{' '}
                /
                <a href={author.author.url} target="_blank" rel="noreferrer">
                    {author.author.name}
                </a>{' '}
                /
                <a
                    href="https://unsplash.com/"
                    target="_blank"
                    rel="noreferrer"
                >
                    Unsplash
                </a>
            </div>
        </div>
    )
}

Poster.propTypes = {
    src: PropTypes.string.isRequired,
    className: PropTypes.string,
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

export default Poster
