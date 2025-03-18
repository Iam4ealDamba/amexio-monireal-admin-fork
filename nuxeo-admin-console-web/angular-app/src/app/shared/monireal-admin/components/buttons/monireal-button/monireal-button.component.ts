import {Component, Input} from '@angular/core';
import {IconType, NgIconComponent} from "@ng-icons/core";
import {CommonModule} from "@angular/common";

/**
 * A customized button made with TailwindCSS and NgIcons
 */
@Component({
  selector: "app-monireal-button-component",
  templateUrl: "./monireal-button.component.html",
  styleUrls: ["./monireal-button.component.scss"],
  imports: [CommonModule, NgIconComponent],
  standalone: true,
})
export class MonirealButtonComponent {
  //---------------------------
  // Events
  //---------------------------
  @Input({required: true}) title = "";
  @Input() buttonStyle: 'button-regular' | 'button-primary' | 'button-inactive' = "button-regular";
  @Input() type: "submit" | "reset" | "button" = "button";
  @Input() icon = "";
  @Input() disabled = false;
  
  //---------------------------
  // Constructor
  
}