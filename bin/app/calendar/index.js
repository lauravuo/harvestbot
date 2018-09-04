"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _publicHolidays = _interopRequireDefault(require("./public-holidays"));

var _default = () => {
  const HOURS_IN_DAY = 7.5;
  const CURRENT_DATE = new Date();
  const CURRENT_MONTH = CURRENT_DATE.getMonth();
  const CURRENT_YEAR = CURRENT_DATE.getFullYear();

  const isWeekLeave = date => date.getDay() === 0 || date.getDay() === 6;

  const datesEqual = (a, b) => a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

  const isWorkingDay = date => !isWeekLeave(date) && !_publicHolidays.default.find(holiday => datesEqual(holiday, date));

  const getYesterday = date => new Date(date.setDate(date.getDate() - 1));

  const getTotalWorkHoursSinceDate = (fromDate, toDate) => {
    let workingDate = new Date(toDate);
    let hours = 0;

    do {
      hours += isWorkingDay(workingDate) ? HOURS_IN_DAY : 0;
      workingDate = getYesterday(workingDate);
    } while (workingDate >= fromDate);

    return hours;
  };

  const getLatestFullWorkingDay = (date = new Date()) => {
    let workingDate = date;

    do {
      workingDate = getYesterday(workingDate);
    } while (!isWorkingDay(workingDate));

    return workingDate;
  };

  const getWorkingDaysForMonth = (year, month) => {
    const monthStartDate = new Date(year, month - 1, 1, 12);
    const monthEndDate = new Date(year, month, 0, 12);
    const workHoursInMonth = getTotalWorkHoursSinceDate(monthStartDate, monthEndDate);
    return workHoursInMonth / HOURS_IN_DAY;
  };

  return {
    CURRENT_MONTH,
    CURRENT_YEAR,
    HOURS_IN_DAY,
    datesEqual,
    isWorkingDay,
    getLatestFullWorkingDay,
    getTotalWorkHoursSinceDate,
    getWorkingDaysForMonth
  };
};

exports.default = _default;