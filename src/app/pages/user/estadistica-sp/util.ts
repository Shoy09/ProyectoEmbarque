export const Utils = {
  CHART_COLORS: {
    celeste: 'rgba(174, 185, 196, 1)',
    azul: 'rgba(21, 96, 130, 1)',
    azul_noche: 'rgba(21, 61, 99, 1)',
    gris: 'rgba(89, 89, 89, 1)',
    verde: 'rgba(76, 175, 80, 1)',
  },
  transparentize(color: string, opacity: number) {
    const alpha = opacity || 0.5;
    return color.replace('1)', `${alpha})`);
  },
  getColorForSpecies(index: number): string {
    const colors = Object.values(Utils.CHART_COLORS);
    return colors[index % colors.length];
  }
};
