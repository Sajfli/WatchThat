import { Link } from 'react-router-dom'

import classnames from 'classnames'

import style from './Header.module.scss'

const Nav = () => {

    const elements = [
        {
            label: 'Logowanie',
            key: 'sign-in'
        }, {
            label: 'Rejestracja',
            key: 'sign-up'
        }, {
            label: 'Stwórz pokój',
            key: 'create-room'
        }
    ]

    return(
        <div className={style.nav}>
            {
                elements.map(({label, key}) =>
                    <div key={key}>{label}</div>
                )
            }
        </div>
    )
}

const Header = () => {

    return(
        <div className={style.Header}>
            <div className={style.logo}>
                <Link to="/" className={classnames(style.indexLink, 'link')}>WatchThat</Link>
            </div>

            <Nav />

        </div>
    )

}

export default Header