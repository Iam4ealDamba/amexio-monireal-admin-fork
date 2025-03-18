import {Component, OnInit} from '@angular/core';
import {TabsType, UserActiveSessionsResponseType, UserActivitiesResponseType} from "../../../interfaces/types";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NuxeoCliService} from "../../../services/nuxeo-cli/nuxeo.service";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {NgForOf, NgIf} from "@angular/common";
import {NgxPaginationModule} from "ngx-pagination";
import {NoDataComponent} from "../../../templates/no-data/no-data.component";
import {LoadingTemplateComponent} from "../../../templates/loading/loading.component";

@Component({
  selector: "app-monireal-user-sessions-page-component",
  templateUrl: "./user-sessions.component.html",
  styleUrls: ["./user-sessions.component.scss"],
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    NgForOf,
    NgIf,
    NgxPaginationModule,
    NoDataComponent,
    ReactiveFormsModule,
    LoadingTemplateComponent
  ]
})
export class MonirealUserSessionsPageComponent {
  // -----------------------------------
  // Variables
  // -----------------------------------
  title = "User Sessions";
  description = "Find all informations about user sessions here.";
  
  formGroup: FormGroup = new FormGroup({
    search: new FormControl("")
  });
  isLoading = true;
  currentPageNumber = 1;
  currentPage = 1;
  sessionCount = 0;
  httpRequestCount = 0;
  sessionsData: UserActiveSessionsResponseType[] = [];
  sessions: UserActiveSessionsResponseType[] = [];
  
  // -----------------------------------
  // Constructor
  // -----------------------------------
  
  constructor(private network: NuxeoCliService) {
  }
  
  // -----------------------------------
  // Functions
  // -----------------------------------
  
  ngOnInit(): void {
    this.fetchSessions();
  }
  
  fetchSessions() {
    this.network
      .exec("USER_SESSIONS")
      .subscribe((res: UserActivitiesResponseType | null | any) => {
        if (res) {
          this.sessionCount = res.activeSessionsCount;
          this.sessionsData = res.activeSessions;
          this.sessions = res.activeSessions;
          this.httpRequestCount = res.totalRequests;
          this.isLoading = false;
        }
      });
  }
  
  handleSubmitSearch() {
    const searchValue = this.formGroup.value?.search as string;
    const regex = new RegExp(searchValue, "i");
    
    if (searchValue.length > 3) {
      const data = this.sessionsData.map((session) => {
        return session.loginName.match(regex)?.length && session;
      })
      if (data.length) this.sessions = data as UserActiveSessionsResponseType[];
      else this.sessions = [] as UserActiveSessionsResponseType[];
    } else {
      this.sessions = this.sessionsData;
    }
  }
  
  handleDateFormat(dateTime: number) {
    const date = new Date(dateTime);
    const str =
      date.toLocaleDateString() + "-" + date.toLocaleTimeString().slice(0, -3);
    return str;
  }
}
