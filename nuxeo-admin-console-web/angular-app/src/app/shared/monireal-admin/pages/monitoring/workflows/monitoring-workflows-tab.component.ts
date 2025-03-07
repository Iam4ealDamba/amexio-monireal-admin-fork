import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NuxeoCliService} from "../../../services/nuxeo-cli/nuxeo.service";
import {TaskType} from "../../../interfaces/types";
import {environment} from "../../../../../../environments/environment.development";
import {CommonModule} from "@angular/common";
import {NgIconComponent} from "@ng-icons/core";
import {NgxPaginationModule} from "ngx-pagination";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ToastrCustomService} from "../../../services/toastr/toastr.service"
import {NoDataComponent} from "../../../templates/no-data/no-data.component";
import {WorkflowDelegationModalComponent} from "./workflow-delegation/workflow-delegation.component";
import {MonirealButtonComponent} from "../../../components/buttons/monireal-button/monireal-button.component";

@Component({
  selector: 'app-monitoring-workflows',
  templateUrl: './monitoring-workflows-tab.component.html',
  styleUrls: ['./monitoring-workflows-tab.component.scss'],
  standalone: true,
  imports: [CommonModule, NgIconComponent, NgxPaginationModule, ReactiveFormsModule, NoDataComponent, WorkflowDelegationModalComponent, MonirealButtonComponent]
})
export class MonitoringWorkflowsTabComponent implements OnInit, OnChanges {
  // -----------------------------------
  // VARIABLES
  // -----------------------------------
  
  // Global Variables
  pageTitle = "Workflows";
  pageDetails = "Management of all the opened tasks in the application."
  isLoading = true;
  
  // Tasks Variables
  taskList: TaskType[] = [];
  currentTaskList: TaskType[] = [];
  checkedTasks: string[] = [];
  dueDays = 0;
  currentPage = 1;
  showDelegationModal = false;
  
  
  formGroup: FormGroup = new FormGroup({
    search: new FormControl("")
  });
  
  constructor(protected nuxeo: NuxeoCliService, private toastr: ToastrCustomService) {
  }
  
  // -----------------------------------
  // FUNCTIONS
  // -----------------------------------
  ngOnInit() {
    this.fetchTasks();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (this.taskList.length) {
      this.taskList = this.taskList.map((occurence) => {
        occurence.state = this.handleDueDate(occurence.dueDate);
        return occurence;
      })
    }
  }
  
  fetchTasks() {
    this.nuxeo.exec('WORKFLOWS').subscribe((data: any) => {
      this.taskList = data.tasks as TaskType[];
      
      for (const i in this.taskList) {
        const baseURL = !environment.production
          ? environment.apiUrl + "/nuxeo"
          : location.origin + "/nuxeo";
        this.taskList[i].path =
          baseURL + '/ui/#!/tasks/' + this.taskList[i].id;
        this.taskList[i].dueDate = new Date(this.taskList[i].dueDate);
        this.taskList[i].state = this.handleDueDate(this.taskList[i].dueDate);
      }
      this.currentTaskList = this.taskList;
    });
  }
  
  execCancellation() {
    const listText = this.checkedTasks.join(";");
    if (this.checkedTasks.length) {
      try {
        this.nuxeo.exec("TASK_CANCELLATION", {
          body: {
            params: {taskID: listText,},
            context: {}
          }
        }).subscribe((data: any) => {
          this.toastr.showToast("Success", "Operation was successfully executed.", "Task Cancellation");
          this.checkedTasks = [];
          this.fetchTasks();
        })
      } catch (e: any) {
        this.toastr.showToast("Danger", "The request was aborted", "Task Cancellation")
        console.log(e)
      }
    }
  }
  
  execDelegation() {
    if (this.checkedTasks.length) {
      this.toastr.showToast("Info", "This is a test", "Test");
    }
  }
  
  handleDueDate(_dueDate: Date) {
    const dueDateTime = _dueDate.getTime();
    const nowTime = new Date().getTime();
    const diffTime = dueDateTime - nowTime;
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
    let result = "";
    
    switch (true) {
      case (diffDays >= 3):
        result = "success";
        break;
      case (diffDays < 3 && diffDays > 0):
        result = "warning";
        break;
      case (diffDays <= 0):
        result = "danger";
        break;
    }
    
    this.dueDays = diffDays;
    
    return result;
  }
  
  handleCheckedItem(itemId: string) {
    if (this.checkedTasks.includes(itemId)) {
      this.checkedTasks = this.checkedTasks.filter((_itemId) => _itemId !== itemId);
    } else {
      this.checkedTasks.push(itemId);
    }
  }
  
  handleSearch() {
    const searchValue = this.formGroup.value?.search as string;
    const regex = new RegExp(searchValue, "i");
    
    if (searchValue.length > 3) {
      const data = this.taskList.map((task) => {
        return task.name.match(regex)?.length && task;
      })
      if (data.length) this.taskList = data as TaskType[];
      else this.taskList = [] as TaskType[];
    } else {
      this.taskList = this.currentTaskList;
    }
  }
}