import React from 'react';

// template
import MainTemplate from 'components/templates/MainTemplate'

// logic
import Router from './routing/Router'

// style
import './App.scss'


function App() {

  return (
    <MainTemplate>

      <Router />

    </MainTemplate>
  );
}

export default App;
