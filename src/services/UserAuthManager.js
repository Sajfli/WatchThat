class UserAuthManager {

    isSignedIn() {
        return (!!this.getToken())
    }

    signIn(changeState) {

        return ({token}, cb) => {
            this.putIntoLocalStorage({token})

            if(this.isSignedIn()) {
                changeState(true)
                if(cb) cb()
            }
            else changeState(false)
        }

    }

    signOut(changeState) {
        return () => {
            if(this.getToken())
                localStorage.removeItem('token')

            changeState(false)
        }
    }

    getToken() {
        return localStorage.getItem('token')
    }

    putIntoLocalStorage({token}) {
        if(!token && !this.getToken())
            return {err: 'noToken'}

        if(token)
            localStorage.setItem('token', token)
    }

}

export default UserAuthManager