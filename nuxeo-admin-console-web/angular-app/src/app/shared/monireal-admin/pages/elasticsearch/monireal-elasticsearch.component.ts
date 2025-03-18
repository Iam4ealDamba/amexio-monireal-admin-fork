import {Component, OnInit} from "@angular/core";
import {ElasticSearchAuditInterface, TabsType} from "../../interfaces/types";
import {Router} from "@angular/router";
import {NuxeoCliService} from "../../services/nuxeo-cli/nuxeo.service";
import {CommonModule} from "@angular/common";
import {DesyncTabComponent} from "./desync/desync.component";
import {RepoIndexTabComponent} from "./repo-index/repo-index.component";
import {ElasticIndexTabComponent} from "./elastic-index/elastic-index.component";
import {ReindexTabComponent} from "./re-index/re-index.component";
import {MonirealTabsListComponent} from "../../components/tabs-list/tabs-list.component";
import {LoadingTemplateComponent} from "../../templates/loading/loading.component";

@Component({
  selector: "moni-real-user-activity-page",
  templateUrl: "./monireal-elasticsearch.component.html",
  styleUrls: ["./monireal-elasticsearch.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    DesyncTabComponent,
    RepoIndexTabComponent,
    ElasticIndexTabComponent,
    ReindexTabComponent,
    MonirealTabsListComponent,
    LoadingTemplateComponent
  ],
  providers: [NuxeoCliService]
})
export class MonirealElasticSearchPageComponent implements OnInit {
  // Variables
  tabs: TabsType[] = [
    {id: 1, name: 'Desync Infos', active: false},
    {id: 2, name: 'Repository Indexes', active: false},
    {id: 3, name: 'ElasticSearch Indexes', active: false},
    {id: 4, name: 'Re-Indexation', active: false},
  ];
  audit: ElasticSearchAuditInterface = {} as ElasticSearchAuditInterface;
  currentTab = 1;
  isLoading = true;
  
  constructor(private router: Router, private nuxeo: NuxeoCliService) {
  }
  
  ngOnInit(): void {
    this.fetchElasticAudit();
  }
  
  handleSelectedTab(selected: number) {
    this.currentTab = selected;
  }
  
  fetchElasticAudit() {
    this.nuxeo
      .exec('ELASTIC_AUDIT', {
        body: {
          params: {},
          context: {},
        },
      })
      .subscribe((res: any) => {
        const data = res;
        this.audit = data ? data : {} as ElasticSearchAuditInterface;
        this.isLoading = false;
      });
  }
}
