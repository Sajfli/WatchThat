import { useState } from 'react';
import SideBar from 'Components/SideBar';
import AuthComponent from 'Components/Auth'

import Router from './Routing/Router'

import { BrowserRouter } from 'react-router-dom'

import UserAuthManager from './Services/UserAuthManager'
import AuthContext from 'context/AuthContext';

import './App.scss'


const UserAuth = new UserAuthManager()

function App() {

  const [ authPopup, setAuthPopup ] = useState(false)

  const [ isSignedIn, setIsSignedIn ] = useState(UserAuth.isSignedIn())

  const signIn = ({username, token}, cb) => {
    UserAuth.putIntoLocalStorage({username, token})

    if(UserAuth.isSignedIn()) {
      setIsSignedIn(true)
      if(cb) cb()
    }

    else setIsSignedIn(false)
  }

  const signOut = () => {
    UserAuth.signOut()
    setIsSignedIn(false)
  }



  return (
    <div className="App">

      <AuthContext.Provider value={{isSignedIn, signIn, signOut}}>
        <BrowserRouter>

          <SideBar authPopupCallback={() => setAuthPopup(true)} />

          {
            authPopup &&
              <AuthComponent authPopupCallback={() => setAuthPopup(false)} />
          }

          <Router />

        </BrowserRouter>
      </AuthContext.Provider>

    </div>
  );
}

export default App;
