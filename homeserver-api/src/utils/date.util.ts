export function getLocalFormattedDate(date: Date): string {
  const year = date.getFullYear();
  const day = String(date.getDate()).padStart(2, '0');

  const getMonthText = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];
  const month = getMonthText[date.getMonth()];

  return `${day} de ${month} de ${year}`;
}
