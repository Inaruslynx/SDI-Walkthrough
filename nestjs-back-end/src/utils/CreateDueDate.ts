import {
  PeriodicityOptions,
  PerSwingOptions,
  WeeklyOptions,
} from 'src/schemas/walkthroughs.schema';

export function createDueDate(
  periodicity: string,
  weeklyOption?: string,
  perSwingOption?: string,
  pastDueDate?: Date,
): Date {
  const { hour, minute } = getShiftChangeTime();
  const now = new Date();
  const currentWeekStart = getSundayOfWeek();

  // Start of morning shift for "today"
  const morningTime = new Date(now);
  morningTime.setHours(hour, minute, 0, 0);

  // Start of night shift for "today"
  const morningPlus12 = new Date(morningTime);
  morningPlus12.setHours(morningPlus12.getHours() + 12);

  const nextDueDate = new Date(morningTime);
  switch (periodicity) {
    case PeriodicityOptions.PerShift: {
      if (now < morningTime) {
        // Before morning -> due 12h after morning today (due for day shift)
        nextDueDate.setDate(morningPlus12.getDate());
      } else if (now < morningPlus12) {
        // Between morning and 12h later -> due 24h after morning (due for night shift)
        nextDueDate.setDate(nextDueDate.getDate() + 1);
      } else {
        // After 12h later -> due 36h after morning (due for next day shift)
        nextDueDate.setDate(morningPlus12.getDate() + 1);
      }

      return nextDueDate;
    }
    case PeriodicityOptions.Daily: {
      if (now < morningTime) {
        nextDueDate.setDate(nextDueDate.getDate() + 2);
      } else {
        nextDueDate.setDate(nextDueDate.getDate() + 1);
      }

      return nextDueDate;
    }
    case PeriodicityOptions.PerSwing: {
      // get start of current swing then look at perSwingOption to add days
      const swingStart = getSwingStartDate();
      switch (perSwingOption) {
        case PerSwingOptions.First: {
          nextDueDate.setDate(swingStart.getDate() + 4);
          break;
        }
        case PerSwingOptions.Second: {
          nextDueDate.setDate(swingStart.getDate() + 5);
          break;
        }
        case PerSwingOptions.Third: {
          nextDueDate.setDate(swingStart.getDate() + 6);
          break;
        }
        case PerSwingOptions.Fourth: {
          nextDueDate.setDate(swingStart.getDate() + 7);
          break;
        }
      }
      return nextDueDate;
    }
    case PeriodicityOptions.Weekly: {
      nextDueDate.setDate(
        getWeeklyOptionDate(
          weeklyOption,
          currentWeekStart,
          nextDueDate,
          1,
        ).getDate(),
      );
      return nextDueDate;
    }
    case PeriodicityOptions.BiWeekly: {
      if (pastDueDate) {
        const pastDue = new Date(pastDueDate);
        pastDue.setHours(hour, minute, 0, 0);
        if (now > new Date(pastDueDate.getDate() + 14)) {
          nextDueDate.setDate(
            getWeeklyOptionDate(
              weeklyOption,
              currentWeekStart,
              nextDueDate,
              2,
            ).getDate(),
          );
        } else {
          nextDueDate.setDate(pastDue.getDate() + 14);
        }
      } else {
        nextDueDate.setDate(
          getWeeklyOptionDate(
            weeklyOption,
            currentWeekStart,
            nextDueDate,
            2,
          ).getDate(),
        );
      }
      return nextDueDate;
    }
    case PeriodicityOptions.Monthly: {
      if (pastDueDate) {
        // Calculate difference in months
        const monthDiff =
          (now.getFullYear() - pastDueDate.getFullYear()) * 12 +
          (now.getMonth() - pastDueDate.getMonth());

        if (monthDiff >= 1) {
          // Clamp the day to avoid overflow (e.g. Feb 30 → Feb 28)
          const targetMonth = pastDueDate.getMonth() + monthDiff + 1;
          const targetYear =
            pastDueDate.getFullYear() + Math.floor(targetMonth / 12);
          const targetMonthIndex = targetMonth % 12;

          const daysInTargetMonth = new Date(
            targetYear,
            targetMonthIndex + 1,
            0,
          ).getDate();
          const targetDay = Math.min(pastDueDate.getDate(), daysInTargetMonth);

          nextDueDate.setFullYear(targetYear, targetMonthIndex, targetDay);
          return nextDueDate;
        }
      } else {
        // No pastDueDate → push nextDueDate to the 1st of next month
        const targetMonth = now.getMonth() + 1;
        const targetYear = now.getFullYear() + Math.floor(targetMonth / 12);
        const targetMonthIndex = targetMonth % 12;

        nextDueDate.setFullYear(targetYear, targetMonthIndex, 1);
        return nextDueDate;
      }
    }
  }
}

function getSwingStartDate(): Date {
  const reference = new Date('2025-08-24'); // Start of a known swing cycle
  const msInDay = 24 * 60 * 60 * 1000;
  const now = new Date();
  const { hour, minute } = getShiftChangeTime();
  reference.setHours(hour, minute, 0, 0);
  now.setHours(hour, minute, 0, 0);

  // Number of full days difference
  const diffDays = Math.floor((now.getTime() - reference.getTime()) / msInDay);

  const remainder = diffDays % 4;

  const swingStart = new Date(now);
  swingStart.setDate(swingStart.getDate() - remainder);
  return swingStart;
}

