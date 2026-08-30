export interface EthiopianDate {
  year: number;
  month: number;
  day: number;
}

export function getEthiopianMonthLength(year: number, month: number): number {
  if (month >= 1 && month <= 12) return 30;
  if (month === 13) {
    // Leap year rule: Ethiopian leap year is when Year % 4 === 3
    return year % 4 === 3 ? 6 : 5;
  }
  return 30;
}

/**
 * Highly robust and mathematically exact conversion from Gregorian Date to Ethiopian Date.
 * Aligns perfectly around the solar cycle using a known reference date (Sept 11, 2024 = Meskerem 1, 2017)
 */
export function gregorianToEthiopian(gDate: Date): EthiopianDate {
  // Normalize dates to UTC midnight to avoid local timezone and daylight savings skew
  const refG = new Date(Date.UTC(2024, 8, 11)); // Sept 11, 2024
  const testG = new Date(Date.UTC(gDate.getFullYear(), gDate.getMonth(), gDate.getDate()));

  const diffMs = testG.getTime() - refG.getTime();
  let diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  let year = 2017;
  let month = 1;
  let day = 1;

  if (diffDays > 0) {
    while (diffDays > 0) {
      const mLength = getEthiopianMonthLength(year, month);
      const daysLeftInMonth = mLength - day + 1;
      if (diffDays >= daysLeftInMonth) {
        diffDays -= daysLeftInMonth;
        month += 1;
        if (month > 13) {
          month = 1;
          year += 1;
        }
        day = 1;
      } else {
        day += diffDays;
        diffDays = 0;
      }
    }
  } else if (diffDays < 0) {
    let absDiff = Math.abs(diffDays);
    while (absDiff > 0) {
      if (day > 1) {
        const sub = Math.min(absDiff, day - 1);
        day -= sub;
        absDiff -= sub;
      } else {
        month -= 1;
        if (month < 1) {
          month = 13;
          year -= 1;
        }
        day = getEthiopianMonthLength(year, month);
        absDiff -= 1; // 1 day consumed to step from day 1 of month to last day of previous month
      }
    }
  }

  return { year, month, day };
}

/**
 * Backwards conversion from Ethiopian Date to Gregorian Date.
 * Steps dynamically from reference date to reconstruct Gregorian equivalents.
 */
export function ethiopianToGregorian(eYear: number, eMonth: number, eDay: number): Date {
  const refG = new Date(Date.UTC(2024, 8, 11)); // Sept 11, 2024 represents Meskerem 1, 2017 EC

  // Calculate relative day distance from Meskerem 1, 2017 EC
  let dayDiff = 0;

  const targetYear = eYear;
  const targetMonth = eMonth;
  const targetDay = eDay;

  if (
    targetYear > 2017 ||
    (targetYear === 2017 && targetMonth > 1) ||
    (targetYear === 2017 && targetMonth === 1 && targetDay > 1)
  ) {
    // Step forward
    let cy = 2017;
    let cm = 1;
    let cd = 1;
    while (cy < targetYear || cm < targetMonth || cd < targetDay) {
      const mLen = getEthiopianMonthLength(cy, cm);
      if (cy < targetYear) {
        dayDiff += mLen - cd + 1;
        cm += 1;
        if (cm > 13) {
          cm = 1;
          cy += 1;
        }
        cd = 1;
      } else if (cm < targetMonth) {
        dayDiff += mLen - cd + 1;
        cm += 1;
        cd = 1;
      } else {
        dayDiff += targetDay - cd;
        cd = targetDay;
      }
    }
    const resultTime = refG.getTime() + dayDiff * 24 * 60 * 60 * 1000;
    return new Date(resultTime);
  } else if (targetYear < 2017 || targetMonth < 1 || targetDay < 1) {
    // Step backward
    let cy = 2017;
    let cm = 1;
    let cd = 1;
    while (cy > targetYear || cm > targetMonth || cd > targetDay) {
      if (cd > 1) {
        const sub = cd - 1; // Step to start of month
        dayDiff -= sub;
        cd = 1;
      } else {
        cm -= 1;
        if (cm < 1) {
          cm = 13;
          cy -= 1;
        }
        cd = getEthiopianMonthLength(cy, cm);
        dayDiff -= 1; // 1 day spent to cross month boundary
      }
    }
    // Now step up from start of that month to target day
    dayDiff += targetDay - 1;

    const resultTime = refG.getTime() + dayDiff * 24 * 60 * 60 * 1000;
    return new Date(resultTime);
  }

  return refG;
}
