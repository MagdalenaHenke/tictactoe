import React from 'react';
import './styles/_cssReset.css';
import './styles/_cssUtil.css';
import './styles/App.css';
import Game from './components/Game.jsx';

function App() {
  return (
    <main className="App">
      <Game />
    </main>
  );
}

export default App;
