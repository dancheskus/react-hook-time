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

interface IResetSettings {
  startIfWasStopped: boolean
  continueIfWasRunning: boolean
}

const useStopwatch = (
  {
    initialTime = 0,
    autostart,
    onPause,
    onStart,
    onReset,
  }: {
    initialTime?: number
    autostart?: boolean
    onPause?: (currentTime: number) => void
    onStart?: (currentTime: number) => void
    onReset?: (currentTime: number) => void
  }) => {
  const timerRef = useRef<number | null>(null)

  const convertedInitialTime = convertTime(initialTime, 'sec')
  const getReturningTime = (returningTime: number) => convertMsToUnit(returningTime, 'sec')

  const [currentTime, setCurrentTime] = useState(convertedInitialTime)
  const [isRunning, setIsRunning] = useState(!!autostart)

  const stopTimer = () => {
    if (!timerRef.current) return

    setIsRunning(false)

    clearInterval(timerRef.current)
    timerRef.current = null
  }

  useEffect(() => {
    autostart && start()
  }, [])

  const start = () => {
    if (timerRef.current) return

    onStart && onStart(getReturningTime(currentTime))

    setIsRunning(true)

    timerRef.current = setInterval(() => {
      setCurrentTime(prev => prev + 1000)
    }, 1000)

  }

  const reset = (resetSettings?: IResetSettings) => {
    const { startIfWasStopped, continueIfWasRunning } = resetSettings || {}

    onReset && onReset(getReturningTime(convertedInitialTime))

    if (continueIfWasRunning && isRunning) {
      setCurrentTime(convertedInitialTime)
    } else if (startIfWasStopped && !isRunning) {
      setTimeout(() => setCurrentTime(convertedInitialTime), 0)
      start()
    } else {
      stopTimer()
      setCurrentTime(convertedInitialTime)
    }
  }

  const pause = () => {
    if (!timerRef.current) return

    stopTimer()
    onPause && onPause(getReturningTime(currentTime))
  }

  return {
    start,
    pause,
    reset,
    isRunning,
    currentTime: getReturningTime(currentTime),
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

  const start = (startSettings?: { withTime: number }) => {
    const { withTime } = startSettings || {}

    if (timerRef.current || firstTickRef.current || (!withTime && currentTime === 0)) return

    onStart && onStart(getReturningTime(currentTime))

    setIsRunning(true)

    withTime && setCurrentTime(withTime)

    firstTickRef.current = setTimeout(() => {
      const newValue = (withTime || currentTime) - 1000
      setCurrentTime(newValue)

      if (newValue === 0) return

      timerRef.current = setInterval(() => {
        setCurrentTime(prev => prev - 1000)
      }, 1000)
    }, speedUpFirstSecond ? 300 : 1000)
  }

  const reset = (resetSettings?: IResetSettings) => {
    const { startIfWasStopped, continueIfWasRunning } = resetSettings || {}

    onReset && onReset(getReturningTime(convertedInitialTime))

    if (continueIfWasRunning && isRunning) {
      setCurrentTime(convertedInitialTime)
    } else if (startIfWasStopped && !isRunning) {
      start({ withTime: convertedInitialTime })
    } else {
      stopTimer()
      setCurrentTime(convertedInitialTime)
    }
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
  const timer = useTimer(5, {
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

  const stopwatch = useStopwatch({
    // autostart: true,
    // initialTime: 5,
    onPause: (time) => console.log('pause: ' + time),
    onStart: (time) => console.log('start: ' + time),
    onReset: (time) => console.log('reset: ' + time),
  })

  console.log('component updated...')

  return (
    <div>
      <h1>Timer</h1>
      <button onClick={timer.start}>Start</button>
      <button onClick={timer.pause}>Pause</button>
      <button onClick={() => {
        timer.reset({
          startIfWasStopped: false,
          continueIfWasRunning: false,
        })
      }}>Reset</button>
      <div>isRunning: {String(timer.isRunning)}</div>
      <div>currentTime: {timer.currentTime}</div>

      <h1>Stateless Timer</h1>
      <button onClick={statelessTimer.start}>Start</button>
      <button onClick={statelessTimer.cancel}>Cancel</button>
      <div>isRunning: {String(statelessTimer.isRunning)}</div>

      <h1>Stopwatch</h1>
      <button onClick={stopwatch.start}>Start</button>
      <button onClick={stopwatch.pause}>Pause</button>
      <button onClick={() => {
        stopwatch.reset({
          startIfWasStopped: false,
          continueIfWasRunning: false,
        })
      }}>Reset</button>
      <div>isRunning: {String(stopwatch.isRunning)}</div>
      <div>currentTime: {stopwatch.currentTime}</div>
    </div>
  )
}

export default App
