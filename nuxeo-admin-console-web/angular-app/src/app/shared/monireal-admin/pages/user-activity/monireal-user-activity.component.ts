import {CommonModule} from "@angular/common";
import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {NgxPaginationModule} from "ngx-pagination";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {NuxeoCliService} from "../../services/nuxeo-cli/nuxeo.service";
import {
  TabsType,
  UserActiveSessionsResponseType,
  UserActivitiesResponseType,
} from "../../interfaces/types";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {provideIcons, NgIcon} from "@ng-icons/core";
import {heroTrash} from "@ng-icons/heroicons/outline";
import {heroPaperAirplaneSolid} from "@ng-icons/heroicons/solid";
import {NoDataComponent} from "../../templates/no-data/no-data.component";
import {MonirealTabsListComponent} from "../../components/tabs-list/tabs-list.component";
import {MonitoringWorkflowsTabComponent} from "../monitoring/workflows/monitoring-workflows-tab.component";
import {MonirealUserSessionsPageComponent} from "./user-sessions/user-sessions.component";


@Component({
  selector: "app-user-activities",
  templateUrl: "./monireal-user-activity.component.html",
  styleUrls: ["./monireal-user-activity.component.scss"],
  imports: [CommonModule, NgxPaginationModule, MatIconModule, MatProgressSpinnerModule, ReactiveFormsModule, NgIcon, NoDataComponent, MonirealTabsListComponent, MonitoringWorkflowsTabComponent, MonirealUserSessionsPageComponent],
  providers: [Router, NuxeoCliService],
  viewProviders: [provideIcons({heroTrash, heroPaperAirplaneSolid})],
  standalone: true,
})
export class MonirealUserActivityPageComponent {
  //
  // Variables
  //
  tabs: TabsType[] = [
    {
      id: 1,
      name: "User Sessions",
      active: true
    },
  ]
  currentTab = 1;
  
  //
  // Constructor
  //
  constructor(private network: NuxeoCliService) {
  }
  
  //
  // Functions
  //
  
  handleSelectedTab(index: number) {
    this.currentTab = index;
  }
}
