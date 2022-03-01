import { useContext, useEffect, useState, createContext } from 'react'
import { getUsername } from '@/services/getUserData'
import ky from 'ky'

import useError from './useError'

const AuthContext = createContext({})

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [usernameTries, setUsernameTries] = useState(0)
    const [checked, setChecked] = useState(false)

    const handleError = useError()

    useEffect(() => {
        let mounted = true
        if (
            !user ||
            (!!user &&
                (!user.auth ||
                    user.username ||
                    !user._id ||
                    usernameTries >= 3))
        )
            return
        ;(async () => {
            const username = await getUsername(user._id)

            if (!username) return

            setUser({ ...user, username })

            setTimeout(() => {
                if (mounted) setUsernameTries(usernameTries + 1)
            }, 100)
        })()

        return () => {
            mounted = false
        }
    }, [user, usernameTries])

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (token) {
            ;(async () => {
                try {
                    const response = await ky
                        .get('/api/v1/auth/', {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        })
                        .json()

                    if (response) {
                        setChecked(true)
                    }

                    if (!response.auth) {
                        console.err('invalid_token')
                        localStorage.removeItem('token')
                        return
                    }

                    setUser({
                        auth: true,
                        _id: response._id,
                    })
                } catch (err) {
                    console.log(err)
                    setChecked(true)
                }
            })()
        } else setChecked(true)
    }, [])

    const handleAuthError = (err, cb, signUp) => {
        if (err.response && err.response.status) {
            if (signUp && err.response.status === 400) {
                cb(err.response)
            } else if (!signUp && err.response.status === 401) cb(1)
            else {
                cb(2)
                handleError(null, err.response.status)
            }
        } else {
            cb(2)
            console.log(err.response)
            handleError()
        }
    }

    const signIn = async ({ email, password }, cb) => {
        try {
            const response = await ky
                .post('/api/v1/auth/login', {
                    json: { email, password },
                })
                .json()

            const { err, data } = response

            if (err) throw Error(err)

            setUser(data)
            localStorage.setItem('token', data.token)

            if (cb) cb(0)
        } catch (err) {
            handleAuthError(err, cb)
        }
    }

    const signUp = async ({ email, username, password }, cb) => {
        try {
            const response = await ky
                .post('/api/v1/auth/register', {
                    json: { email, username, password },
                })
                .json()

            const { err, data } = response

            if (err) throw Error(err)

            setUser(data)
            localStorage.setItem('token', data.token)

            if (cb) cb()
        } catch (err) {
            handleAuthError(err, cb, true)
        }
    }

    const signOut = () => {
        setUser(null)
        localStorage.removeItem('token')
    }

    return (
        <AuthContext.Provider
            value={{ user, signIn, signOut, signUp, checked }}
        >
            {children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

const useAuth = () => {
    const auth = useContext(AuthContext)

    return auth
}

export { AuthProvider }
export default useAuth
