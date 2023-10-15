![react-hook-time](https://github.com/dancheskus/react-hook-time/assets/35524994/ec15bc66-8213-4f80-9b74-c30ac41f3673)


`react-hook-time` is a library for React that allows you to create timers and stopwatches in your applications. It supports TypeScript and provides a simple and clear API, making it easy to customize according to your needs. You can set initial time, choose time units, configure callbacks, and much more.

[Demo](https://gg66l2.csb.app/)

### Install

    npm install react-hook-time

### Quickstart

```jsx
import { useTimer } from 'react-hook-time'

function App() {
  const { currentTime, start, pause, reset } = useTimer(10, {
    onEnd: () => console.log('Timer ended'),
  })

  return (
    <div>
      <div>Current time {currentTime}</div>
      <button onClick={start}>start</button>
      <button onClick={pause}>pause</button>
      <button onClick={() => {
        // chaining functions
        reset().pause()
      }}>
        reset
      </button>
    </div>
  )
}
```

### API
There are 3 options to pass arguments to `useTimer()`. You can pass initialTime, initialTime and settings object or just settings object
```js
const timer = useTimer(10)
const timerWithoutUpdates = useTimer(15, { preventRerender: true })
const stopwatch = useTimer({ stopwatch: true })
```

#### Props
**name** | **description**  | **type** | **default value**
--|--|--|--
autostart | enables autostart on component mount | boolean | false
stepInMs* | by default tick step is 1 second. But you can change it | number | 1000
timeUnit | indicates the default time unit in which the timer will operate | 'ms'  \|  'sec'  \|  'min'  \|  'hour'  \|  'day' | 'sec'
preventRerender* | disables component re-render on every tick | boolean | false
stopwatch* | enables stopwatch with time going up | boolean | false
speedUpFirstSecond* | first tick will happen faster after timer starts. Visual thing similar to iOS timers | boolean | false

**speedUpFirstSecond** - сompare the two sides. In both cases, the 'start' button was clicked simultaneously. However, on the right side, the timer visually starts faster.

![speedUpFirstSecond](https://github.com/dancheskus/react-hook-time/assets/35524994/40b10c46-7093-4504-b6e3-98ff4938e924)

**stepInMs**

![stepInMs](https://github.com/dancheskus/react-hook-time/assets/35524994/7181c319-bbcb-4c8c-a16d-8b5c5d8268e6)





**preventRerender** - with this prop most of the callbacks are not working. Only `onStart`, `onEnd` and `onCancel` are available

**stopwatch** - with this prop `onEnd` callback is disabled

#### Methods
> `const timer = useTimer(10)`

`timer` returns some values and functions. You can use them separately `timer.start()` or chain them if required `timer.reset().pause()`
**name** | **description**  | **type**
--|--|--
currentTime | current time | number
formattedCurrentTime | you can get `years, days, hours, minutes, seconds` from this object | object
isRunning | current timer state | boolean
start | start timer | () => void
pause | pause timer | () => void
reset | reset time to initial value | () => void
setTime | set new time value | (timeAmount, **timeSettings**) => void
subtractTime | decrease time | (timeAmount, **timeSettings**) => void
addTime | increase time | (timeAmount, **timeSettings**) => void

#### *timeSettings*
**name** | **description**  | **type** | **default value**
--|--|--|--
timeUnit | specifying the time unit to perform a function |  'ms'  \|  'sec'  \|  'min'  \|  'hour'  \|  'day' | 'sec' or timeUnit used in useTimer props

#### Callbacks
**name** | **description**  | **return value**
--|--|--
onCancel | triggers when timer was cancelled | undefined
onEnd | triggers when timer was ended | undefined
onPause | triggers when timer was paused | currentTime
onStart | triggers when timer was started | currentTime
onReset | triggers when timer was reseted | currentTime
onUpdate | triggers on every tick | currentTime
onTimeSet | triggers when timer was set | currentTime
