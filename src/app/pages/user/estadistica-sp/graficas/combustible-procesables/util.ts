export const Utils = {
  CHART_COLORS: {
    mostaza: 'rgba(255, 193, 7, 1) ',
    verde: 'rgba(76, 175, 80, 1)',
    celeste: 'rgba(3, 169, 244, 0.3)'
  },
  transparentize(color: string, opacity: number) {
    // Cambia la opacidad del color dado
    const alpha = opacity || 0.5;
    return color.replace('1)', `${alpha})`);
  }
};
