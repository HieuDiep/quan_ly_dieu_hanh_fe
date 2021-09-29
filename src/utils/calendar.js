export const getListDays = (currentMonth, currentYear) => {
  const isLapYear = (_year) => {
    if (_year % 400 === 0) return true;
    if (_year % 4 === 0 && _year % 100 !== 0) {
      return true;
    }
    return false;
  };

  const numberOfDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (isLapYear(currentYear)) {
    numberOfDays[1] = 29;
  }

  let indexOfPrevMonth = currentMonth - 2;

  if (indexOfPrevMonth === -1) {
    indexOfPrevMonth = 11;
  }

  const numberOfDaysPrevMonth = numberOfDays[indexOfPrevMonth];

  let dayStartOfMonth = new Date(
    `${currentYear}-${currentMonth}-${1}`
  ).getDay();
  let dayEndOfMonth = new Date(
    `${currentYear}-${currentMonth}-${numberOfDays[currentMonth - 1]}`
  ).getDay();

  let beforeDay = [];
  let currentDay = [];
  let afterDay = [];

  if (dayStartOfMonth === 0) dayStartOfMonth = 7;
  if (dayEndOfMonth === 0) dayEndOfMonth = 7;

  if (dayStartOfMonth > 1) {
    for (let index = dayStartOfMonth; index > 1; index--) {
      beforeDay = [numberOfDaysPrevMonth - beforeDay.length, ...beforeDay];
    }
  }

  for (let index = 1; index <= numberOfDays[currentMonth - 1]; index++) {
    currentDay = [...currentDay, index];
  }

  if (dayEndOfMonth !== 7) {
    for (let index = dayEndOfMonth; index < 7; index++) {
      afterDay = afterDay.concat(afterDay.length + 1);
    }
  }

  let result = [];

  const convertResultValue = (_year, _month, _day) => {
    const _monthStr = _month.toString().padStart(2, '0');
    const _dayStr = _day.toString().padStart(2, '0');
    return `${_year}-${_monthStr}-${_dayStr}`;
  };

  for (let _day of beforeDay) {
    result = result.concat({
      label: _day,
      value:
        currentMonth - 1 === 0
          ? convertResultValue(currentYear - 1, '12', _day)
          : convertResultValue(currentYear, currentMonth - 1, _day)
    });
  }

  for (let _day of currentDay) {
    result = result.concat({
      label: _day,
      value: convertResultValue(currentYear, currentMonth, _day),
      isCurrent: true
    });
  }

  for (let _day of afterDay) {
    result = result.concat({
      label: _day,
      value:
        currentMonth + 1 === 13
          ? convertResultValue(currentYear + 1, '01', _day)
          : convertResultValue(currentYear, currentMonth + 1, _day)
    });
  }
  return result;
};

export const handleDataDays = (meetings) => {
  let result = {};
  for (let meeting of meetings) {
    if (meeting && meeting.status) {
      const date = meeting.start_at.date.split(' ')[0];
      if (result[date]) {
        result[date] = result[date].concat(meeting);
      } else {
        result[date] = [meeting];
      }
    }
  }

  return result;
};
