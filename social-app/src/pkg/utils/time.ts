export type TimeUnit = 'seconds' | 'second' | 'minutes' | 'minute' | 'hours' | 'hour' | 'days' | 'day';

export function toMs(value: number, unit: TimeUnit): number {
  switch (unit) {
    case 'seconds':
    case 'second':
      return value * 1000;
    case 'minutes':
    case 'minute':
      return value * 60 * 1000;
    case 'hours':
    case 'hour':
      return value * 60 * 60 * 1000;
    case 'days':
    case 'day':
      return value * 24 * 60 * 60 * 1000;
    default:
      return value;
  }
}

export function toSeconds(value: number, unit: TimeUnit): number {
  return Math.floor(toMs(value, unit) / 1000);
}
