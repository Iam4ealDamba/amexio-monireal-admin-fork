import {Component, Input} from '@angular/core';
import {IconType, NgIconComponent} from "@ng-icons/core";
import {CommonModule} from "@angular/common";

/**
 * A customized link button made with TailwindCSS and NgIcons
 */
@Component({
  selector: "app-monireal-link-button-component",
  templateUrl: "./monireal-link-button.component.html",
  styleUrls: ["./monireal-link-button.component.scss"],
  imports: [CommonModule, NgIconComponent],
  standalone: true,
})
export class MonirealLinkButtonComponent {
  //---------------------------
  // Events
  //---------------------------
  @Input({required: true}) title = "";
  @Input() type: "submit" | "reset" | "button" = "button";
  @Input() url = "";
  @Input() icon = "";
  @Input() externalLink = false;
  @Input() @Input() buttonStyle: 'button-regular' | 'button-primary' | 'button-inactive' = "button-regular";
  
  //---------------------------
  // Constructor
  //---------------------------
}