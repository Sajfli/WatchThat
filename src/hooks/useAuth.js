import { useContext, useEffect, useState, createContext } from 'react'
import ky from 'ky'

const AuthContext = createContext({})

const AuthProvider = ({children}) => {

    const [ user, setUser ] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('token')

        if(token) {
            (async () => {

                try {

                    setUser({
                        auth: true
                    })

                } catch(err) {
                    console.log(err)
                }

            })()
        }
    }, [])

    const signIn = async({ email, password }, cb) => {
        try {
            const response = await ky.post('/api/v1/auth/login', {
                json: {email, password}
            }).json()

            const { err, data } = response

            if(err) throw Error(err)

            setUser(data)
            localStorage.setItem('token', data.token)

            if(cb)
                cb()

        } catch(err) {
            console.log(err)
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
            console.log(err)
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