import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DerechoPI } from 'app/core/models/derechoP.model';
import { CostoXGalonService } from 'app/core/services/costo-x-galon.service';

@Component({
  selector: 'app-edit-dere-pesca',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-dere-pesca.component.html',
  styleUrl: './edit-dere-pesca.component.css'
})
export class EditDerePescaComponent {

  formEDePesca: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private serviceDP: CostoXGalonService,
    public dialogRef: MatDialogRef<EditDerePescaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DerechoPI
  ){
    this.formEDePesca = this.formBuilder.group({
      item : [{ value: '' , disabled: true }, Validators.required],
      costo : ['', [Validators.required]],
    })
  }

  ngOnInit():void{
    this.formEDePesca.patchValue(this.data)
  }

  save(): void{
    if (this.formEDePesca.valid){
      const derePesca : DerechoPI = this.formEDePesca.value;
      this.serviceDP.updateDerechoPesca(derePesca, this.data.id).subscribe(
        (res) => {
          console.log("DP actualizada:", res);
          this.dialogRef.close(res);
        },
        (error) => {
          console.error("Error al actualizar DP:", error);
        }
      )
    }
  }
}
