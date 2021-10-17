import React, { useState, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom'

// UI components
import SideBar from 'Components/SideBar';

// logic
import Router from './routing/Router'

// context
import AuthContext from 'context/Auth';
import LangContext from 'context/Lang'

// others
import UserAuthManager from './services/UserAuthManager'
import LangManager from './services/LangManager'

// style
import './App.scss'

// can be lazy
const AuthComponent = React.lazy(() => import('Components/Auth'))

// ######

const authManager = new UserAuthManager()
const langManager = new LangManager()

function App() {

  // should Auth Component popup be rendered
  const [ authPopup, setAuthPopup ] = useState(false)

  // is Signed In, initially taken from UserAuth
  const [ isSignedIn, setIsSignedIn ] = useState(authManager.isSignedIn())

  const [ lang, setLang ] = useState(langManager.getLang())

  // handle sign in and sign out in AuthContext
  const signIn = authManager.signIn(setIsSignedIn)
  const signOut = authManager.signOut(setIsSignedIn)

  // handle language change
  const changeLang = langManager.handleLangChange(setLang)



  return (
    <div className="App">

      <AuthContext.Provider value={{isSignedIn, signIn, signOut}}>
      <LangContext.Provider value={{lang: lang, changeLang}}>

        <BrowserRouter>

          <SideBar authPopupCallback={() => setAuthPopup(true)} />

          {
            authPopup &&
              <Suspense fallback={<div>Loading...</div>}>
                <AuthComponent authPopupCallback={() => setAuthPopup(false)} />
              </Suspense>
          }

          <Router />

        </BrowserRouter>

      </LangContext.Provider>
      </AuthContext.Provider>

    </div>
  );
}

export default App;