function getSundayOfWeek(date: Date = new Date()): Date {
  const { hour, minute } = getShiftChangeTime();
  console.log('Shift change time:', hour, minute);
  const day = date.getDay(); // 0=Sun, 1=Mon, ...
  const diffToSunday = (day + 6) % 7; // days since Sunday
  const sundayOfWeek = new Date(date);
  sundayOfWeek.setDate(sundayOfWeek.getDate() - diffToSunday);
  sundayOfWeek.setHours(hour, minute, 0, 0); // set to morning shift turnover time
  return sundayOfWeek;
}

function getWeeklyOptionDate(
  weeklyOption: string,
  currentWeekStart: Date,
  nextDueDate: Date,
  offsetWeeks = 1,
): Date {
  switch (weeklyOption) {
    case WeeklyOptions.Sunday: {
      nextDueDate.setDate(currentWeekStart.getDate() + 7 * offsetWeeks);
      break;
    }
    case WeeklyOptions.Monday: {
      nextDueDate.setDate(currentWeekStart.getDate() + 7 * offsetWeeks + 1);
      break;
    }
    case WeeklyOptions.Tuesday: {
      nextDueDate.setDate(currentWeekStart.getDate() + 7 * offsetWeeks + 2);
      break;
    }
    case WeeklyOptions.Wednesday: {
      nextDueDate.setDate(currentWeekStart.getDate() + 7 * offsetWeeks + 3);
      break;
    }
    case WeeklyOptions.Thursday: {
      nextDueDate.setDate(currentWeekStart.getDate() + 7 * offsetWeeks + 4);
      break;
    }
    case WeeklyOptions.Friday: {
      nextDueDate.setDate(currentWeekStart.getDate() + 7 * offsetWeeks + 5);
      break;
    }
    case WeeklyOptions.Saturday: {
      nextDueDate.setDate(currentWeekStart.getDate() + 7 * offsetWeeks + 6);
      break;
    }
  }
  return nextDueDate;
}

function getShiftChangeTime(): { hour: number; minute: number } {
  // Default to 8:00 if not provided
  const shiftEnv = process.env.SHIFT_CHANGE || '8:00';
  const [hourStr, minuteStr] = shiftEnv.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = minuteStr ? parseInt(minuteStr, 10) : 0;
  return { hour: isNaN(hour) ? 8 : hour, minute: isNaN(minute) ? 0 : minute };
}

// private isWithinAllowedWindow(logTime: Date, periodicity: string): boolean {
//   const timeNow = new Date();
//   const { hour, minute } = this.getShiftChangeTime();
//   const windowStart = new Date();
//   const windowEnd = new Date();
//   const msInHour = 1000 * 60 * 60;
//   const msInDay = msInHour * 24;

//   let allowedWindowMs = 0;

//   switch (periodicity) {
//     case PeriodicityOptions.PerShift:
//       const currentShiftStart = new Date();
//       currentShiftStart.setHours(hour, minute, 0, 0);
//       if (timeNow < currentShiftStart) {
//         currentShiftStart.setHours(currentShiftStart.getHours() - 12);
//       }
//       windowStart.setDate(currentShiftStart.getHours() - 12);
//       break;
//     case PeriodicityOptions.Daily:
//       const currentDayStart = new Date();
//       currentDayStart.setHours(hour, minute, 0, 0);
//       windowStart.setDate(currentDayStart.getDate() - 1);
//       break;
//     case PeriodicityOptions.PerSwing:
//       allowedWindowMs = msInDay * 4;
//       break;
//     case PeriodicityOptions.Weekly:
//       const currentWindowStart = this.getLastMonday();
//       windowStart.setDate(currentWindowStart.getDate() - 7);
//       break;
//     case PeriodicityOptions.BiWeekly:
//       allowedWindowMs = msInDay * 14;
//       break;
//     case PeriodicityOptions.Monthly:
//       allowedWindowMs = msInDay * 30;
//       break;
//     default:
//       allowedWindowMs = msInDay; // Default to daily if unknown
//   }

//   const timeDiff = timeNow.getTime() - logTime.getTime();

//   if (timeDiff < allowedWindowMs) {
//     return true;
//   } else {
//     return false;
//   }
// }
// private getLastMonday(): Date {
//   const { hour, minute } = this.getShiftChangeTime();
//   const lastMonday = new Date();
//   const day = lastMonday.getDay(); // 0=Sun, 1=Mon, ...
//   const diffToMonday = (day + 6) % 7; // days since Monday
//   lastMonday.setDate(lastMonday.getDate() - diffToMonday);
//   lastMonday.setHours(hour, minute, 0, 0); // set to 8:00 AM
//   if (new Date() < lastMonday) {
//     // if current time is before today's Monday 8am, go to previous Monday
//     lastMonday.setDate(lastMonday.getDate() - 7);
//   }
//   return lastMonday;
// }
