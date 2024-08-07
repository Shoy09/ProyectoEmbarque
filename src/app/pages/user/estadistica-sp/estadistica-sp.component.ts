import { Component, OnInit } from '@angular/core';
import { Chart} from 'chart.js/auto'
import { Utils } from './util';

@Component({
  selector: 'app-estadistica-sp',
  standalone: true,
  imports: [],
  templateUrl: './estadistica-sp.component.html',
  styleUrl: './estadistica-sp.component.css'
})
export class EstadisticaSPComponent implements OnInit{

  public chart!: Chart;

  ngOnInit(): void {
    const DATA_COUNT = 7;
    const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};

    const labels = Utils.months({count: 7}); // Asegúrate de que Utils está importado
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Dataset 1',
          data: Utils.numbers(NUMBER_CFG),
          borderColor: Utils.CHART_COLORS.red,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
        },
        {
          label: 'Dataset 2',
          data: Utils.numbers(NUMBER_CFG),
          borderColor: Utils.CHART_COLORS.blue,
          backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
        }
      ]
    };

    this.chart = new Chart("chart", {
      type: 'line', // O cualquier otro tipo de gráfico que estés usando
      data: data
    });
  }
}
