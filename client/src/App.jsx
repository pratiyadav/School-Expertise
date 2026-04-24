import { useState , useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [data, setData] = useState()

  useEffect(() => {
    fetch("/api/message")
    .then((res) => res.json())
    .then((data) => setData(data.message)) ; 
  }, [])
  

  return (
    <>
      <h1>Hello from School Expertise  frontend</h1>
      <h3>{data}</h3>
    </>
  )
}

export default App
