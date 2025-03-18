import {CommonModule} from '@angular/common';
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NgxPaginationModule} from 'ngx-pagination';
import {
  ElasticSearchAuditInterface,
  ElasticSearchAuditResultInterface,
} from '../../../interfaces/types';
import {ChartConfiguration} from 'chart.js';
import {NgChartsModule} from "ng2-charts";

/**
 * Component for desync tab from ElasticSearch indexes
 */
@Component({
  selector: 'app-desync-tab',
  imports: [NgxPaginationModule, CommonModule, NgChartsModule],
  templateUrl: './desync.component.html',
  styleUrls: ['./desync.component.scss'],
  standalone: true,
})
export class DesyncTabComponent implements OnChanges {
  // Input
  @Input({required: true}) $data: ElasticSearchAuditInterface | undefined;
  
  // Variables
  repository: ElasticSearchAuditResultInterface = {} as ElasticSearchAuditResultInterface;
  elasticSearch: ElasticSearchAuditResultInterface = {} as ElasticSearchAuditResultInterface;
  timeChartData: ChartConfiguration<'bar'>['data'] = {} as ChartConfiguration<'bar'>['data'];
  resultsChartData: ChartConfiguration<'bar'>['data'] = {} as ChartConfiguration<'bar'>['data'];
  currentPage = 1;
  query = "";
  
  ngOnChanges() {
    if (this.$data) {
      this.loadData();
      this.setupChartData();
    }
  }
  
  /**
   * Fetch indexes from Repository and ElasticSearch
   */
  loadData() {
    this.repository = this.$data?.repoSearch as ElasticSearchAuditResultInterface;
    this.elasticSearch = this.$data?.elasticSearch as ElasticSearchAuditResultInterface;
    this.query = this.$data?.query ? this.$data.query : "";
  }
  
  
  /**
   * Set up data for chart
   *
   * This function will generate the data for two bar charts. The first chart
   * will display the time it took for each index to be searched, in milliseconds.
   * The second chart will display the number of indexes found in each search.
   *
   */
  setupChartData() {
    this.timeChartData = {
      labels: ['In millisecond (ms)'],
      datasets: [
        {
          data: [this.repository.took],
          label: 'Repository Search',
          backgroundColor: '#086bff',
        },
        {
          data: [this.elasticSearch.took],
          label: 'ElasticSearch',
          backgroundColor: '#44c0b2',
        },
      ],
    };
    this.resultsChartData = {
      labels: ['Number of indexes'],
      datasets: [
        {
          label: 'Repository Search',
          data: [this.repository.resultsCount],
          backgroundColor: '#086bff',
        },
        {
          label: 'ElasticSearch',
          data: [this.elasticSearch.resultsCount],
          backgroundColor: '#44c0b2',
        },
      ],
    };
  }
}
