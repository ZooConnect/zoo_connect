import { DateTime } from "luxon";

export const isOneMonthAway = (date) => {
    const now = DateTime.local();

    const expirationDate = DateTime.fromJSDate(date);
    const diffMonths = expirationDate.diff(now, "months").months; // peut être 0.98, 1.02 etc.
    return Math.floor(diffMonths) === 1;
}
/*
// Date d'un événement
const eventDate = DateTime.fromISO("2026-01-30T20:00:00", { zone: "Europe/Paris" });

/*
// Vérifier si un créneau est libre
const concertInterval = Interval.fromDateTimes(
    DateTime.fromISO("2026-01-30T20:00:00"),
    DateTime.fromISO("2026-01-30T23:00:00")
);

const reservationInterval = Interval.fromDateTimes(
    DateTime.fromISO("2026-01-30T21:00:00"),
    DateTime.fromISO("2026-01-30T22:00:00")
);

console.log(concertInterval.overlaps(reservationInterval)); // true*/