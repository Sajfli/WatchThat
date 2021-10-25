import React, { useState, Suspense } from 'react';

// UI components
import SideBar from 'Components/SideBar';

// logic
import Router from './routing/Router'

// context
// import LangContext from 'context/Lang'

// others'
// import LangManager from './services/LangManager'

// style
import './App.scss'

// can be lazy
const AuthComponent = React.lazy(() => import('Components/Auth'))

// ######
// const langManager = new LangManager()

function App() {

  // should Auth Component popup be rendered
  const [ authPopup, setAuthPopup ] = useState(false)



  return (
    <div className="App">

          <SideBar authPopupCallback={() => setAuthPopup(true)} />

          {
            authPopup &&
              <Suspense fallback={<div>Loading...</div>}>
                <AuthComponent authPopupCallback={() => setAuthPopup(false)} />
              </Suspense>
          }

          <Router />


    </div>
  );
}

export default App;
