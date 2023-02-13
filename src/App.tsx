import { useEffect, useRef, useState } from 'react'

type TTimeUnit = 'ms' | 'sec' | 'min' | 'hour' | 'day'

const parseDate = (input: string | Date) => {
  const date = new Date(input);
  return isNaN(date.getTime()) ? undefined : date.getTime() - Date.now()
}

const convertTimeToMs = (time: number | string | Date, timeUnit: TTimeUnit) => {
  const isDate = typeof time !== 'number'
  const convertedTime = isDate ? parseDate(time) : time

  if (typeof convertedTime !== 'number') return 0

  if (isDate) return convertedTime

  switch (timeUnit) {
    case 'ms':
      return convertedTime
    case 'sec':
      return convertedTime * 1_000
    case 'min':
      return convertedTime * 60_000
    case 'hour':
      return convertedTime * 3_600_000
    case 'day':
      return convertedTime * 86_400_000
  }
}
const convertMsToSec = (milliseconds: number) => milliseconds / 1_000

const convertMsToTimeObj = (milliseconds: number) => {
  const totalSeconds = milliseconds / 1_000;
  const totalMinutes = totalSeconds / 60;
  const totalHours = totalMinutes / 60;
  const totalDays = totalHours / 24;
  const totalYears = totalDays / 365;

  const years = Math.floor(totalYears);
  const remainingDays = totalDays % 365;
  const days = Math.floor(remainingDays);
  const remainingHours = (remainingDays - days) * 24;
  const hours = Math.floor(remainingHours);
  const remainingMinutes = (remainingHours - hours) * 60;
  const minutes = Math.floor(remainingMinutes);
  const remainingSeconds = (remainingMinutes - minutes) * 60;
  const seconds = Math.round(remainingSeconds);

  return { years, days, hours, minutes, seconds };
};

interface IUpdateTimeSettings {
  startIfWasStopped?: boolean
  continueIfWasRunning?: boolean
}

const useStopwatch = (
  {
    initialTime = 0,
    autostart,
    onPause,
    onStart,
    onReset,
    onUpdate,
  }: {
    initialTime?: number
    autostart?: boolean
    onPause?: (currentTime: number) => void
    onStart?: (currentTime: number) => void
    onReset?: (currentTime: number) => void
    onUpdate?: (currentTime: number) => void
  }) => {
  const timerRef = useRef<number | null>(null)

  const convertedInitialTime = convertTimeToMs(initialTime, 'sec')

  const [currentTime, setCurrentTime] = useState(convertedInitialTime)
  const [isRunning, setIsRunning] = useState(!!autostart)
  const [justRendered, setJustRendered] = useState(true)

  const stopTimer = () => {
    if (!timerRef.current) return

    setIsRunning(false)

    clearInterval(timerRef.current)
    timerRef.current = null
  }

  useEffect(() => {
    autostart && start()
  }, [])

  useEffect(() => {
    if (justRendered) return setJustRendered(false)

    onUpdate && onUpdate(convertMsToSec(currentTime))
  }, [currentTime])

  const start = () => {
    if (timerRef.current) return

    onStart && onStart(convertMsToSec(currentTime))

    setIsRunning(true)

    timerRef.current = setInterval(() => {
      setCurrentTime(prev => prev + 1000)
    }, 1000)

  }

  const reset = (resetSettings?: IUpdateTimeSettings) => {
    const { startIfWasStopped, continueIfWasRunning } = resetSettings || {}

    onReset && onReset(convertMsToSec(convertedInitialTime))

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
    onPause && onPause(convertMsToSec(currentTime))
  }

  return {
    start,
    pause,
    reset,
    isRunning,
    currentTime: convertMsToSec(currentTime),
  }
}

type TTimerInitialTime = number | string | Date

