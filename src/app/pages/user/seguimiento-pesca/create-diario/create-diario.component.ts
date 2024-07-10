import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-create-diario',
  standalone: true,
  imports: [MatDialogModule, CommonModule, ReactiveFormsModule],
  templateUrl: './create-diario.component.html',
  styleUrl: './create-diario.component.css'
})
export class CreateDiarioComponent {

}
