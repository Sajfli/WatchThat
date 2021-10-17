class UserAuthManager {

    isSignedIn() {
        return (!!this.getToken())
    }

    signOut() {
        if(this.getToken())
            localStorage.removeItem('token')
        if(this.getUsername())
            localStorage.removeItem('username')
    }

    getToken() {
        return localStorage.getItem('token')
    }

    getUsername() {
        return localStorage.getItem('username')
    }

    putIntoLocalStorage({username, token}) {
        if(!token && !this.getToken())
            return {err: 'noToken'}

        if(token)
            localStorage.setItem('token', token)

        if(username)
            localStorage.setItem('username', username)
    }

}

export default UserAuthManager