import {CommonModule} from '@angular/common';
import {Component, Input} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgIcon} from "@ng-icons/core";
import {DocumentDetailTemplateComponent} from "../../../templates/document-detail/document-detail.component";
import {MonirealButtonComponent} from "../../../components/buttons/monireal-button/monireal-button.component";

@Component({
  selector: 'app-repo-tab',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgIcon,
    DocumentDetailTemplateComponent,
    MonirealButtonComponent,
  ],
  templateUrl: './repo-index.component.html',
  styleUrls: ['./repo-index.component.scss'],
  standalone: true,
})
export class RepoIndexTabComponent {
  //
  // Variables
  //
  title = "Repository Indexes";
  description = "Paginate through all the document index from the repository";
  isDocumentDetailSelected: string | null = null;
  results: string[] = [];
  resultBySearch: string[] = [];
  currentPage = 1;
  search = '';
  formGroup = new FormGroup({
    search: new FormControl(''),
  });
  
  //
  // Events
  //
  @Input() data: any;

  //
  // Functions
  //
  ngOnInit() {
    this.results = this.data;
  }
  
  pageChanged(page: number) {
    this.currentPage = page;
  }
  
  onSearch() {
    const search = this.formGroup.get('search')?.value;
    if (search && search.length >= 3) {
      this.results = (this.data as string[]).filter((x) =>
        x.match(RegExp(search))
      );
    } else {
      this.results = this.data;
    }
  }
  
  handleDocumentDetailClose(e: boolean) {
    if (e === false) {
      this.isDocumentDetailSelected = null;
    }
  }
}
