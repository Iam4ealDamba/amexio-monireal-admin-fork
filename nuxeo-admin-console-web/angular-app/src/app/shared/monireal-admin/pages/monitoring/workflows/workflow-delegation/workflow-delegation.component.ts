import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgIcon} from "@ng-icons/core";
import {NuxeoCliService} from "../../../../services/nuxeo-cli/nuxeo.service";
import {CommonModule, NgIf} from "@angular/common";
import {ToastrCustomService} from "../../../../services/toastr/toastr.service";

@Component({
  selector: "app-workflow-delegation-modal",
  templateUrl: "workflow-delegation.component.html",
  styleUrls: ["workflow-delegation.component.scss"],
  imports: [
    CommonModule,
    FormsModule,
    NgIcon,
    NgIf,
    ReactiveFormsModule
  ],
  standalone: true
})
export class WorkflowDelegationModalComponent implements OnInit {
  //
  // Variables
  //
  searchUsers: string[] = [];
  userList: string[] = [];
  
  //
  // Form Variable
  //
  userSearchGroup: FormGroup = new FormGroup({
    search: new FormControl(""),
  })
  
  //
  // Events
  //
  @Input({required: true}) $nuxeo!: NuxeoCliService;
  @Input({required: true}) $taskList!: string[];
  @Input() $showModal = false;
  @Output() emitShowModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  //
  // Controller
  //
  constructor(private toastr: ToastrCustomService) {
  }
  
  
  ngOnInit() {
    this.userSearchGroup.controls["search"].valueChanges.subscribe(value => {
      if (value.length >= 3) {
        this.handleSearchUsersByName()
      } else {
        this.searchUsers = [];
      }
    })
  }
  
  
  //
  // Functions
  //
  handleReturn() {
    this.emitShowModal.emit(false);
  }
  
  handleDelegation() {
    for (const task of this.$taskList) {
      let query = `/${task}/delegate?`;
      for (const user of this.userList) {
        query += `delegatedActors=${user}&`;
      }
      
      try {
        this.$nuxeo.exec("WORKFLOWS_DELEGATION", {
          query: query,
          body: {
            params: {},
            context: {}
          }
        }).subscribe((data: any) => {
          this.toastr.showToast("Success", "Operation was successfully executed.", "Delegation");
          this.userList = [];
          this.emitShowModal.emit(false);
        });
      } catch (e: any) {
        this.toastr.showToast("Danger", "The request was aborted", "Delegation");
      }
    }
  }
  
  handleSearchUsersByName() {
    const canBeSearch = this.searchUsers.filter((occ) => occ === this.userSearchGroup.value?.search);
    
    if (!canBeSearch.length) {
      const query = `?q=${this.userSearchGroup.value?.search}&currentPageIndex=0`;
      this.$nuxeo.exec("USER_SEARCH", {query}).subscribe((data: any) => {
        
        if (data.entries.length) {
          for (const item of data.entries) {
            const occ = this.searchUsers.find((username) => username === item.id);
            
            if (!occ) {
              this.searchUsers.push(item.id);
            }
          }
        } else {
          this.searchUsers = [];
        }
      });
    }
  }
  
  handleAddUser(username: string) {
    const occ = this.userList.find((user) => user === username);
    
    if (!occ) {
      this.userList.push(username);
      this.userSearchGroup.reset({
        search: ""
      });
      
    }
  }
  
  handleRemoveUser(username: string) {
    const occ = this.userList.find((user) => user === username);
    
    if (occ) {
      this.userList = this.userList.filter((user) => user !== username);
    }
  }
}