const useTimer = (
  initialTime: TTimerInitialTime,
  {
    autostart,
    speedUpFirstSecond,
    onPause,
    onStart,
    onReset,
    onUpdate,
    onTimeSet,
    onEnd,
    timeUnit = 'sec',
  }: {
    autostart?: boolean
    speedUpFirstSecond?: boolean,
    onPause?: (currentTime: number) => void
    onStart?: (currentTime: number) => void
    onReset?: (currentTime: number) => void
    onTimeSet?: (currentTime: number) => void
    onUpdate?: (currentTime: number) => void
    onEnd?: () => void
    timeUnit?: Exclude<TTimeUnit, 'ms'>
  }) => {
  const timerRef = useRef<number | null>(null)
  const firstTickRef = useRef<number | null>(null)

  const [convertedInitialTimeInMs, setConvertedInitialTimeInMs] = useState(convertTimeToMs(initialTime, timeUnit))

  const [currentTime, setCurrentTime] = useState(convertedInitialTimeInMs)
  const [isRunning, setIsRunning] = useState(!!autostart)
  const [justRendered, setJustRendered] = useState(true)

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
    if (justRendered) return setJustRendered(false)

    if (currentTime === 0) {
      onEnd && onEnd()
      stopTimer()
    }

    onUpdate && onUpdate(convertMsToSec(currentTime))
  }, [currentTime])

  const start = (startSettings?: { withTime: number }) => {
    const { withTime } = startSettings || {}

    if (timerRef.current || firstTickRef.current || (!withTime && currentTime === 0)) return

    onStart && onStart(convertMsToSec(currentTime))

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

  const updateTime = ({ updatedTime, continueIfWasRunning, startIfWasStopped }: { updatedTime: number } & IUpdateTimeSettings) => {
    if (continueIfWasRunning && isRunning) {
      setCurrentTime(updatedTime)
    } else if (startIfWasStopped && !isRunning) {
      start({ withTime: updatedTime })
    } else {
      stopTimer()
      setCurrentTime(updatedTime)
    }
  }

  const setTime = (newTime: TTimerInitialTime, setTimeSettings?: IUpdateTimeSettings & { timeUnit?: TTimeUnit }) => {
    const { timeUnit = 'sec', continueIfWasRunning, startIfWasStopped } = setTimeSettings || {}

    const updatedTime = convertTimeToMs(newTime, timeUnit)

    onTimeSet && onTimeSet(convertMsToSec(updatedTime))

    setConvertedInitialTimeInMs(updatedTime)

    updateTime({ updatedTime, continueIfWasRunning, startIfWasStopped })
  }

  const incTimeBy = (timeAmount: TTimerInitialTime, setTimeSettings?: IUpdateTimeSettings & { timeUnit?: TTimeUnit }) => {
    const { timeUnit = 'sec', continueIfWasRunning, startIfWasStopped } = setTimeSettings || {}

    const updatedTime = currentTime + convertTimeToMs(timeAmount, timeUnit)

    console.log(updatedTime)

    setConvertedInitialTimeInMs(updatedTime)

    updateTime({ updatedTime, continueIfWasRunning, startIfWasStopped })
  }

  const decTimeBy = (timeAmount: TTimerInitialTime, setTimeSettings?: IUpdateTimeSettings & { timeUnit?: TTimeUnit }) => {
    const { timeUnit = 'sec', continueIfWasRunning, startIfWasStopped } = setTimeSettings || {}

    let updatedTime = currentTime - convertTimeToMs(timeAmount, timeUnit)

    if (updatedTime < 0) {
      updatedTime = 0
    }

    setConvertedInitialTimeInMs(updatedTime)

    updateTime({ updatedTime, continueIfWasRunning, startIfWasStopped })
  }

  const reset = (resetSettings?: IUpdateTimeSettings) => {
    const { startIfWasStopped, continueIfWasRunning } = resetSettings || {}

    onReset && onReset(convertMsToSec(convertedInitialTimeInMs))

    updateTime({ updatedTime: convertedInitialTimeInMs, continueIfWasRunning, startIfWasStopped })
  }

  const pause = () => {
    if (!firstTickRef.current) return

    stopTimer()
    onPause && onPause(convertMsToSec(currentTime))
  }

  return {
    start,
    pause,
    reset,
    setTime,
    incTimeBy,
    decTimeBy,
    currentTime: convertMsToSec(currentTime),
    isRunning,
    formattedCurrentTime: convertMsToTimeObj(currentTime)
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

  const convertedInitialTime = convertTimeToMs(initialTime, timeUnit)

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
  const timer = useTimer(10, {
    // autostart: true,
    speedUpFirstSecond: false,
    // timeUnit: 'min',
    onPause: (time) => console.log('pause: ' + time),
    onStart: (time) => console.log('start: ' + time),
    onReset: (time) => console.log('reset: ' + time),
    onTimeSet: (time) => console.log('time was set: ' + time),
    onUpdate: (time) => console.log(time),
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
    onUpdate: (time) => console.log(time),
  })

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
      }}>
        Reset
      </button>
      <div>isRunning: {String(timer.isRunning)}</div>
      <div>currentTime: {timer.currentTime}</div>
      <div>
        <div>Years: {timer.formattedCurrentTime.years}</div>
        <div>Days: {timer.formattedCurrentTime.days}</div>
        <div>Hours: {timer.formattedCurrentTime.hours}</div>
        <div>Minutes: {timer.formattedCurrentTime.minutes}</div>
        <div>Seconds: {timer.formattedCurrentTime.seconds}</div>
      </div>
      <button onClick={() => timer.incTimeBy(10)}>Add 10 second</button>
      <button onClick={() => timer.incTimeBy(2, {
        timeUnit: 'min',
        startIfWasStopped: false,
        continueIfWasRunning: false,
      })}>Add 2 minutes</button>
      <button onClick={() => timer.decTimeBy(5)}>Remove 5 second</button>
      <button onClick={() => timer.decTimeBy(1, {
        timeUnit: 'min',
        startIfWasStopped: false,
        continueIfWasRunning: false,
      })}>Remove 1 minute</button>
      <button onClick={() => timer.setTime(20, {
        timeUnit: 'min',
        startIfWasStopped: false,
        continueIfWasRunning: false,
      })}>
        Update time to 20 minutes
      </button>

      <button onClick={() => timer.setTime(20)}>
        Update time to 20 seconds
      </button>

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
