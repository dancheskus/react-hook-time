import { useEffect, useRef, useState } from 'react'

const useTimer = (initialTime: number, {
  speedUpFirstSecond,
  onPause,
  onStart,
  onReset,
  onEnd,
}: {
  speedUpFirstSecond?: boolean,
  onPause?: (currentTime: number) => void
  onStart?: (currentTime: number) => void
  onReset?: (currentTime: number) => void
  onEnd?: () => void
}) => {
  const timerRef = useRef<number | null>(null)
  const firstTickRef = useRef<number | null>(null)
  const [currentTime, setCurrentTime] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)

  const stopTimer = () => {
    if (!firstTickRef.current) return

    setIsRunning(false)

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    clearTimeout(firstTickRef.current)
    firstTickRef.current = null
  }

  useEffect(() => {
    if (currentTime !== 0) return

    onEnd && onEnd()
    stopTimer()
  }, [currentTime])

  const start = () => {
    if (timerRef.current || firstTickRef.current || currentTime === 0) return

    onStart && onStart(currentTime)

    setIsRunning(true)

    firstTickRef.current = setTimeout(() => {
      const newValue = currentTime - 1
      setCurrentTime(newValue)

      if (newValue === 0) return

      timerRef.current = setInterval(() => {
        setCurrentTime(prev => prev - 1)
      }, 1000)
    }, speedUpFirstSecond ? 300 : 1000)
  }

  const reset = () => {
    onReset && onReset(initialTime)

    stopTimer()
    setCurrentTime(initialTime)
  }

  const pause = () => {
    if (!firstTickRef.current) return

    stopTimer()
    onPause && onPause(currentTime)
  }

  return {
    start,
    pause,
    reset,
    currentTime,
    isRunning,
  }
}

const useStatelessTimer = (initialTime: number, {
  speedUpFirstSecond,
  onStart,
  onStop,
  onEnd,
}: {
  speedUpFirstSecond?: boolean,
  onStart?: () => void
  onStop?: () => void
  onEnd?: () => void
}) => {
  const timerRef = useRef<number | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const stopTimer = () => {
    if (!timerRef.current) return
    
    setIsRunning(false)
    clearInterval(timerRef.current)
    timerRef.current = null
  }

  const start = () => {
    if (timerRef.current) return

    onStart && onStart()

    setIsRunning(true)

    timerRef.current = setTimeout(() => {
      onEnd && onEnd()
      stopTimer()
    }, initialTime * 1000)
  }

  const stop = () => {
    if (!timerRef.current) return

    onStop && onStop()
    stopTimer()
  }

  return {
    start,
    stop,
    isRunning,
  }
}

function App() {
  const { start, pause, reset, currentTime, isRunning } = useTimer(3, {
    speedUpFirstSecond: false,
    onPause: (time) => console.log('pause: ' + time),
    onStart: (time) => console.log('start: ' + time),
    onReset: (time) => console.log('reset: ' + time),
    onEnd: () => console.log('time ended')
  })

  const test = useStatelessTimer(3, {
    onStart: () => console.log('start'),
    onStop: () => console.log('stop'),
    onEnd: () => console.log('time ended')
  })

  console.log('component updated...')

  return (
    <div>
      <h1>Timer 1</h1>
      <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      <button onClick={reset}>Reset</button>
      <div>isRunning: {String(isRunning)}</div>
      <div>{currentTime}</div>

      <h1>Timer 2</h1>
      <button onClick={test.start}>Start</button>
      <button onClick={test.stop}>Stop</button>
      <div>isRunning: {String(test.isRunning)}</div>
    </div>
  )
}

export default App
