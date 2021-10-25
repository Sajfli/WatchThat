import { useContext, useEffect, useState, createContext } from 'react'

// files with localisations
import en from 'res/localisation/en/translation.json'
import pl from 'res/localisation/pl/translation.json'

const LocalisationContext = createContext({})

const LocalisationProvider = ({ children }) => {

    const [ lang, setLang ] = useState('en')

    const langList = [ 'en', 'pl' ]

    const getLang = () => {
        const fromStorage = localStorage.getItem('language')
        let _lang = fromStorage

        if(!_lang) {
            try {
                let browserLang = navigator.language.split('-')[0]
                if(browserLang)
                    _lang = browserLang
                else throw Error()
            } catch(err) {
                _lang = langList[0]
            }
        }

        _lang = _lang.toLowerCase()

        if(!langList.includes(_lang))
            _lang = langList[0]

        return _lang
    }

    const changeLang = _lang => {

        if(!lang) return false

        _lang = _lang.toLowerCase()
        if(langList.includes(_lang)) {
            localStorage.setItem('language', lang)
            return true
        } else return false


    }

    const change = _lang => {
        if(changeLang(_lang))
            setLang(_lang)
    }

    useEffect(() => {
        console.log('getLang', getLang())
        setLang(getLang())
    }, [])

    return(
        <LocalisationContext.Provider value={{lang, change}}>
            {children}
        </LocalisationContext.Provider>
    )

}

const useLocalisation = () => {

    const loc = useContext(LocalisationContext)
    let translation

    switch(loc.lang) {
        case 'pl':
            translation = pl
            break
        default:
            translation = en
            break
    }

    return (value) => {

        let string

        try {
            string = translation[value]
            if(!string) throw Error()
        } catch(err) {
            string = 'null'
        }

        return string
    }

}


export { LocalisationProvider }
export default useLocalisation