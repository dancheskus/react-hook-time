import { useStatelessTimer, useStopwatch, useTimer } from './ReactTimer'

export default function App() {
  const timer = useTimer(10, {
    // autostart: true,
    // speedUpFirstSecond: true,
    // timeUnit: 'min',
    // stepInMs: 2000,
    onPause: time => console.log('pause: ' + time),
    onStart: time => console.log('start: ' + time),
    onReset: time => console.log('reset: ' + time),
    onTimeSet: time => console.log('time was set: ' + time),
    onUpdate: time => console.log(time),
    onEnd: () => console.log('end'),
  })

  const statelessTimer = useStatelessTimer(3, {
    // autostart: true,
    // timeUnit: 'min',
    onStart: () => console.log('start'),
    onCancel: () => console.log('cancel'),
    onEnd: () => console.log('end'),
  })

  const stopwatch = useStopwatch({
    // autostart: true,
    // initialTime: 5,
    // stepInMs: 500,
    onPause: time => console.log('pause: ' + time),
    onStart: time => console.log('start: ' + time),
    onReset: time => console.log('reset: ' + time),
    onUpdate: time => console.log(time),
  })

  return (
    <div>
      <h1>Timer</h1>
      <button onClick={timer.start}>Start</button>
      <button onClick={timer.pause}>Pause</button>
      <button
        onClick={() => {
          timer.reset({
            startIfWasStopped: false,
            continueIfWasRunning: false,
          })
        }}
      >
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
      <button
        onClick={() =>
          timer.incTimeBy(2, {
            timeUnit: 'min',
            startIfWasStopped: false,
            continueIfWasRunning: false,
          })
        }
      >
        Add 2 minutes
      </button>
      <button onClick={() => timer.decTimeBy(5)}>Remove 5 second</button>
      <button
        onClick={() =>
          timer.decTimeBy(1, {
            timeUnit: 'min',
            startIfWasStopped: false,
            continueIfWasRunning: false,
          })
        }
      >
        Remove 1 minute
      </button>
      <button
        onClick={() =>
          timer.setTime(20, {
            timeUnit: 'min',
            startIfWasStopped: false,
            continueIfWasRunning: false,
          })
        }
      >
        Update time to 20 minutes
      </button>

      <button onClick={() => timer.setTime(20)}>Update time to 20 seconds</button>

      <h1>Stateless Timer</h1>
      <button onClick={statelessTimer.start}>Start</button>
      <button onClick={statelessTimer.cancel}>Cancel</button>
      <div>isRunning: {String(statelessTimer.isRunning)}</div>

      <h1>Stopwatch</h1>
      <button onClick={stopwatch.start}>Start</button>
      <button onClick={stopwatch.pause}>Pause</button>
      <button
        onClick={() => {
          stopwatch.reset({
            startIfWasStopped: false,
            continueIfWasRunning: false,
          })
        }}
      >
        Reset
      </button>
      <div>isRunning: {String(stopwatch.isRunning)}</div>
      <div>currentTime: {stopwatch.currentTime}</div>
      <div>
        <div>Years: {stopwatch.formattedCurrentTime.years}</div>
        <div>Days: {stopwatch.formattedCurrentTime.days}</div>
        <div>Hours: {stopwatch.formattedCurrentTime.hours}</div>
        <div>Minutes: {stopwatch.formattedCurrentTime.minutes}</div>
        <div>Seconds: {stopwatch.formattedCurrentTime.seconds}</div>
      </div>
      <button onClick={() => stopwatch.incTimeBy(10)}>Add 10 second</button>
      <button
        onClick={() =>
          stopwatch.incTimeBy(2, {
            timeUnit: 'min',
            startIfWasStopped: false,
            continueIfWasRunning: false,
          })
        }
      >
        Add 2 minutes
      </button>
      <button onClick={() => stopwatch.decTimeBy(5)}>Remove 5 second</button>
      <button
        onClick={() =>
          stopwatch.decTimeBy(1, {
            timeUnit: 'min',
            startIfWasStopped: false,
            continueIfWasRunning: true,
          })
        }
      >
        Remove 1 minute
      </button>
      <button
        onClick={() =>
          stopwatch.setTime(20, {
            timeUnit: 'min',
            startIfWasStopped: false,
            continueIfWasRunning: false,
          })
        }
      >
        Update time to 20 minutes
      </button>

      <button onClick={() => stopwatch.setTime(20)}>Update time to 20 seconds</button>
    </div>
  )
}
