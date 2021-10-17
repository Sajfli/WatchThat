class LangManager {

    langList = [ 'en', 'pl' ]

    getLang() {
        const storageLang = localStorage.getItem('language')
        let lang = storageLang

        if(!lang) {
            try {
                let browserLang = navigator.language.split('-')[0]
                if(browserLang)
                    lang = browserLang
                else throw Error()
            } catch(err) {
                lang = 'en'
            }

        }

        lang = lang.toLowerCase()
        if(!this.langList.includes(lang))
            lang = 'en'

        if(storageLang !== lang)
            this.changeLang(lang)

        return lang

    }

    handleLangChange(changeState) {
        return (lang) => {
            if(this.changeLang(lang))
                changeState(lang)
        }
    }

    changeLang(lang) {
        if(!lang) return false

        lang = lang.toLowerCase()
        if(this.langList.includes(lang)) {
            localStorage.setItem('language', lang)
            return true
        } else return false
    }

}

export default LangManager