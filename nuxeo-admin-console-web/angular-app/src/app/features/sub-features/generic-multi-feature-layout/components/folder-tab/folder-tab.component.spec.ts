import { FolderTabComponent } from "./folder-tab.component";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatTabsModule } from "@angular/material/tabs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
} from "@angular/material/dialog";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { StoreModule } from "@ngrx/store";
import { BehaviorSubject, of } from "rxjs";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import * as FeatureActions from "../../store/actions";
import { FolderActionState } from "../../store/reducers";
import { GenericMultiFeatureUtilitiesService } from "../../services/generic-multi-feature-utilities.service";
import { GenericModalComponent } from "../generic-modal/generic-modal.component";
import { ErrorDetails } from "../../generic-multi-feature-layout.interface";
import { NuxeoJSClientService } from "../../../../../shared/services/nuxeo-js-client.service";
import {
  ERROR_TYPES,
  GENERIC_LABELS,
  MODAL_DIMENSIONS,
} from "../../generic-multi-feature-layout.constants";
import { ErrorModalComponent } from "../error-modal/error-modal.component";
import { featureMap, FEATURES } from "../../generic-multi-feature-layout.mapping";
import { PICTURE_RENDITIONS_LABELS } from "../../../../pictures/pictures-renditions.constants";
import { THUMBNAIL_GENERATION_LABELS } from "../../../../thumbnail-generation/thumbnail-generation.constants";
import { FULLTEXT_REINDEX_LABELS } from "../../../../fulltext-reindex/fulltext-reindex.constants";

