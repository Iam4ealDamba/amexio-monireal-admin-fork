import {IconDefaultComponent} from "./icons/icons.default.component";
import {ToastrDefaultComponent} from "./toastr/toastr.default.component";
import {MonirealMenuBarComponent} from "../layout/monireal-menu-bar/monireal-menu-bar.component";
import {NgChartsModule} from "ng2-charts";
import {MonirealButtonComponent} from "../components/buttons/monireal-button/monireal-button.component";
import {MonirealLinkButtonComponent} from "../components/buttons/monireal-link-button/monireal-link-button.component";
import {MonirealTabsListComponent} from "../components/tabs-list/tabs-list.component";

/**
 * This module is used to import all the default modules used by AmeXio Monireal Admin project
 */
export const MonirealModuleComponent: any[] = [
  // Components
  IconDefaultComponent,
  ToastrDefaultComponent,
  MonirealMenuBarComponent,
  MonirealButtonComponent,
  MonirealLinkButtonComponent,
  MonirealTabsListComponent,
  // Modules
  NgChartsModule
]