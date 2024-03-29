import { act, fireEvent, render, screen } from '@testing-library/react'
import { useEffect, useRef, useState } from 'react'

import { TTimeObject } from 'useTimer/types'

import useTimer from './useTimer/useTimer'

const runTicks = (times: number) => [...Array(times).keys()].forEach(() => act(() => vi.advanceTimersByTime(1000)))

vi.useFakeTimers()

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Standart timer', () => {
  const onStart = vi.fn()
  const onPause = vi.fn()
  const onReset = vi.fn()
  const onUpdate = vi.fn()
  const onTimeSet = vi.fn()
  const onTimeInc = vi.fn()
  const onTimeDec = vi.fn()
  const onStepSet = vi.fn()
  const onEnd = vi.fn()

  const StandartTimerComponent = ({ autostart }: { autostart?: boolean }) => {
    const renderCountRef = useRef(0)
    renderCountRef.current++

    const timer = useTimer(10, {
      autostart,
      onStart,
      onPause,
      onReset,
      onUpdate,
      onTimeSet,
      onEnd,
      onTimeInc,
      onTimeDec,
      onStepSet,
    })

    return (
      <>
        <button data-testid='start' onClick={timer.start} />
        <button data-testid='pause' onClick={timer.pause} />
        <button data-testid='reset' onClick={timer.reset} />
        <button data-testid='decrease' onClick={() => timer.decTime(5)} />
        <button data-testid='increase' onClick={() => timer.incTime(5)} />
        <button data-testid='set-time' onClick={() => timer.setTime(20)} />
        <button data-testid='set-time-min' onClick={() => timer.setTime(1, { timeUnit: 'min' })} />
        <button data-testid='set-step' onClick={() => timer.setStep(500)} />
        <div data-testid='current-time'>{timer.currentTime}</div>
        <div data-testid='running-state'>{String(timer.isRunning)}</div>
        <div data-testid='render-count'>{renderCountRef.current}</div>
      </>
    )
  }

  it('should start timer', () => {
    render(<StandartTimerComponent />)
    fireEvent.click(screen.getByTestId('start'))
    runTicks(5)
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
  })

  it('should pause timer', () => {
    render(<StandartTimerComponent autostart />)
    runTicks(5)
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
    fireEvent.click(screen.getByTestId('pause'))
    runTicks(5)
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
  })

  it('should reset timer', () => {
    render(<StandartTimerComponent autostart />)
    runTicks(5)
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
    fireEvent.click(screen.getByTestId('reset'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('10')
  })

  it('should decrease time when timer is stopped', () => {
    render(<StandartTimerComponent />)
    fireEvent.click(screen.getByTestId('decrease'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
  })

  it('should decrease time when timer is running', () => {
    render(<StandartTimerComponent autostart />)
    runTicks(2)
    fireEvent.click(screen.getByTestId('decrease'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('3')
  })

  it('should increase time when timer is stopped', () => {
    render(<StandartTimerComponent />)
    fireEvent.click(screen.getByTestId('increase'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('15')
  })

  it('should increase time when timer is running', () => {
    render(<StandartTimerComponent autostart />)
    runTicks(5)
    fireEvent.click(screen.getByTestId('increase'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('10')
  })

  it('should set time when timer is stopped', () => {
    render(<StandartTimerComponent />)
    fireEvent.click(screen.getByTestId('set-time'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('20')
  })

  it('should set time when timer is running', () => {
    render(<StandartTimerComponent autostart />)
    runTicks(5)
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
    fireEvent.click(screen.getByTestId('set-time'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('20')
  })

  it('should set time in minutes', () => {
    render(<StandartTimerComponent />)
    fireEvent.click(screen.getByTestId('set-time-min'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('60')
  })

  it('should set step', () => {
    render(<StandartTimerComponent />)
    fireEvent.click(screen.getByTestId('set-step'))
    fireEvent.click(screen.getByTestId('start'))
    runTicks(4)
    // this timer should run twice faster
    expect(screen.getByTestId('current-time')).toHaveTextContent('2')
  })

  it('should run timer automatically if autostart is true', () => {
    render(<StandartTimerComponent autostart />)
    runTicks(5)
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
  })

  it('should render correct running state', () => {
    render(<StandartTimerComponent />)
    expect(screen.getByTestId('running-state')).toHaveTextContent('false')
    fireEvent.click(screen.getByTestId('start'))
    expect(screen.getByTestId('running-state')).toHaveTextContent('true')
    fireEvent.click(screen.getByTestId('pause'))
    expect(screen.getByTestId('running-state')).toHaveTextContent('false')
  })

  it('should stop timer when time is over', () => {
    render(<StandartTimerComponent autostart />)
    runTicks(20)
    expect(screen.getByTestId('current-time')).toHaveTextContent('0')
    expect(screen.getByTestId('running-state')).toHaveTextContent('false')
    fireEvent.click(screen.getByTestId('start'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('0')
    expect(screen.getByTestId('running-state')).toHaveTextContent('false')
  })

  it('should rerender 5 times', () => {
    render(<StandartTimerComponent autostart />)
    runTicks(5)
    expect(screen.getByTestId('render-count')).toHaveTextContent('6')
  })

  it('should start timer without any settings', () => {
    const Test = () => {
      const timer = useTimer()

      return (
        <>
          <button data-testid='execute' onClick={() => timer.setTime(10).start()} />
          <div data-testid='current-time'>{timer.currentTime}</div>
        </>
      )
    }

    render(<Test />)
    fireEvent.click(screen.getByTestId('execute'))
    runTicks(5)
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
  })

  it('should call callbacks correctly', () => {
    render(<StandartTimerComponent />)
    fireEvent.click(screen.getByTestId('start'))
    expect(onStart).toBeCalledTimes(1)
    fireEvent.click(screen.getByTestId('pause'))
    expect(onPause).toBeCalledTimes(1)
    fireEvent.click(screen.getByTestId('reset'))
    expect(onReset).toBeCalledTimes(1)
    fireEvent.click(screen.getByTestId('decrease'))
    expect(onUpdate).toBeCalledTimes(1)
    expect(onTimeDec).toBeCalledTimes(1)
    fireEvent.click(screen.getByTestId('increase'))
    expect(onUpdate).toBeCalledTimes(2)
    expect(onTimeInc).toBeCalledTimes(1)
    fireEvent.click(screen.getByTestId('set-time'))
    expect(onTimeSet).toBeCalledTimes(1)
    fireEvent.click(screen.getByTestId('set-step'))
    expect(onUpdate).toBeCalledTimes(3)
    expect(onStepSet).toBeCalledTimes(1)
    fireEvent.click(screen.getByTestId('start'))
    runTicks(10)
    expect(onEnd).toBeCalledTimes(1)
  })

  it('should not run onStart callback if autostart is false', () => {
    render(<StandartTimerComponent />)
    expect(onStart).toBeCalledTimes(0)
    fireEvent.click(screen.getByTestId('start'))
    expect(onStart).toBeCalledTimes(1)
  })
})

describe('Timer without update', () => {
  const onStart = vi.fn()
  const onCancel = vi.fn()
  const onEnd = vi.fn()

  const TimerWithoutUpdateComponent = ({ autostart, initialTime }: { autostart?: boolean; initialTime?: number }) => {
    const [currentTime, setCurrentTime] = useState<number>()
    const renderCountRef = useRef(0)
    renderCountRef.current++

    const timer = useTimer(initialTime || 10, {
      autostart,
      stopUpdate: true,
      onStart,
      onEnd,
      onCancel,
    })

    return (
      <>
        <button data-testid='start' onClick={timer.start} />
        <button data-testid='cancel' onClick={timer.cancel} />
        <button data-testid='reset' onClick={timer.reset} />
        <button data-testid='decrease' onClick={() => timer.decTime(5)} />
        <button data-testid='increase' onClick={() => timer.incTime(5)} />
        <button data-testid='set-time' onClick={() => timer.setTime(20)} />
        <button data-testid='get-current-time' onClick={() => setCurrentTime(timer.getCurrentTime())} />
        <div data-testid='current-time'>{currentTime}</div>
        <div data-testid='running-state'>{String(timer.isRunning)}</div>
        <div data-testid='render-count'>{renderCountRef.current}</div>
      </>
    )
  }

  it('should start timer. Should stop it when time is over', () => {
    render(<TimerWithoutUpdateComponent />)
    fireEvent.click(screen.getByTestId('start'))
    runTicks(5)
    expect(screen.getByTestId('running-state')).toHaveTextContent('true')
    runTicks(5)
    expect(screen.getByTestId('running-state')).toHaveTextContent('false')
  })

  it('should stop timer when cancel method is called', () => {
    render(<TimerWithoutUpdateComponent autostart />)
    runTicks(5)
    expect(screen.getByTestId('running-state')).toHaveTextContent('true')
    fireEvent.click(screen.getByTestId('cancel'))
    expect(screen.getByTestId('running-state')).toHaveTextContent('false')
  })

  it('should reset timer', () => {
    render(<TimerWithoutUpdateComponent autostart />)
    runTicks(5)
    fireEvent.click(screen.getByTestId('reset'))
    expect(screen.getByTestId('render-count')).toHaveTextContent('1')
    runTicks(5)
    expect(screen.getByTestId('render-count')).toHaveTextContent('1')
    runTicks(5)
    expect(screen.getByTestId('render-count')).toHaveTextContent('2')
  })

  it('should decrease time', () => {
    render(<TimerWithoutUpdateComponent initialTime={15} autostart />)
    runTicks(5)
    fireEvent.click(screen.getByTestId('decrease'))
    expect(screen.getByTestId('render-count')).toHaveTextContent('1')
    runTicks(5)
    expect(screen.getByTestId('render-count')).toHaveTextContent('2')
  })

  it('should increase time', () => {
    render(<TimerWithoutUpdateComponent autostart />)
    runTicks(5)
    fireEvent.click(screen.getByTestId('increase'))
    expect(screen.getByTestId('render-count')).toHaveTextContent('1')
    runTicks(10)
    expect(screen.getByTestId('render-count')).toHaveTextContent('2')
  })

  it('should set time', () => {
    render(<TimerWithoutUpdateComponent autostart />)
    runTicks(5)
    fireEvent.click(screen.getByTestId('set-time'))
    expect(screen.getByTestId('render-count')).toHaveTextContent('1')
    runTicks(19)
    expect(screen.getByTestId('render-count')).toHaveTextContent('1')
    runTicks(20)
    expect(screen.getByTestId('render-count')).toHaveTextContent('2')
  })

  it('should rerender 2 times', () => {
    render(<TimerWithoutUpdateComponent autostart />)
    runTicks(10)
    expect(screen.getByTestId('render-count')).toHaveTextContent('2')
  })

  it('should call callbacks correctly', () => {
    render(<TimerWithoutUpdateComponent />)
    fireEvent.click(screen.getByTestId('start'))
    expect(onStart).toBeCalledTimes(1)
    fireEvent.click(screen.getByTestId('cancel'))
    expect(onCancel).toBeCalledTimes(1)
    fireEvent.click(screen.getByTestId('start'))
    runTicks(10)
    expect(onEnd).toBeCalledTimes(1)
  })

  it('should get current time and update state', () => {
    render(<TimerWithoutUpdateComponent initialTime={15} autostart />)
    runTicks(5)
    fireEvent.click(screen.getByTestId('get-current-time'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('10000')
  })
})

describe('Stopwatch', () => {
  const onStart = vi.fn()
  const onPause = vi.fn()
  const onReset = vi.fn()
  const onUpdate = vi.fn()
  const onTimeSet = vi.fn()
  const onTimeInc = vi.fn()
  const onTimeDec = vi.fn()

  const StopwatchComponent = ({ autostart, initialTime }: { autostart?: boolean; initialTime?: number }) => {
    const renderCountRef = useRef(0)
    renderCountRef.current++

    const timer = useTimer(initialTime || 0, {
      autostart,
      stopwatch: true,
      onStart,
      onPause,
      onReset,
      onUpdate,
      onTimeSet,
      onTimeInc,
      onTimeDec,
    })

    return (
      <>
        <button data-testid='start' onClick={timer.start} />
        <button data-testid='pause' onClick={timer.pause} />
        <button data-testid='reset' onClick={timer.reset} />
        <button data-testid='decrease' onClick={() => timer.decTime(5)} />
        <button data-testid='increase' onClick={() => timer.incTime(5)} />
        <button data-testid='set-time' onClick={() => timer.setTime(20)} />
        <button data-testid='set-time-min' onClick={() => timer.setTime(1, { timeUnit: 'min' })} />
        <button data-testid='set-step' onClick={() => timer.setStep(500)} />
        <div data-testid='current-time'>{timer.currentTime}</div>
        <div data-testid='running-state'>{String(timer.isRunning)}</div>
        <div data-testid='render-count'>{renderCountRef.current}</div>
      </>
    )
  }

  it('should start timer', () => {
    render(<StopwatchComponent />)
    fireEvent.click(screen.getByTestId('start'))
    runTicks(5)
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
  })

  it('should pause timer', () => {
    render(<StopwatchComponent autostart />)
    runTicks(5)
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
    fireEvent.click(screen.getByTestId('pause'))
    runTicks(5)
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
  })

  it('should reset timer', () => {
    render(<StopwatchComponent autostart />)
    runTicks(5)
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
    fireEvent.click(screen.getByTestId('reset'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('0')
  })

  it('should decrease time when timer is stopped', () => {
    render(<StopwatchComponent initialTime={10} />)
    fireEvent.click(screen.getByTestId('decrease'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
  })

  it('should decrease time when timer is running', () => {
    render(<StopwatchComponent autostart />)
    runTicks(10)
    fireEvent.click(screen.getByTestId('decrease'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
  })

  it('should increase time when timer is stopped', () => {
    render(<StopwatchComponent />)
    fireEvent.click(screen.getByTestId('increase'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
  })

  it('should increase time when timer is running', () => {
    render(<StopwatchComponent autostart />)
    runTicks(5)
    fireEvent.click(screen.getByTestId('increase'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('10')
  })

  it('should set time when timer is stopped', () => {
    render(<StopwatchComponent />)
    fireEvent.click(screen.getByTestId('set-time'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('20')
  })

  it('should set time when timer is running', () => {
    render(<StopwatchComponent autostart />)
    runTicks(5)
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
    fireEvent.click(screen.getByTestId('set-time'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('20')
  })

  it('should set time in minutes', () => {
    render(<StopwatchComponent />)
    fireEvent.click(screen.getByTestId('set-time-min'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('60')
  })

  it('should set step', () => {
    render(<StopwatchComponent />)
    fireEvent.click(screen.getByTestId('set-step'))
    fireEvent.click(screen.getByTestId('start'))
    runTicks(4)
    // this timer should run twice faster
    expect(screen.getByTestId('current-time')).toHaveTextContent('8')
  })

  it('should run timer automatically if autostart is true', () => {
    render(<StopwatchComponent autostart />)
    runTicks(5)
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
  })

  it('should render correct running state', () => {
    render(<StopwatchComponent />)
    expect(screen.getByTestId('running-state')).toHaveTextContent('false')
    fireEvent.click(screen.getByTestId('start'))
    expect(screen.getByTestId('running-state')).toHaveTextContent('true')
    fireEvent.click(screen.getByTestId('pause'))
    expect(screen.getByTestId('running-state')).toHaveTextContent('false')
  })

  it('should rerender 2 times', () => {
    render(<StopwatchComponent autostart />)
    runTicks(5)
    expect(screen.getByTestId('render-count')).toHaveTextContent('6')
  })

  it('should call callbacks correctly', () => {
    render(<StopwatchComponent initialTime={10} />)
    fireEvent.click(screen.getByTestId('start'))
    expect(onStart).toBeCalledTimes(1)
    fireEvent.click(screen.getByTestId('pause'))
    expect(onPause).toBeCalledTimes(1)
    fireEvent.click(screen.getByTestId('reset'))
    expect(onReset).toBeCalledTimes(1)
    fireEvent.click(screen.getByTestId('decrease'))
    expect(onTimeDec).toBeCalledTimes(1)
    expect(onUpdate).toBeCalledTimes(1)
    fireEvent.click(screen.getByTestId('increase'))
    expect(onTimeInc).toBeCalledTimes(1)
    expect(onUpdate).toBeCalledTimes(2)
    fireEvent.click(screen.getByTestId('set-time'))
    expect(onTimeSet).toBeCalledTimes(1)
  })
})

describe('chaining functions', () => {
  const ChainingFunctionsComponent = () => {
    const timer = useTimer(10)

    useEffect(() => {
      timer
        .start()
        .pause()
        .reset()
        .decTime(1)
        .incTime(1)
        .setTime(20)
        .setStep(500)
        .start()
        .pause()
        .reset()
        .decTime(1)
        .incTime(1)
        .setTime(20)
        .setStep(500)
    }, [])

    return null
  }

  it('should test chaining functions', () => {
    render(<ChainingFunctionsComponent />)
  })

  const ChainingFunctionsStopwatchComponent = () => {
    const timer = useTimer(10, { stopwatch: true })

    useEffect(() => {
      timer
        .start()
        .pause()
        .reset()
        .decTime(1)
        .incTime(1)
        .setTime(20)
        .setStep(500)
        .start()
        .pause()
        .reset()
        .decTime(1)
        .incTime(1)
        .setTime(20)
        .setStep(500)
    }, [])

    return null
  }

  it('should test chaining functions', () => {
    render(<ChainingFunctionsStopwatchComponent />)
  })

  const ChainingFunctionsWithoutUpdateComponent = () => {
    const timer = useTimer(10, { stopUpdate: true })

    useEffect(() => {
      timer
        .start()
        .cancel()
        .reset()
        .decTime(1)
        .incTime(1)
        .setTime(20)
        .start()
        .cancel()
        .reset()
        .decTime(1)
        .incTime(1)
        .setTime(20)
    }, [])

    return null
  }

  it('should test chaining functions', () => {
    render(<ChainingFunctionsWithoutUpdateComponent />)
  })
})

describe('formatted time', () => {
  it('should return formatted time in standart timer', () => {
    const StandartTimer = () => {
      const timer = useTimer(31719845)

      return (
        <>
          <div data-testid='years'>{timer.formattedCurrentTime.years}</div>
          <div data-testid='days'>{timer.formattedCurrentTime.days}</div>
          <div data-testid='hours'>{timer.formattedCurrentTime.hours}</div>
          <div data-testid='minutes'>{timer.formattedCurrentTime.minutes}</div>
          <div data-testid='seconds'>{timer.formattedCurrentTime.seconds}</div>
          <button data-testid='increase' onClick={() => timer.incTime(1, { timeUnit: 'day' })} />
        </>
      )
    }

    render(<StandartTimer />)
    expect(screen.getByTestId('years')).toHaveTextContent('1')
    expect(screen.getByTestId('days')).toHaveTextContent('2')
    expect(screen.getByTestId('hours')).toHaveTextContent('3')
    expect(screen.getByTestId('minutes')).toHaveTextContent('4')
    expect(screen.getByTestId('seconds')).toHaveTextContent('5')

    fireEvent.click(screen.getByTestId('increase'))

    expect(screen.getByTestId('days')).toHaveTextContent('3')
  })

  it('should return formatted time in timer without update', () => {
    const TimerWithoutUpdate = () => {
      const [formattedCurrentTime, setFormattedCurrentTime] = useState<TTimeObject>()
      const timer = useTimer(31719845, { stopUpdate: true, autostart: true })

      return (
        <>
          <div data-testid='years'>{formattedCurrentTime?.years}</div>
          <div data-testid='days'>{formattedCurrentTime?.days}</div>
          <div data-testid='hours'>{formattedCurrentTime?.hours}</div>
          <div data-testid='minutes'>{formattedCurrentTime?.minutes}</div>
          <div data-testid='seconds'>{formattedCurrentTime?.seconds}</div>
          <button data-testid='increase' onClick={() => timer.incTime(1, { timeUnit: 'day' })} />
          <button
            data-testid='get-current-time'
            onClick={() => setFormattedCurrentTime(timer.getFormattedCurrentTime())}
          />
        </>
      )
    }

    render(<TimerWithoutUpdate />)
    fireEvent.click(screen.getByTestId('get-current-time'))
    expect(screen.getByTestId('years')).toHaveTextContent('1')
    expect(screen.getByTestId('days')).toHaveTextContent('2')
    expect(screen.getByTestId('hours')).toHaveTextContent('3')
    expect(screen.getByTestId('minutes')).toHaveTextContent('4')
    expect(screen.getByTestId('seconds')).toHaveTextContent('5')

    fireEvent.click(screen.getByTestId('increase'))
    expect(screen.getByTestId('days')).toHaveTextContent('2')
    fireEvent.click(screen.getByTestId('get-current-time'))
    expect(screen.getByTestId('days')).toHaveTextContent('3')
  })
})
