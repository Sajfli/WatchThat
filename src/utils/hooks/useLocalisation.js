import { useContext } from 'react'

import LangContext from 'context/Lang'

// files with localisations
import en from 'res/localisation/en/translation.json'
import pl from 'res/localisation/pl/translation.json'

function useLocalisation () {

    const { lang } = useContext(LangContext)
    console.log('lang!', lang)
    const langLowerCase = lang ? lang.toLowerCase() : 'en'

    let translation

    switch(langLowerCase) {
        case 'pl':
            translation = pl
            break
        default:
            translation = en
            break
    }

    // let localisation = await import(`res/localisation/${langLowerCase}/translation.json`) || null

    // if(!localisation && langLowerCase !== 'en') {
    //     localisation = await import(`res/localisation/en/translation.json`) || null
    // }

    // return function that returns string in current language
    return (value) => {

        let string

        try {
            string = translation[value]
            if(!string) throw Error()
        } catch(err) {
            string = 'null'
        }

        return string
        // return <h1>{translation[value] || 'undefined'}</h1>
    }

}

export default useLocalisation