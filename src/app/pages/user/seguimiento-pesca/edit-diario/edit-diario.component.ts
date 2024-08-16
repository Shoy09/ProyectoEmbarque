import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IDiarioPesca } from 'app/core/models/diarioPesca.model';
import { Embarcaciones } from 'app/core/models/embarcacion';
import { Especies } from 'app/core/models/especie.model';
import { ZonaPescaI } from 'app/core/models/zonaPesca';
import { DiarioPescaService } from 'app/core/services/diario-pesca.service';
import { EmbarcacionesService } from 'app/core/services/embarcaciones.service';
import { EspeciesService } from 'app/core/services/especies.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-diario',
  standalone: true,
  imports: [MatDialogModule, CommonModule, ReactiveFormsModule ],
  templateUrl: './edit-diario.component.html',
  styleUrl: './edit-diario.component.css'
})
export class EditDiarioComponent{

  formEDP: FormGroup;
  especies: Especies[] = [];
  embarcaciones: Embarcaciones[] = [];
  zona: ZonaPescaI[] = [];
  embarcacionNombre: String = '';

  constructor(
    private _toastr: ToastrService,
    private formBuilder: FormBuilder,
    private especiesService: EspeciesService,
    private embarcacionService: EmbarcacionesService,
    private diarioPE: DiarioPescaService,
    public dialogRef: MatDialogRef<EditDiarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDiarioPesca
  ){
    this.formEDP = this.formBuilder.group({
      embarcacion: ['', [Validators.required]],
      especie: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      numero_alcance: ['', [Validators.required]],
      zona_pesca: ['', [Validators.required]],
      estrato: ['', [Validators.required]],
      profundidad: ['', [Validators.required]],
      tiempo_efectivo: ['', [Validators.required]],
      rango_talla_inicial:['', [Validators.required]],
      rango_talla_final: ['', [Validators.required]],
      moda: ['', [Validators.required]],
      porcentaje: ['', [Validators.required]],
      ar: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      flotaDP_id: [0, Validators.required],
      p_flota_dolares: ['', [Validators.required]],
      t_flota: ['', [Validators.required]],
      precio_lances: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.formEDP.patchValue(this.data); // Aplicamos los datos iniciales
    this.getEspecies();

    this.embarcacionService.getEmbarcaciones().subscribe(
      (embarcaciones: Embarcaciones[]) => {
        this.embarcaciones = embarcaciones;
        if (this.data && this.data.embarcacion) {
          const embarcacion = embarcaciones.find(e => e.id === this.data.embarcacion);
          if (embarcacion) {
            this.embarcacionNombre = embarcacion.nombre;
          }
        }
      },
      (error: any) => {
        console.error('Error al obtener embarcaciones:', error);
      }
    );

  }

  getEspecies() {
    this.especiesService.getDiarioPesca().subscribe(
      (especies: Especies[]) => {
        this.especies = especies;
        // Ahora que tenemos las especies, podemos establecer el valor predeterminado correcto si data.especie existe
        if (this.data && this.data.especie) {
          this.formEDP.controls['especie'].setValue(this.data.especie);
        }
      },
      (error: any) => {
        console.error('Error al obtener especies:', error);
      }
    );
  }

  getEmbarcaciones() {
    this.embarcacionService.getEmbarcaciones().subscribe(
      (embarcaciones: Embarcaciones[]) => {
        this.embarcaciones = embarcaciones;
        // Ahora que tenemos las embarcaciones, podemos establecer el valor predeterminado correcto si data.embarcacion existe
        if (this.data && this.data.embarcacion) {
          this.formEDP.controls['embarcacion'].setValue(this.data.embarcacion);
        }
      },
      (error: any) => {
        console.error('Error al obtener embarcaciones:', error);
      }
    );
  }

  getZonaPesca() {
    this.embarcacionService.getZonaPesca().subscribe(
      (zonas: ZonaPescaI[]) => {
        console.log('Zonas obtenidas:', zonas);
        this.zona = zonas;
        if (this.data && this.data.zona_pesca) {
          this.formEDP.controls['zona_pesca'].setValue(this.data.zona_pesca);
        }
      },
      (error: any) => {
        console.error('Error al obtener zonas:', error);
      }
    )
  }

  calculatePrecioLance():void{
    const p_flota = Number(this.formEDP.get('p_flota_dolares')?.value) || 0;
    const t_flota = Number(this.formEDP.get('t_flota')?.value) || 0;
    const precio_t = p_flota/t_flota
    const tonelada_captura_lance = Number(this.formEDP.get('numero')?.value) || 0;
    const precio_x_lance = precio_t * tonelada_captura_lance

    const redondeo = parseFloat(precio_x_lance.toFixed(2))
    this.formEDP.patchValue({precio_lances: redondeo})
  }

  save(): void {
    if (this.formEDP.valid) {
      this.calculatePrecioLance();
      const diario: IDiarioPesca = this.formEDP.value;

      this.diarioPE.putDiarioPesca(diario, this.data.id).subscribe(
        (res) => {
          console.log("DP actualizada:", res);
          this.dialogRef.close(res); // Pasa el resultado al cerrar
        },
        (error) => {
          console.error("Error al actualizar DP:", error);
          this._toastr.error('Hubo un error al actualizar el registro');
          this.dialogRef.close(); // Cierra sin pasar resultado en caso de error
        }
      );
    }
  }


  cancel(): void {
    this.dialogRef.close({ canceled: true });
  }



}