describe("FolderTabComponent", () => {
  let component: FolderTabComponent;
  let nuxeoJSClientService;
  let genericMultiFeatureUtilitiesService: jasmine.SpyObj<GenericMultiFeatureUtilitiesService>;
  let fixture: ComponentFixture<FolderTabComponent>;
  let store: MockStore<FolderActionState>;
  let dialogService: jasmine.SpyObj<MatDialog>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<GenericModalComponent>>;

  class GenericMultiFeatureUtilitiesServiceStub {
    pageTitle: BehaviorSubject<string> = new BehaviorSubject("");
    spinnerStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);

    secondsToHumanReadable() {
      return "";
    }

    getActiveFeature() {
      return "ELASTIC_SEARCH_REINDEX";
    }

    checkIfResponseHasError(): boolean {
      return true;
    }
    handleError(): Promise<unknown> {
     return Promise.resolve("");
    }  
  }

  beforeEach(async () => {
    const nuxeoJSClientServiceSpy = jasmine.createSpyObj(
      "NuxeoJSClientService",
      ["getNuxeoInstance"]
    );
    const initialState: FolderActionState = {
      folderActionInfo: {
        commandId: "mockCommandId",
      },
      error: null,
    };
    mockDialogRef = jasmine.createSpyObj("MatDialogRef", ["afterClosed", "afterOpened"]);
    mockDialogRef.afterClosed.and.returnValue(of({}));
    mockDialogRef.afterOpened.and.returnValue(of());
    dialogService = jasmine.createSpyObj("MatDialog", ["open"]);
    dialogService.open.and.returnValue(mockDialogRef);
    await TestBed.configureTestingModule({
      declarations: [FolderTabComponent],
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        MatTabsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        StoreModule.forRoot(provideMockStore),
      ],
      providers: [
        { provide: NuxeoJSClientService, useValue: nuxeoJSClientServiceSpy },
        {
          provide: GenericMultiFeatureUtilitiesService,
          useClass: GenericMultiFeatureUtilitiesServiceStub,
        },
        { provide: MatDialog, useValue: dialogService },
        provideMockStore({ initialState }),
      ],
    }).compileComponents();
    genericMultiFeatureUtilitiesService = TestBed.inject(
      GenericMultiFeatureUtilitiesService
    ) as jasmine.SpyObj<GenericMultiFeatureUtilitiesService>;
    fixture = TestBed.createComponent(FolderTabComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    nuxeoJSClientService = TestBed.inject(NuxeoJSClientService);
    component.inputForm = TestBed.inject(FormBuilder).group({
      inputIdentifier: [""],
    });
    nuxeoJSClientService.nuxeoInstance = {
      repository: jasmine.createSpy().and.returnValue({
        fetch: jasmine.createSpy().and.callFake((input: string) => {
          if (input === "valid-id") {
            return Promise.resolve({ uid: "1234" });
          } else if (input === "error-id") {
            return Promise.reject(new Error("Error occurred"));
          } else {
            return Promise.resolve(null);
          }
        }),
      }),
    };

    spyOn(component, "fetchNoOfDocuments");
    spyOn(genericMultiFeatureUtilitiesService, "getActiveFeature");
    fixture.detectChanges();
  });

  it("should test if component is created", () => {
    expect(component).toBeTruthy();
  });

  it("should open error dialog and handle close subscription", () => {
    const mockError: ErrorDetails = {
      type: ERROR_TYPES.INVALID_DOC_ID,
      details: { message: "Test error" },
    };

    spyOn(component, "onActionErrorModalClose");
    component.userInput = "123";
    component.showActionErrorModal(mockError);

    expect(dialogService.open).toHaveBeenCalledWith(ErrorModalComponent, {
      disableClose: true,
      hasBackdrop: true,
      height: MODAL_DIMENSIONS.HEIGHT,
      width: MODAL_DIMENSIONS.WIDTH,
      data: {
        error: mockError,
        userInput: component.userInput,
      },
    });

    expect(mockDialogRef.afterClosed).toHaveBeenCalled();
    expect(component.onActionErrorModalClose).toHaveBeenCalled();
  });

  it("should focus on the input field on modal close", () => {
    const mockElement = jasmine.createSpyObj("HTMLElement", ["focus"]);
    spyOn(document, "getElementById").and.returnValue(mockElement);

    component.onActionErrorModalClose();

    expect(document.getElementById).toHaveBeenCalledWith("inputIdentifier");
    expect(mockElement.focus).toHaveBeenCalled();
  });

  it("should open the reindex launched modal with correct data and subscribe to afterClosed", () => {
    const commandId = "test-command-id";
    const showActionLaunchedModalSpy = spyOn(
      component,
      "showActionLaunchedModal"
    ).and.callThrough();
    const onActionLaunchedModalCloseSpy = spyOn(
      component,
      "onActionLaunchedModalClose"
    ).and.callThrough();
    component.showActionLaunchedModal(commandId);
    expect(showActionLaunchedModalSpy).toHaveBeenCalledWith(commandId);
    expect(dialogService.open).toHaveBeenCalledWith(GenericModalComponent, {
      disableClose: true,
      hasBackdrop: true,
      height: MODAL_DIMENSIONS.HEIGHT,
      width: MODAL_DIMENSIONS.WIDTH,
      data: {
        type: GENERIC_LABELS.MODAL_TYPE.launched,
        title: `${GENERIC_LABELS.ACTION_LAUNCHED_MODAL_TITLE}`,
        launchedMessage: `${GENERIC_LABELS.ACTION_LAUNCHED} ${commandId}. ${GENERIC_LABELS.COPY_MONITORING_ID}`,
        commandId,
      },
    });
    expect(mockDialogRef.afterClosed).toHaveBeenCalled();
    expect(onActionLaunchedModalCloseSpy).toHaveBeenCalled();
  });

  it("should return the correct error message when inputIdentifier has a required error", () => {
    component.inputForm = new FormBuilder().group({
      inputIdentifier: ["", Validators.required],
    });

    const errorMessage = component.getErrorMessage();
    expect(errorMessage).toBe(GENERIC_LABELS.REQUIRED_DOCID_OR_PATH_ERROR);
  });

  it("should return null when inputIdentifier does not have a required error", () => {
    component.inputForm = new FormBuilder().group({
      inputIdentifier: ["some value"],
    });
    const errorMessage = component.getErrorMessage();
    expect(errorMessage).toBeNull();
  });

  it("should dispatch resetDocumentReindexState and unsubscribe from subscriptions on ngOnDestroy", () => {
    const dispatchSpy = spyOn(store, "dispatch");
    spyOn(component.folderActionLaunchedSubscription, "unsubscribe");
    spyOn(component.folderActionErrorSubscription, "unsubscribe");
    spyOn(component.confirmDialogClosedSubscription, "unsubscribe");
    spyOn(component.launchedDialogClosedSubscription, "unsubscribe");
    spyOn(component.errorDialogClosedSubscription, "unsubscribe");
    component.ngOnDestroy();
    expect(dispatchSpy).toHaveBeenCalledWith(
      FeatureActions.resetFolderActionState()
    );
    expect(
      component.folderActionLaunchedSubscription.unsubscribe
    ).toHaveBeenCalled();
    expect(
      component.folderActionErrorSubscription.unsubscribe
    ).toHaveBeenCalled();
    expect(
      component.confirmDialogClosedSubscription.unsubscribe
    ).toHaveBeenCalled();
    expect(
      component.launchedDialogClosedSubscription.unsubscribe
    ).toHaveBeenCalled();
    expect(
      component.errorDialogClosedSubscription.unsubscribe
    ).toHaveBeenCalled();
  });

  it("should open the confirmation modal with correct data and subscribe to afterClosed", () => {
    spyOn(component, "getHumanReadableTime").and.returnValue("1 second");
    const onConfirmationModalCloseSpy = spyOn(
      component,
      "onConfirmationModalClose"
    ).and.callThrough();
    component.showConfirmationModal(2);
    expect(dialogService.open).toHaveBeenCalledWith(GenericModalComponent, {
      disableClose: true,
      hasBackdrop: true,
      height: MODAL_DIMENSIONS.HEIGHT,
      width: MODAL_DIMENSIONS.WIDTH,
      data: {
        type: GENERIC_LABELS.MODAL_TYPE.confirm,
        title: `${GENERIC_LABELS.ACTION_CONFIRMATION_MODAL_TITLE}`,
        message: `${GENERIC_LABELS.ACTION_WARNING}`,
        documentCount: 2,
        timeTakenForAction: "1 second",
      },
    });
    expect(mockDialogRef.afterClosed).toHaveBeenCalled();
    expect(onConfirmationModalCloseSpy).toHaveBeenCalled();
  });

  it("should get human readable time", () => {
    const seconds = 3661;
    const humanReadableTime = "1 hour 1 minute 1 second";
    spyOn(
      genericMultiFeatureUtilitiesService,
      "secondsToHumanReadable"
    ).and.returnValue(humanReadableTime);

    const result = component.getHumanReadableTime(seconds);

    expect(
      genericMultiFeatureUtilitiesService.secondsToHumanReadable
    ).toHaveBeenCalledWith(seconds);
    expect(result).toBe(humanReadableTime);
  });
  describe('FEATURES.PICTURE_RENDITIONS', () => {
    it('should return correct labels and data for FOLDER tabType', () => {
      const result = featureMap()[FEATURES.PICTURE_RENDITIONS](GENERIC_LABELS.FOLDER);
      expect(result.labels.pageTitle).toBe(PICTURE_RENDITIONS_LABELS.FOLDER_RENDITIONS_TITLE);
      expect(result.labels.submitBtnLabel).toBe(PICTURE_RENDITIONS_LABELS.RENDITIONS_BUTTON_LABEL);
    });
  });

  describe('FEATURES.THUMBNAIL_GENERATION', () => {
    it('should return correct labels and data for FOLDER tabType', () => {
      const result = featureMap()[FEATURES.THUMBNAIL_GENERATION](GENERIC_LABELS.FOLDER);
      expect(result.labels.pageTitle).toBe(THUMBNAIL_GENERATION_LABELS.FOLDER_THUMBNAIL_GENERATION_TITLE);
      expect(result.labels.submitBtnLabel).toBe(THUMBNAIL_GENERATION_LABELS.THUMBNAIL_GENERATION_BUTTON_LABEL);
    });
  });

  describe('FEATURES.FULLTEXT_REINDEX', () => {
    it('should return correct labels and data for FOLDER tabType', () => {
      const result = featureMap()[FEATURES.FULLTEXT_REINDEX](GENERIC_LABELS.FOLDER);
      expect(result.labels.pageTitle).toBe(FULLTEXT_REINDEX_LABELS.FOLDER_REINDEX_TITLE);
      expect(result.labels.submitBtnLabel).toBe(FULLTEXT_REINDEX_LABELS.REINDEX_BUTTON_LABEL);
    });
  });
});