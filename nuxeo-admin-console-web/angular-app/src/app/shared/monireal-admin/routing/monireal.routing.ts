import { Route } from "@angular/router";

export const monirealRoutes: Route[] = [
  {
    path: "user-activities",
    loadComponent: () =>
      import(
        "../pages/user-activity/monireal-user-activity.component"
      ).then((m) => m.MonirealUserActivityPageComponent),
  },
  {
    path: "monitoring",
    loadComponent: () =>
      import(
        "../pages/monitoring/monireal-monitoring.component"
      ).then((m) => m.MonirealMonitoringPageComponent),
  },
  {
    path: "elasticsearch",
    loadComponent: () =>
      import(
        "../pages/elasticsearch/monireal-elasticsearch.component"
      ).then((m) => m.MonirealElasticSearchPageComponent),
  },
];
