
![react-hook-time](https://github.com/dancheskus/react-hook-time/assets/35524994/5d76edad-11dc-403c-8fcb-607d2693168f)

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
