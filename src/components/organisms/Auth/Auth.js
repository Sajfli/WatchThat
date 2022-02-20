import { useState, useEffect } from 'react'

// components
import SignUpForm from './SignUpForm'
import SignInForm from './SignInForm'

// hooks
import useLocalisation from 'hooks/useLocalisation'
import useAuth from 'hooks/useAuth'
import useError from 'hooks/useError'

const Auth = ({ authPopupCallback }) => {
    const l = useLocalisation()

    const [waiting, setWaiting] = useState(false)
    const [register, setRegister] = useState(false)
    const [authError, setAuthError] = useState(null)

    const handleError = useError()

    const auth = useAuth()

    useEffect(() => {
        setAuthError(null)
    }, [register])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)

        const data = {}

        for (const [name, value] of formData.entries()) {
            if (name === 'password' || name === 'email' || name === 'username')
                data[name] = value
        }

        setWaiting(true)

        if (register) {
            auth.signUp({ ...data }, async (error) => {
                if (!error) authPopupCallback()
                if (typeof error === 'object')
                    try {
                        const response = await error.json()

                        if (response.err) {
                            const errors = {}
                            response.err.forEach((e) => {
                                const key = Object.keys(e)[0]
                                errors[key] = e[key]
                            })
                            setAuthError({ msg: errors })
                        } else throw Error('noErrorMsg')
                    } catch (err) {
                        handleError()
                    }

                setWaiting(false)
            })
        } else {
            auth.signIn({ ...data }, (error) => {
                if (error === 1) setAuthError(true)
                else if (!error) authPopupCallback()

                setWaiting(false)
            })
        }
    }

    const switchRegister = () => setRegister(!register)
    const height = '40px',
        width = '100%'

    return (
        <div onClick={(e) => e.stopPropagation()}>
            {!register ? (
                <SignInForm
                    handleSubmit={handleSubmit}
                    height={height}
                    width={width}
                    authError={authError}
                    switchRegister={switchRegister}
                    waiting={waiting}
                    l={l}
                />
            ) : (
                <SignUpForm
                    handleSubmit={handleSubmit}
                    height={height}
                    width={width}
                    authError={authError}
                    switchRegister={switchRegister}
                    waiting={waiting}
                    l={l}
                />
            )}
        </div>
    )
}

export default Auth
