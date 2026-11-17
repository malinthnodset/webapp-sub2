import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import CreateQuiz from './quiz/CreateQuiz'
import HomePage from './home/HomePage'

// Main react component. Represents the root of the applications UI
// All other (future) created components will be rendered inside this one

function App() {
  const [count, setCount] = useState(0)

  return (
    /* Imports the HomePage component */
      <div className="App">
        <HomePage /> 
      </div>
  )
}

export default App
