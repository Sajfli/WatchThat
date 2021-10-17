import { useContext } from 'react'

import AuthContext from 'context/AuthContext'
import style from './styles/SideBar.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import defaultAvatar from 'res/img/default-avatar.jpg'


import {
    faSignInAlt, faSignOutAlt
} from '@fortawesome/free-solid-svg-icons'

const SideBar = ({authPopupCallback}) => {

    const authContext = useContext(AuthContext)

    const handleSignOut = () => {
        authContext.signOut()

    }

    const isSignedIn = authContext.isSignedIn

    return(
        <div
            className={style.SideBar}
        >

            <div className={style.block}>
                <div className={style.logo}>WT</div>

            </div>


            <div className={style.block}>
                {
                    isSignedIn ?
                        <>
                            <div className={style.user}>
                                {/* <div>{authContext.username}</div> */}
                                <img src={defaultAvatar} alt=''/>
                            </div>

                            <div onClick={handleSignOut} className={style.btn}>
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