import { useContext, useEffect, useState, createContext, useCallback } from 'react'
import { getUsername } from 'services/getUserData'
import ky from 'ky'

import useError from './useError'

const AuthContext = createContext({})

const AuthProvider = ({children}) => {

    const [ user, setUser ] = useState(null)
    const [ usernameTries, setUsernameTries ] = useState(0)

    const handleError = useError()


    const getUserName = useCallback(async () => {

        if(!user || user.username) return

        const username = await getUsername(user._id)

        if(!username) return

        setUser({...user, username})

        setTimeout(() => {
            setUsernameTries(usernameTries + 1)
        }, 100)

    }, [usernameTries, user])

    useEffect(() => {
        if(!user && !!user && (!user.auth || user.username || !user._id || usernameTries >= 3)) return

        getUserName()

    }, [user, getUserName, usernameTries])

    useEffect(() => {
        const token = localStorage.getItem('token')

        if(token) {
            (async () => {

                try {

                    const response = await ky.get('/api/v1/auth/', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }).json()

                    if(!response.auth) {
                        console.err("invalid_token")
                        localStorage.removeItem('token')
                        return
                    }

                    setUser({
                        auth: true,
                        _id: response._id
                    })

                } catch(err) {
                    console.log(err)
                }

            })()
        }
    }, [])

    const handleAuthError = (err, cb, signUp) => {
        if(err.response && err.response.status) {

            if(signUp && err.response.status === 400) {
                cb(err.response)
            } else if(!signUp && err.response.status === 401)
                cb(1)
            else {
                cb(2)
                handleError(null, err.response.status)
            }
        } else {
            cb(2)
            handleError()
        }
    }

    const signIn = async({ email, password }, cb) => {
        try {
            const response = await ky.post('/api/v1/auth/login', {
                json: {email, password}
            }).json()

            const { err, data } = response

            if(err) throw Error(err)

            console.log(data)
            setUser(data)
            localStorage.setItem('token', data.token)

            if(cb)
                cb(0)

        } catch(err) {
            handleAuthError(err, cb)
        }
    }

    const signUp = async ({ email, username, password }, cb) => {
        try {
            const response = await ky.post('/api/v1/auth/register', {
                json: { email, username, password }
            }).json()

            const { err, data } = response

            if(err) throw Error(err)

            setUser(data)
            localStorage.setItem('token', data.token)

            if(cb)
                cb()


        } catch(err) {
            handleAuthError(err, cb, true)
        }
    }

    const signOut = () => {
        setUser(null)
        localStorage.removeItem('token')
    }

    return(
        <AuthContext.Provider value={{ user, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )

}

const useAuth = () => {
    const auth = useContext(AuthContext)

    return auth
}

export { AuthProvider }
export default useAuth