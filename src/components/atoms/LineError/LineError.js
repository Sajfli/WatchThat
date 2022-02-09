import classnames from 'classnames'
import useLocalisation from 'hooks/useLocalisation'

import style from './LineError.module.scss'

const ErrorNode = ({children, center}) => {
    return <div className={classnames(style.error, center && 'textCenter')}>{children}</div>
}

const LineError = ({errors, all = false, center = false}) => {
    const l = useLocalisation()

    if(!errors || errors.length === 0)
        return null

    return(
        <div>
            {
                all ?
                    errors.map((err) =>
                        <ErrorNode center={center} key={err}>{l(err)}</ErrorNode>
                    )
                :
                    <ErrorNode center={center}>{l(errors[0])}</ErrorNode>
            }
        </div>
    )
}

export default LineError