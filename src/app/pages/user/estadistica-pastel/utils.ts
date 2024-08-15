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

  // Ejemplo de cómo generar colores únicos
  generateColors(count: number): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      colors.push(color);
    }
    return colors;
  },

  generateBorderColors(count: number, index: number = 0): string[] {
    const hue = (index * 137.508) % 360;
    return Array(count).fill(0).map((_, i) =>
      `hsl(${hue}, ${60 + i * 10}%, ${40 + i * 5}%)`
    );
  }

};
