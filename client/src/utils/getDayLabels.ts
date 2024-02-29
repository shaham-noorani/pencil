const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const getDayLabels = (): string[] => {
  const todayIndex = new Date().getDay();
  const weekLabels = [];
  for (let i = 6; i >= 0; i--) {
    const dayIndex = (todayIndex - i + 7) % 7;
    weekLabels.push(daysOfWeek[dayIndex]);
  }
  return weekLabels;
};