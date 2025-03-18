import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MonirealButtonComponent} from "../../buttons/monireal-button/monireal-button.component";

/**
 * A confirmation modal that return a boolean
 */
@Component({
  selector: "app-confirm-modal-component",
  templateUrl: "./confirm-modal.component.html",
  styleUrls: ["./confirm-modal.component.scss"],
  standalone: true,
  imports: [
    MonirealButtonComponent
  ]
})
export class ConfirmModalComponent {
  //---------------------------
  // Events
  //---------------------------
  @Input() title = "";
  @Input() description = "";
  @Output() $sendResponse: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  //---------------------------
  // Constructor
  //---------------------------
  
  
  //---------------------------
  // Functions
  //---------------------------
  
  handleSendResponse(event: boolean): void {
    this.$sendResponse.emit(event)
  }
}