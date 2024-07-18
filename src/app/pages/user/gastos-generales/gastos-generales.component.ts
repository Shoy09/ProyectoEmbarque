import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CostoGalonGasoI } from 'app/core/models/costoGG.model';
import { CostoTMHielo } from 'app/core/models/costoGH.model';
import { CostoM3Agua } from 'app/core/models/costoMA.model';
import { CostoXGalonService } from 'app/core/services/costo-x-galon.service';
import { last } from 'rxjs';

@Component({
  selector: 'app-gastos-generales',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatDatepickerModule,
  ],
  templateUrl: './gastos-generales.component.html',
  styleUrl: './gastos-generales.component.css'
})
export class GastosGeneralesComponent {

  //combustible
  displayedColumns: string[] = ['id', 'fecha', 'costo'];
  dataSource!: MatTableDataSource<CostoGalonGasoI>;
  lastCosto?: CostoGalonGasoI;

  //hielo
  displayedColumnsTMHielo: string[] = ['id', 'fecha', 'costo'];
  dataSourceTMHielo!: MatTableDataSource<CostoTMHielo>;
  ultimoCostoHielo?: CostoTMHielo;

  //agua
  displayedColumnsT3Agua: string[] = ['id', 'fecha', 'costo'];
  dataSourceT3Agua!: MatTableDataSource<CostoM3Agua>;
  ultimoCostoAgua?: CostoM3Agua;

  constructor(private costoGalonGasolina: CostoXGalonService) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSourceTMHielo = new MatTableDataSource();

    //combustible
    this.costoGalonGasolina.getCGG().subscribe((data) => {
      const reversedData = data.reverse();
      this.dataSource.data = reversedData;
    });

    this.costoGalonGasolina.getLastCosto().subscribe(last => {
      this.lastCosto = last;
    });

    //hielo
    this.costoGalonGasolina.getTMHielo().subscribe((data) => {
      const reversedData = data.reverse();
      this.dataSourceTMHielo.data = reversedData;
    });

    this.costoGalonGasolina.getLastCostoHielo().subscribe(last => {
      this.ultimoCostoHielo = last;
    });

    //agua
    this.costoGalonGasolina.getM3Agua().subscribe((data) =>{
      const reversedData = data.reverse();
      this.dataSourceT3Agua.data = reversedData
    })

    this.costoGalonGasolina.getLastM3Agua().subscribe( last => {
      this.ultimoCostoAgua = last
    })

  }

}
