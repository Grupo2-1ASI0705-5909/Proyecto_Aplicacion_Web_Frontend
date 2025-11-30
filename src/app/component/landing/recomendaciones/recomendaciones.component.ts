import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recomendaciones',
  imports: [RouterLink,CommonModule],
  templateUrl: './recomendaciones.component.html',
  styleUrl: './recomendaciones.component.css'
})
export class RecomendacionesComponent {

}
