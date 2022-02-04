import  useLocalisation from "./useLocalisation"
import { toast } from 'react-toastify'

const useError = () => {
    const l = useLocalisation()

    return ({err, statusCode, useToast = true}) => {

        let msg
        if(err)
            msg = l(err)
        else if(statusCode) {
            if(statusCode >= 500 && statusCode < 600)
                msg = l('http5xxError')
        }


        if(!msg || msg === 'null') msg = l('unspecifiedError')

        if(useToast) {
            toast.error(msg, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false
            })
        } else return msg

    }
}

export default useError