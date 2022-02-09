import  useLocalisation from "./useLocalisation"
import { toast } from 'react-toastify'

const useToast = () => {
    const l = useLocalisation()

    return (m) => {

        if(!m) return

        let msg = l(m)


        if(!msg || msg === 'null') return

        toast(msg, {
            position: 'top-right',
            autoClose: 3000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false
        })

    }
}

export default useToast