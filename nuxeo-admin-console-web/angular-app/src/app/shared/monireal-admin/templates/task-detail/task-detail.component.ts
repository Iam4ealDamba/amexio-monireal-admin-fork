import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NuxeoCliService} from "../../services/nuxeo-cli/nuxeo.service";
import {ToastrCustomService} from "../../services/toastr/toastr.service";
import {TaskDetailType} from "../../interfaces/types";
import {NgIcon} from "@ng-icons/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {environment} from "../../../../../environments/environment.development";
import {NoDataComponent} from "../no-data/no-data.component";
import {CommonModule} from "@angular/common";
import {MonirealButtonComponent} from "../../components/buttons/monireal-button/monireal-button.component";
import {
  MonirealLinkButtonComponent
} from "../../components/buttons/monireal-link-button/monireal-link-button.component";

@Component({
  selector: "app-task-detail-template-component",
  templateUrl: "./task-detail.component.html",
  styleUrls: ["./task-detail.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    NgIcon,
    FormsModule,
    ReactiveFormsModule,
    NoDataComponent,
    MonirealButtonComponent,
    MonirealLinkButtonComponent
  ]
})
export class TaskDetailTemplateComponent implements OnInit {
  //---------------------------
  // Variable
  //---------------------------
  isLoading = true;
  taskDetail: TaskDetailType = {} as TaskDetailType;
  
  //---------------------------
  // Events
  //---------------------------
  @Input({required: true}) title = "";
  @Input({required: true}) description = "";
  @Input({required: true}) documentID = "";
  @Output() $emitHideTemplate = new EventEmitter<boolean>();
  
  //---------------------------
  // Constructor
  //---------------------------
  constructor(private nuxeo: NuxeoCliService, private toastr: ToastrCustomService) {
  }
  
  ngOnInit(): void {
    this.fetchDocument();
  }
  
  //---------------------------
  // Functions
  //---------------------------
  
  fetchDocument() {
    if (this.documentID.length) {
      try {
        this.nuxeo.exec("WORKFLOW_TASK_DETAIL", {
          body: {
            params: {docID: this.documentID},
            context: {}
          }
        }).subscribe((res: any) => {
          this.taskDetail = res.data as TaskDetailType;
          this.taskDetail.path = environment.apiUrl + "/nuxeo/ui/#!/browse" + res.data.path;
          this.isLoading = false;
        });
      } catch (e: any) {
        this.isLoading = false;
        this.toastr.showToast("Warning", "The request was aborted", "Document Detail");
      }
    }
  }
  
  handleHideTemplate() {
    this.$emitHideTemplate.emit(false);
  }
}