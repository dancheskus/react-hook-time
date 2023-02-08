import { useEffect, useRef, useState } from 'react'

type TTimeUnit = 'ms' | 'sec' | 'min' | 'hour' | 'day'

const convertTime = (time: number, timeUnit: TTimeUnit) => {
  switch (timeUnit) {
    case 'ms':
      return time
    case 'sec':
      return time * 1_000
    case 'min':
      return time * 60_000
    case 'hour':
      return time * 3_600_000
    case 'day':
      return time * 86_400_000
  }
}
const convertMsToUnit = (time: number, timeUnit: TTimeUnit) => {
  switch (timeUnit) {
    case 'ms':
      return time
    case 'sec':
      return time / 1_000
    case 'min':
      return time / 60_000
    case 'hour':
      return time / 3_600_000
    case 'day':
      return time / 86_400_000
  }
}

const useTimer = (
  initialTime: number,
  {
    autostart,
    speedUpFirstSecond,
    onPause,
    onStart,
    onReset,
    onEnd,
    timeUnit = 'sec',
  }: {
    autostart?: boolean
    speedUpFirstSecond?: boolean,
    onPause?: (currentTime: number) => void
    onStart?: (currentTime: number) => void
    onReset?: (currentTime: number) => void
    onEnd?: () => void
    timeUnit?: Exclude<TTimeUnit, 'ms'>
  }) => {
  const timerRef = useRef<number | null>(null)
  const firstTickRef = useRef<number | null>(null)

  const convertedInitialTime = convertTime(initialTime, timeUnit)
  const getReturningTime = (returningTime: number) => convertMsToUnit(returningTime, 'sec')
  
  const [currentTime, setCurrentTime] = useState(convertedInitialTime)
  const [isRunning, setIsRunning] = useState(!!autostart)

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
    autostart && start()
  }, [])

  useEffect(() => {
    if (currentTime !== 0) return

    onEnd && onEnd()
    stopTimer()
  }, [currentTime])

  const start = () => {
    if (timerRef.current || firstTickRef.current || currentTime === 0) return

    onStart && onStart(getReturningTime(currentTime))

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
    onReset && onReset(getReturningTime(convertedInitialTime))

    stopTimer()
    setCurrentTime(convertedInitialTime)
  }

  const pause = () => {
    if (!firstTickRef.current) return

    stopTimer()
    onPause && onPause(getReturningTime(currentTime))
  }

  return {
    start,
    pause,
    reset,
    currentTime: getReturningTime(currentTime),
    isRunning,
  }
}

const useStatelessTimer = (
  initialTime: number,
  {
    autostart,
    onStart,
    onCancel,
    onEnd,
    timeUnit = 'sec'
  }: {
    autostart?: boolean
    onStart?: () => void
    onCancel?: () => void
    onEnd?: () => void
    timeUnit?: TTimeUnit
  }) => {
  const timerRef = useRef<number | null>(null)
  const [isRunning, setIsRunning] = useState(!!autostart)

  const convertedInitialTime = convertTime(initialTime, timeUnit)

  useEffect(() => {
    autostart && start()
  }, [])

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
    }, convertedInitialTime)
  }

  const cancel = () => {
    if (!timerRef.current) return

    onCancel && onCancel()
    stopTimer()
  }

  return {
    start,
    cancel,
    isRunning,
  }
}

function App() {
  const { start, pause, reset, currentTime, isRunning } = useTimer(1, {
    // autostart: true,
    speedUpFirstSecond: false,
    // timeUnit: 'min',
    onPause: (time) => console.log('pause: ' + time),
    onStart: (time) => console.log('start: ' + time),
    onReset: (time) => console.log('reset: ' + time),
    onEnd: () => console.log('end')
  })

  const statelessTimer = useStatelessTimer(3, {
    // autostart: true,
    // timeUnit: 'min',
    onStart: () => console.log('start'),
    onCancel: () => console.log('cancel'),
    onEnd: () => console.log('end')
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

      <h1>Stateless Timer 2</h1>
      <button onClick={statelessTimer.start}>Start</button>
      <button onClick={statelessTimer.cancel}>Cancel</button>
      <div>isRunning: {String(statelessTimer.isRunning)}</div>
    </div>
  )
}

export default App
