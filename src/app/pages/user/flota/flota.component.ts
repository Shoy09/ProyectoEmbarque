import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConsumoGasolina } from 'app/core/models/consumogaslo.model';
import { CostoGalonGasoI } from 'app/core/models/costoGG.model';
import { ConsumosXGalonService } from 'app/core/services/consumos-x-galon.service';
import { CostoXGalonService } from 'app/core/services/costo-x-galon.service';

@Component({
  selector: 'app-flota',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule ],
  templateUrl: './flota.component.html',
  styleUrl: './flota.component.css'
})
export class FlotaComponent {
  form!: FormGroup;
  consumos: ConsumoGasolina[] = [];
  lastCosto?: CostoGalonGasoI;

  constructor(
    private fb: FormBuilder,
    private consumoGasolinaService: ConsumosXGalonService,
    private costoXGalonService: CostoXGalonService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      embarcacion: ['', Validators.required],
      consumo_gasolina: ['', Validators.required],
      total: [{ value: '', disabled: true }]
    });

    this.loadConsumos();

    this.costoXGalonService.getLastCosto().subscribe(last => {
      this.lastCosto = last;
    });
  }

  loadConsumos(): void {
    this.consumoGasolinaService.getConsumoGasolina().subscribe(data => {
      this.consumos = data;
    });
  }

  onSubmit(): void {
    if (this.lastCosto) {
      const consumo: ConsumoGasolina = this.form.value;
      consumo.total = consumo.consumo_gasolina * this.lastCosto.costo;

      this.consumoGasolinaService.createConsumoGasolina(consumo).subscribe(() => {
        this.loadConsumos();
      });
    } else {
      // Manejar el caso en que lastCosto no esté disponible
      console.error('No se pudo obtener el último costo');
    }
  }
}
