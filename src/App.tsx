import { useEffect, useRef, useState } from 'react'

const useTimer = (initialTime: number, { speedUpFirstSecond }: { speedUpFirstSecond?: boolean }) => {
  const timerRef = useRef<number | null>(null)
  const firstTickRef = useRef<number | null>(null)
  const [currentTime, setCurrentTime] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)
  
  const stopTimer = () => {
    if (!timerRef.current || !firstTickRef.current) return

    setIsRunning(false)
    
    clearInterval(timerRef.current)
    timerRef.current = null

    clearTimeout(firstTickRef.current)
    firstTickRef.current = null
  }

  useEffect(() => {
    if (currentTime !== 0) return

    stopTimer()
  },[currentTime])
  
  const start = () => {
    if (timerRef.current || firstTickRef.current || currentTime === 0) return

    setIsRunning(true)

    firstTickRef.current = setTimeout(() => {
      const newValue = currentTime - 1000
      setCurrentTime(newValue)
      
      if (newValue === 0) return
      
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => prev - 1000)
      }, 1000)
    }, speedUpFirstSecond ? 300 : 1000)
    

  }

  const reset = () => {
    stopTimer()
    setCurrentTime(initialTime)
  }
  
  return {
    start,
    pause: stopTimer,
    reset,
    currentTime,
    isRunning,
  }
}

function App() {
  const {start, pause, reset, currentTime, isRunning} = useTimer(3000, {
    speedUpFirstSecond: true
  })

  return (
    <div>
      <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      <button onClick={reset}>Reset</button>   
      <div>isRunning: {String(isRunning)}</div>   
      <div>{currentTime/1000}</div>   
    </div>
  )
}

export default App
