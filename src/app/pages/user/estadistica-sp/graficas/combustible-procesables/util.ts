export const Utils = {
  CHART_COLORS: {
    mostaza: 'rgba(255, 193, 7, 1) ',
    verde: 'rgba(76, 175, 80, 1)',
    celeste: 'rgba(3, 169, 244, 0.3)',
    azul : 'rgba(135, 206, 250, 0.3)',
    grisBonito: 'rgba(192, 192, 192, 0.8)',
    amarilloBonito: 'rgba(255, 223, 186, 0.8)'
  },
  transparentize(color: string, opacity: number) {
    // Cambia la opacidad del color dado
    const alpha = opacity || 0.5;
    return color.replace('1)', `${alpha})`);
  }
};
