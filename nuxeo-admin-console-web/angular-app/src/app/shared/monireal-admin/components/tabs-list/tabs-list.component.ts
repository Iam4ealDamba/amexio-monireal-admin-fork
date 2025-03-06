import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule, NgForOf} from "@angular/common";
import {TabsType} from "../../interfaces/types";

@Component({
  selector: "app-monireal-tabs-list-component",
  templateUrl: "./tabs-list.component.html",
  styleUrls: ["./tabs-list.component.scss"],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class MonirealTabsListComponent {
  //---------------------------
  // Events
  //---------------------------
  @Input({required: true}) tabs: TabsType[] = [] as TabsType[];
  @Input({required: true}) currentTab: number = 1;
  @Output() getCurrentTab: EventEmitter<number> = new EventEmitter<number>;
  
  //---------------------------
  // Functions
  //---------------------------
  
  sendCurrentTab(index: number) {
    this.getCurrentTab.emit(index);
  }
}