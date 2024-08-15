export const Utils = {
  months(config: { count: number }) {
    // Devuelve un array de nombres de meses
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    return monthNames.slice(0, config.count);
  },
  numbers(config: { count: number, min: number, max: number }) {
    // Genera un array de números aleatorios
    const { count, min, max } = config;
    const numbersArray = Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
    return numbersArray;
  },
  CHART_COLORS: {
    red: 'rgba(255, 99, 132, 1)',
    blue: 'rgba(54, 162, 235, 1)',
    naranja: 'rgba(255, 165, 0, 1)',
    verde: 'rgba(76, 175, 80, 1)',
  },
  transparentize(color: string, opacity: number) {
    // Cambia la opacidad del color dado
    const alpha = opacity || 0.5;
    return color.replace('1)', `${alpha})`);
  }
};
