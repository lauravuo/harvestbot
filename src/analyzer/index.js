import cal from '../calendar';
// import logger from '../log';

export default () => {
  const calendar = cal();
  const sortByDate = (a, b) => new Date(a.date) - new Date(b.date);

  const getPeriodRangeEnd = (entriesDate, latestFullDate, today = new Date()) => (
    calendar.datesEqual(entriesDate, today)
      ? entriesDate
      : latestFullDate
  );

  const getBillablePercentage = (
    entries,
    totalHours = entries.reduce(
      (result, entry) =>
        (entry.billable
          ? { ...result, billable: entry.hours + result.billable }
          : { ...result, nonBillable: result.nonBillable + entry.hours }),
      { billable: 0, nonBillable: 0 },
    ),
    allHours = totalHours.billable + totalHours.nonBillable,
  ) => (allHours ? Math.floor((totalHours.billable / (allHours)) * 100) : 0);

  const getBillablePercentageCurrentMonth = sortedEntries =>
    getBillablePercentage(sortedEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate.getFullYear() === calendar.CURRENT_YEAR
        && entryDate.getMonth() === calendar.CURRENT_MONTH;
    }));

  const getPeriodRange = (
    entries,
    latestFullDate,
    sortedEntries = entries.sort(sortByDate),
    latestRecordDate = new Date(sortedEntries[sortedEntries.length - 1].date),
    endDate = getPeriodRangeEnd(
      latestRecordDate,
      latestFullDate,
    ),
    sortedRangeEntries = sortedEntries.filter(entry =>
      new Date(entry.date).getTime() <= endDate.getTime()),
  ) => ({
    entries: sortedRangeEntries, // sorted entries for range
    start: new Date(sortedEntries[0].date), // start date
    end: endDate, // today or last calendar working day
  });

  const calculateWorkedHours = (entries, ignoreTaskIds) => entries.reduce((result, entry) => {
    const ignore = ignoreTaskIds.includes(entry.taskId);
    return {
      ...result,
      warnings: !ignore && !calendar.isWorkingDay(new Date(entry.date))
        ? [...result.warnings, `Recorded hours in non-working day (${entry.date})!`] : result.warnings,
      total: ignore ? result.total : result.total + entry.hours,
    };
  }, {
    warnings: [],
    total: 0,
    billablePercentageCurrentMonth: getBillablePercentageCurrentMonth(entries),
  });

  return {
    getPeriodRange,
    calculateWorkedHours,
  };
};
