import useLocalisation from './useLocalisation'
import { toast } from 'react-toastify'

const useError = () => {
    const l = useLocalisation()

    return (params) => {
        let msg,
            useToast = true

        if (params) {
            const { err, statusCode, useToast: _useToast = true } = params

            if (useToast !== _useToast) useToast = _useToast

            if (err) msg = l(err)
            else if (statusCode) {
                if (statusCode >= 500 && statusCode < 600)
                    msg = l('http5xxError')
            }
        } else {
            msg = null
        }

        if (!msg || msg === 'null') msg = l('unspecifiedError')

        if (useToast) {
            toast.error(msg, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
            })
        } else return msg
    }
}

export default useError
