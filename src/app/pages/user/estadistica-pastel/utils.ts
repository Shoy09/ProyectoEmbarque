export const Utils = {
  months(config: { count: number }) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    return monthNames.slice(0, config.count);
  },

  numbers(config: { count: number, min: number, max: number }) {
    const { count, min, max } = config;
    const numbersArray = Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
    return numbersArray;
  },

  CHART_COLORS: {
    red: 'rgba(255, 99, 132, 1)',
    blue: 'rgba(54, 162, 235, 1)',
    naranja: 'rgba(255, 165, 0, 1)',
    verde: 'rgba(76, 175, 80, 1)',
    morado: 'rgba(128, 0, 128, 1)',
    azulClaro: 'rgba(102, 204, 0, 1)',
    cian: 'rgba(0, 191, 255, 1)',
  },

  transparentize(color: string, opacity: number) {
    const alpha = opacity || 0.5;
    return color.replace('1)', `${alpha})`);
  },

  generateColors(count: number, index: number): string[] {
    const hue = (index * 137.508) % 360;
    return Array(count).fill(0).map((_, i) =>
      `hsla(${hue}, ${50 + i * 10}%, ${50 + i * 5}%, 0.7)`
    );
  },

  generateBorderColors(count: number, index: number): string[] {
    const hue = (index * 137.508) % 360;
    return Array(count).fill(0).map((_, i) =>
      `hsl(${hue}, ${60 + i * 10}%, ${40 + i * 5}%)`
    );
  }
};
