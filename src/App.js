import Header from './Components/Header'
// import Footer from './Components/Footer'

import Router from './Routing/Router'

import { BrowserRouter } from 'react-router-dom'

import './App.scss'


function App() {
  return (
    <div className="App">

      <BrowserRouter>

        <Header />

        <Router />

      </BrowserRouter>

    </div>
  );
}

export default App;
