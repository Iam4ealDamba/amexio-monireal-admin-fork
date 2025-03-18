import {Route} from "@angular/router";
import {MONIREAL_ROUTE_ROOT} from "../constants/nuxeo.constants";

export const monirealRoutes: Route[] = [
  {
    path: MONIREAL_ROUTE_ROOT + "user-activities",
    loadComponent: () =>
      import(
        "../pages/user-activity/monireal-user-activity.component"
        ).then((m) => m.MonirealUserActivityPageComponent),
  },
  {
    path: MONIREAL_ROUTE_ROOT + "monitoring",
    loadComponent: () =>
      import(
        "../pages/monitoring/monireal-monitoring.component"
        ).then((m) => m.MonirealMonitoringPageComponent),
  },
  {
    path: MONIREAL_ROUTE_ROOT + "elasticsearch",
    loadComponent: () =>
      import(
        "../pages/elasticsearch/monireal-elasticsearch.component"
        ).then((m) => m.MonirealElasticSearchPageComponent),
  },
];
