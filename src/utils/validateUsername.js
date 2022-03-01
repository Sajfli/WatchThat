import { isAlphanumeric } from 'validator'
import errors from '@/config/errors'

const validateUsername = (username, cb) => {
    const err = []

    if (!username) err.push(errors.noUsername)
    if (username.length < 3 || username.length > 20)
        err.push(errors.usernameLength)
    if (!isAlphanumeric(username)) err.push(errors.usernameAlphanumeric)

    const resp = err.length === 0 ? null : err

    cb(resp)
}

export default validateUsername
