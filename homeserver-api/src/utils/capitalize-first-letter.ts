export function capitalizeFirstletter(name: string): string {
  if (name == null) return '';

  const resultArray = name.split(' ');
  let textFormatted: string[] = [];

  if (resultArray.length > 1) {
    resultArray.forEach((name) =>
      textFormatted.push(
        name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
      ),
    );
    const formattedName = textFormatted.join(' ');

    return formattedName;
  }
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}
