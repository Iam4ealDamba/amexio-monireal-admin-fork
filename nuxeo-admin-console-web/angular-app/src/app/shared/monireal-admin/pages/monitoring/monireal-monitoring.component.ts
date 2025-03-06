import {Component, OnInit} from "@angular/core";
import {ProbeObjResponseType, TabsType} from "../../interfaces/types";
import {NuxeoCliService} from "../../services/nuxeo-cli/nuxeo.service";
import {MonitoringWorkflowsTabComponent} from "./workflows/monitoring-workflows-tab.component";
import {CommonModule} from "@angular/common";
import {MonirealTabsListComponent} from "../../components/tabs-list/tabs-list.component";

@Component({
  selector: "moni-real-user-activity-page",
  templateUrl: "./monireal-monitoring.component.html",
  styleUrls: ["./monireal-monitoring.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    MonitoringWorkflowsTabComponent,
    MonirealTabsListComponent
  ],
  providers: [NuxeoCliService]
})
export class MonirealMonitoringPageComponent implements OnInit {
  // Variables
  tabs: TabsType[] = [
    {id: 1, name: 'Workflows', active: false},
  ];
  currentTab = 1;
  isLoading = true;
  actualDate = new Date().getMilliseconds();
  
  /**
   * Constructor of Monitoring Page Component
   */
  constructor(private nuxeo: NuxeoCliService) {
  }
  
  ngOnInit(): void {
    this.fetchData();
  }
  
  // Functions
  handleSelectedTab(e: number) {
    this.currentTab = e;
  }
  
  fetchData() {
    this.isLoading = false;
  }
}
