import style from './Modal.module.scss'

const Modal = ({handleClose, isOpen, children}) => {

    if(!isOpen) return null

    const handleEclipseClick = ({target}) => {
        if(target.classList.contains(style.eclipse))
            handleClose()
    }

    return(
        <div className={style.eclipse} onClick={handleEclipseClick}>
            <div className={style.modal}>
                {children}
            </div>
        </div>
    )
}

export default Modal