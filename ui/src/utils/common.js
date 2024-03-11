import { format, utcToZonedTime } from 'date-fns-tz';

export function formatDate(value) {
    if (value) {
        const dateInUtc = new Date(value);
        const dateInNewYork = utcToZonedTime(dateInUtc, 'America/New_York');
        return format(dateInNewYork, 'yyyy-MM-dd');
    }
    return null;
}
