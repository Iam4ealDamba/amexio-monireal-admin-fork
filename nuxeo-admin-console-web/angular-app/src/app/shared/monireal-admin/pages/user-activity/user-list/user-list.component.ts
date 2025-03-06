import {Component, OnInit} from '@angular/core';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {NgIf} from "@angular/common";
import {NoDataComponent} from "../../../templates/no-data/no-data.component";

@Component({
  selector: "app-monireal-user-list-page-component",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    NgIf,
    NoDataComponent
  ]
})
export class MonirealUserListPageComponent implements OnInit {
  //---------------------------
  // Variable
  //---------------------------
  title = "User List";
  description = "";
  isLoading = true;
  userList: string[] = [];
  
  //---------------------------
  // Constructor
  //---------------------------
  constructor() {
  }
  
  ngOnInit(): void {
  }
  
  //---------------------------
  // Functions
  //---------------------------
  
  exampleFunction() {
  }
}