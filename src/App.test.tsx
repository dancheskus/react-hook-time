import { act, fireEvent, render, screen } from '@testing-library/react'
import { useEffect, useRef } from 'react'

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
  const onEnd = vi.fn()

  const StandartTimerComponent = ({ autostart }: { autostart?: boolean }) => {
    const renderCountRef = useRef(0)
    renderCountRef.current++

    const timer = useTimer(10, { autostart, onStart, onPause, onReset, onUpdate, onTimeSet, onEnd })

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
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
  })

  it('should pause timer', () => {
    render(<StandartTimerComponent />)
    fireEvent.click(screen.getByTestId('start'))
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
    fireEvent.click(screen.getByTestId('pause'))
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
  })

  it('should reset timer', () => {
    render(<StandartTimerComponent />)
    fireEvent.click(screen.getByTestId('start'))
    act(() => {
      vi.advanceTimersByTime(5000)
    })
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
    render(<StandartTimerComponent />)
    fireEvent.click(screen.getByTestId('start'))
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    fireEvent.click(screen.getByTestId('decrease'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('3')
  })

  it('should increase time when timer is stopped', () => {
    render(<StandartTimerComponent />)
    fireEvent.click(screen.getByTestId('increase'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('15')
  })

  it('should increase time when timer is running', () => {
    render(<StandartTimerComponent />)
    fireEvent.click(screen.getByTestId('start'))
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    fireEvent.click(screen.getByTestId('increase'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('10')
  })

  it('should set time when timer is stopped', () => {
    render(<StandartTimerComponent />)
    fireEvent.click(screen.getByTestId('set-time'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('20')
  })

  it('should set time when timer is running', () => {
    render(<StandartTimerComponent />)
    fireEvent.click(screen.getByTestId('start'))
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
    fireEvent.click(screen.getByTestId('set-time'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('20')
  })

  it('should set time in minutes when timer', () => {
    render(<StandartTimerComponent />)
    fireEvent.click(screen.getByTestId('set-time-min'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('60')
  })

  it('should set step', () => {
    render(<StandartTimerComponent />)
    fireEvent.click(screen.getByTestId('set-step'))
    fireEvent.click(screen.getByTestId('start'))
    act(() => {
      vi.advanceTimersByTime(4000)
    })
    // this timer should run twice faster
    expect(screen.getByTestId('current-time')).toHaveTextContent('2')
  })

  it('should run timer automatically if autostart is true', () => {
    render(<StandartTimerComponent autostart />)
    act(() => {
      vi.advanceTimersByTime(5000)
    })
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
    render(<StandartTimerComponent />)
    fireEvent.click(screen.getByTestId('start'))
    act(() => {
      vi.advanceTimersByTime(20000)
    })
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
    fireEvent.click(screen.getByTestId('increase'))
    expect(onUpdate).toBeCalledTimes(2)
    fireEvent.click(screen.getByTestId('set-time'))
    expect(onTimeSet).toBeCalledTimes(1)
    fireEvent.click(screen.getByTestId('set-step'))
    expect(onUpdate).toBeCalledTimes(3)
    fireEvent.click(screen.getByTestId('start'))
    act(() => {
      vi.advanceTimersByTime(10000)
    })
    expect(onEnd).toBeCalledTimes(1)
  })
})

describe('Timer without update', () => {
  const onStart = vi.fn()
  const onCancel = vi.fn()
  const onEnd = vi.fn()

  const TimerWithoutUpdateComponent = ({ autostart }: { autostart?: boolean }) => {
    const renderCountRef = useRef(0)
    renderCountRef.current++

    const timer = useTimer(10, { autostart, stopUpdate: true, onStart, onEnd, onCancel })

    return (
      <>
        <button data-testid='start' onClick={timer.start} />
        <button data-testid='cancel' onClick={timer.cancel} />
        <div data-testid='running-state'>{String(timer.isRunning)}</div>
        <div data-testid='render-count'>{renderCountRef.current}</div>
      </>
    )
  }

  it('should start timer. Should stop it when time is over', () => {
    render(<TimerWithoutUpdateComponent />)
    fireEvent.click(screen.getByTestId('start'))
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByTestId('running-state')).toHaveTextContent('true')
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByTestId('running-state')).toHaveTextContent('false')
  })

  it('should stop timer when cancel method is called', () => {
    render(<TimerWithoutUpdateComponent />)
    fireEvent.click(screen.getByTestId('start'))
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByTestId('running-state')).toHaveTextContent('true')
    fireEvent.click(screen.getByTestId('cancel'))
    expect(screen.getByTestId('running-state')).toHaveTextContent('false')
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
    act(() => {
      vi.advanceTimersByTime(10000)
    })
    expect(onEnd).toBeCalledTimes(1)
  })
})

describe('Stopwatch', () => {
  const onStart = vi.fn()
  const onPause = vi.fn()
  const onReset = vi.fn()
  const onUpdate = vi.fn()
  const onTimeSet = vi.fn()

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
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
  })

  it('should pause timer', () => {
    render(<StopwatchComponent />)
    fireEvent.click(screen.getByTestId('start'))
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
    fireEvent.click(screen.getByTestId('pause'))
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
  })

  it('should reset timer', () => {
    render(<StopwatchComponent />)
    fireEvent.click(screen.getByTestId('start'))
    act(() => {
      vi.advanceTimersByTime(5000)
    })
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
    render(<StopwatchComponent />)
    fireEvent.click(screen.getByTestId('start'))
    act(() => {
      vi.advanceTimersByTime(10000)
    })
    fireEvent.click(screen.getByTestId('decrease'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
  })

  it('should increase time when timer is stopped', () => {
    render(<StopwatchComponent />)
    fireEvent.click(screen.getByTestId('increase'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
  })

  it('should increase time when timer is running', () => {
    render(<StopwatchComponent />)
    fireEvent.click(screen.getByTestId('start'))
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    fireEvent.click(screen.getByTestId('increase'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('10')
  })

  it('should set time when timer is stopped', () => {
    render(<StopwatchComponent />)
    fireEvent.click(screen.getByTestId('set-time'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('20')
  })

  it('should set time when timer is running', () => {
    render(<StopwatchComponent />)
    fireEvent.click(screen.getByTestId('start'))
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByTestId('current-time')).toHaveTextContent('5')
    fireEvent.click(screen.getByTestId('set-time'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('20')
  })

  it('should set time in minutes when timer', () => {
    render(<StopwatchComponent />)
    fireEvent.click(screen.getByTestId('set-time-min'))
    expect(screen.getByTestId('current-time')).toHaveTextContent('60')
  })

  it('should set step', () => {
    render(<StopwatchComponent />)
    fireEvent.click(screen.getByTestId('set-step'))
    fireEvent.click(screen.getByTestId('start'))
    act(() => {
      vi.advanceTimersByTime(4000)
    })
    // this timer should run twice faster
    expect(screen.getByTestId('current-time')).toHaveTextContent('8')
  })

  it('should run timer automatically if autostart is true', () => {
    render(<StopwatchComponent autostart />)
    act(() => {
      vi.advanceTimersByTime(5000)
    })
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
    expect(onUpdate).toBeCalledTimes(1)
    fireEvent.click(screen.getByTestId('increase'))
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
})
