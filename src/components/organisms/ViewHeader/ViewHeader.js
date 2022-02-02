import classnames from 'classnames'
import Title from 'components/atoms/Title/Title'

import style from './ViewHeader.module.scss'

const ViewHeader = ({children, noTitleMargin, style: styleProp = {}, ...rest}) => {

    return(
        <div {...rest} style={{alignSelf: 'flex-start', ...styleProp}} className={classnames({[style.noTitleMargin]: noTitleMargin})}>
            <Title>
                {children}
            </Title>
        </div>
    )
}

export default ViewHeader