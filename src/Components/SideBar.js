import { Link } from 'react-router-dom'

// import AuthContext from 'context/Auth'
import useAuth from 'hooks/useAuth'
import style from './styles/SideBar.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import defaultAvatar from 'res/img/default-avatar.jpg'
import logo from 'res/img/logo-260.png'


import {
    faSignInAlt, faSignOutAlt
} from '@fortawesome/free-solid-svg-icons'


const SideBar = ({authPopupCallback}) => {

    // const authContext = useContext(AuthContext)
    const auth = useAuth()

    const isSignedIn = !!auth.user

    return(
        <div
            className={style.SideBar}
        >

            <div className={style.block}>
                <div className={style.logo}>

                    <div className={style.btn}>
                        <Link to='/' className='linkFill'>
                            <img src={logo} className={style.logoImg} alt='WT'/>
                        </Link>
                    </div>

                </div>

            </div>


            <div className={style.block}>
                {
                    isSignedIn ?
                        <>
                            <div className={style.user}>
                                {/* <div>{authContext.username}</div> */}
                                <img src={defaultAvatar} alt=''/>
                            </div>

                            <div onClick={auth.signOut} className={style.btn}>
                                <FontAwesomeIcon icon={faSignOutAlt} />
                            </div>

                        </>
                    :
                        <div onClick={authPopupCallback} className={style.btn}>
                            <FontAwesomeIcon icon={faSignInAlt} />
                        </div>
                }
            </div>

        </div>
    )
}

export default SideBar