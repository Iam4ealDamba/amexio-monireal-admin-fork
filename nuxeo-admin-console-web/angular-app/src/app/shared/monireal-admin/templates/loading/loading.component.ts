import {Component, OnInit} from '@angular/core';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

/**
 * Loading template component
 */
@Component({
  selector: "app-loading-template-component",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.scss"],
  standalone: true,
  imports: [
    MatProgressSpinnerModule
  ]
})
export class LoadingTemplateComponent {
  //---------------------------
  // Variable
  //---------------------------
  title = "";
  description = "";
  
}