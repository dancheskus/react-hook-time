import { TTimeUnit } from './types'

const parseDate = (input: string | Date) => {
  const date = new Date(input)
  return isNaN(date.getTime()) ? undefined : date.getTime() - Date.now()
}

export const convertTimeToMs = (time: number | string | Date, timeUnit: TTimeUnit) => {
  const isDate = typeof time !== 'number'
  const convertedTime = isDate ? parseDate(time) : time

  if (typeof convertedTime !== 'number') return 0

  if (isDate) return convertedTime

  switch (timeUnit) {
    case 'ms':
      return convertedTime
    case 'sec':
      return convertedTime * 1000
    case 'min':
      return convertedTime * 60000
    case 'hour':
      return convertedTime * 3600000
    case 'day':
      return convertedTime * 86400000
  }
}

export const convertMsToSec = (milliseconds: number) => milliseconds / 1000

export const convertMsToTimeObj = (milliseconds: number) => {
  const totalSeconds = milliseconds / 1000
  const totalMinutes = totalSeconds / 60
  const totalHours = totalMinutes / 60
  const totalDays = totalHours / 24
  const totalYears = totalDays / 365

  const years = Math.floor(totalYears)
  const remainingDays = totalDays % 365
  const days = Math.floor(remainingDays)
  const remainingHours = (remainingDays - days) * 24
  const hours = Math.floor(remainingHours)
  const remainingMinutes = (remainingHours - hours) * 60
  const minutes = Math.floor(remainingMinutes)
  const remainingSeconds = (remainingMinutes - minutes) * 60
  const seconds = Math.round(remainingSeconds)

  return { years, days, hours, minutes, seconds }
}
