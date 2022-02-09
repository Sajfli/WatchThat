import ky from 'ky'

const getUsername = async (_id) => {
    try {
        const response = await ky.get(`/api/v1/user/${_id}/username`).json()

        if(response.username)
            return response.username

        else return null


    } catch(err) {
        console.error(err)
    }
}

export { getUsername }