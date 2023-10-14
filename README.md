![react-hook-time](https://github.com/dancheskus/react-hook-time/assets/35524994/ec15bc66-8213-4f80-9b74-c30ac41f3673)


`react-hook-time` is a library for React that allows you to create timers and stopwatches in your applications. It supports TypeScript and provides a simple and clear API, making it easy to customize according to your needs. You can set initial time, choose time units, configure callbacks, and much more.

[Demo](https://gg66l2.csb.app/)

### Install

    npm install react-hook-time

### Quickstart

```jsx
import { useTimer } from 'react-hook-time'

function App() {
  const { currentTime, start, pause } = useTimer(10)

  return (
    <div>
      <div>Current time {currentTime}</div>
      <button onClick={start}>start</button>
      <button onClick={pause}>pause</button>
    </div>
  )
}
```

### API
There are 3 options to pass arguments to `useTimer()`. You can pass initialTime, initialTime and settings object or just settings object
```js
const timer = useTimer(10)
const timerWithoutUpdates = useTimer(15, { preventUpdate: true })
const stopwatch = useTimer({ stopwatch: true })
```

#### Props
**name** | **description**  | **type** | **default value**
--|--|--|--
autostart | enables autostart on component mount | boolean | false
preventUpdate* | disables component re-render on every tick | boolean | false
stopwatch* | enables stopwatch with time going up | boolean | false
speedUpFirstSecond | first tick will happen faster after timer starts. Visual thing similar to iOS timers | boolean | false

![speedUpFirstSecond](https://github.com/dancheskus/react-hook-time/assets/35524994/2516aaec-9268-40db-92d7-aeb34ca62dbc)


**preventUpdate** - with this prop most of the callbacks are not working. Only `onStart`, `onEnd` and `onCancel` are available

**stopwatch** - with this prop `onEnd` callback is disabled

#### Methods
> `const timer = useTimer(10)`

`timer` returns some values and functions
**name** | **description**  | **type**
--|--|--
currentTime | current time | number
formattedCurrentTime | you can get `years, days, hours, minutes, seconds` from this object | object
isRunning | current timer state | boolean
start | start timer | () => void
pause | pause timer | () => void
reset | reset time to initial value | () => void
setTime | set new time value | (timeAmount, **timeSettings**) => void
decTimeBy | decrease time | (timeAmount, **timeSettings**) => void
incTimeBy | increase time | (timeAmount, **timeSettings**) => void

#### *timeSettings*
**name** | **description**  | **type** | **default value**
--|--|--|--
timeUnit | specifying the time unit to perform a function |  'ms'  \|  'sec'  \|  'min'  \|  'hour'  \|  'day' | 'sec'

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
