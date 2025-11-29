import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CdkOverlayOrigin } from "@angular/cdk/overlay";

@Component({
  selector: 'app-expansion',
  imports: [RouterLink, CommonModule, CdkOverlayOrigin],
  templateUrl: './expansion.component.html',
  styleUrl: './expansion.component.css'
})
export class ExpansionComponent {

}
