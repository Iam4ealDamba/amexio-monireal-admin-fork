import {Component, OnInit} from '@angular/core';
import {NuxeoCliService} from '../../../services/nuxeo-cli/nuxeo.service';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ToastrCustomService} from "../../../services/toastr/toastr.service";
import {MonirealButtonComponent} from "../../../components/buttons/monireal-button/monireal-button.component";
import {ConfirmModalComponent} from "../../../components/modals/confirmation/confirm-modal.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-reindex-tab',
  imports: [
    ReactiveFormsModule,
    MonirealButtonComponent,
    ConfirmModalComponent,
    NgIf
  ],
  templateUrl: './re-index.component.html',
  styleUrls: ['./re-index.component.scss'],
  standalone: true,
})
export class ReindexTabComponent implements OnInit {
  isLoading = false;
  indexState: any = {pendingCount: 0, runningCount: 0, totalCommand: 0};
  formGroup: FormGroup = new FormGroup({
    nxql: new FormControl(''),
    docUID: new FormControl(''),
  });
  
  flushTitle = "Flush all Elasticsearch indexes";
  flushDescription = "This operation can take some times, are you sure to flush all ElasticSearch indexes ?";
  showFlushModal = false;
  
  optimizeTitle = "Optimize all Elasticsearch indexes";
  optimizeDescription = "This operation can take some times, are you sure to optimize all ElasticSearch indexes ?";
  showOptimizeModal = false;
  
  constructor(private nuxeo: NuxeoCliService, private toastr: ToastrCustomService) {
  }
  
  ngOnInit(): void {
    this.execIndexState();
  }
  
  execIndexState() {
    this.nuxeo.exec('ELASTIC_REINDEX_STATE').subscribe((res: any) => {
      this.indexState = res;
      this.isLoading = false;
    });
  }
  
  /**
   * Will execute the NXQL query for ElasticSearch re-indexation
   */
  execNXQL() {
    const search =
      (this.formGroup.get('nxql')?.value as string).length > 0
        ? this.formGroup.get('nxql')?.value
        : 'SELECT * FROM Document';
    this.nuxeo
      .exec('ELASTIC_REINDEX_NXQL', {
        body: {
          params: {
            type: 'Query',
            query: search,
          },
          context: {},
        },
      })
      .subscribe((res: any) => {
        this.toastr.showToast("Success", "Opération was successfully executed");
        this.formGroup.get('nxql')?.reset();
      });
  }
  
  /**
   * Will execute the DocID query for ElasticSearch re-indexation
   */
  execDocumentID() {
    const search =
      (this.formGroup.get('docUID')?.value as string).length > 0
        ? this.formGroup.get('docUID')?.value
        : "SELECT * FROM Document";
    
    try {
      this.nuxeo
        .exec('ELASTIC_REINDEX_NXQL', {
          body: {
            params: {
              type: 'Query',
              query: search,
            },
            context: {},
          },
        })
        .subscribe((res: any) => {
          this.toastr.showToast("Success", "Operation was successfully executed", "Re-Index DocID");
          this.formGroup.get('docUID')?.reset();
        });
    } catch (e: any) {
      this.toastr.showToast("Danger", "Operation was aborted", "Re-Index DocID");
      console.log(e);
    }
  }
  
  /**
   * Will execute the Flush query for ElasticSearch re-indexation. Be ware, it will treat a lot of data,
   * so this might take a few minutes.
   */
  execFlush(confirm: boolean) {
    if (!confirm) this.showFlushModal = false;
    else {
      this.nuxeo.exec('ELASTIC_REINDEX_FLUSH').subscribe((res: any) => {
        this.toastr.showToast("Success", "Opération was successfully executed");
      });
    }
  }
  
  /**
   * Will execute the Optimize query for ElasticSearch re-indexation. Be ware, it will treat a lot of data,
   * so this might take a few minutes.
   *
   * @param confirm
   */
  execOptimize(confirm: boolean) {
    if (!confirm) this.showOptimizeModal = false;
    else {
      this.nuxeo.exec('ELASTIC_REINDEX_OPTIMIZE').subscribe((res: any) => {
        this.toastr.showToast("Success", "Opération was successfully executed");
      });
    }
  }
}
