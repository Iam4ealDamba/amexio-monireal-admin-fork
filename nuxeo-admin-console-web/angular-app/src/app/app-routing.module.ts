import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { ROUTES_TITLE } from "./layouts/menu-bar/menu-bar.constants";
import { monirealRoutes } from "./shared/monireal-admin/routing/monireal.routing";

const routeTitle = ROUTES_TITLE;
export const appRoutes: Route[] = [
  {
    path: "",
    title: routeTitle.HOME,
    loadChildren: () =>
      import("./features/home/home.module").then((m) => m.HomeModule),
  },
  {
    path: "elasticsearch-reindex",
    loadChildren: () =>
      import(
        "./features/sub-features/generic-multi-feature-layout/generic-multi-feature-layout.module"
      ).then((m) => m.GenericMultiFeatureLayoutModule),
  },
  {
    path: "video-renditions-generation",
    loadChildren: () =>
      import(
        "./features/sub-features/generic-multi-feature-layout/generic-multi-feature-layout.module"
      ).then((m) => m.GenericMultiFeatureLayoutModule),
  },
  {
    path: "bulk-action-monitoring",
    title: routeTitle.BULKACTIONMONITORING,
    loadChildren: () =>
      import(
        "./features/bulk-action-monitoring/bulk-action-monitoring.module"
      ).then((m) => m.BulkActionMonitoringModule),
  },
  {
    path: "probes",
    title: routeTitle.PROBES,
    loadChildren: () =>
      import("./features/probes/probes.module").then((m) => m.ProbesModule),
  },
  {
    path: "thumbnail-generation",
    title: routeTitle.THUMBNAIL_GENERATION,
    loadChildren: () =>
      import(
        "./features/sub-features/generic-multi-feature-layout/generic-multi-feature-layout.module"
      ).then((m) => m.GenericMultiFeatureLayoutModule),
  },
  {
    path: "picture-renditions",
    loadChildren: () =>
      import(
        "./features/sub-features/generic-multi-feature-layout/generic-multi-feature-layout.module"
      ).then((m) => m.GenericMultiFeatureLayoutModule),
  },
  {
    path: "fulltext-reindex",
    loadChildren: () =>
      import(
        "./features/sub-features/generic-multi-feature-layout/generic-multi-feature-layout.module"
      ).then((m) => m.GenericMultiFeatureLayoutModule),
  },
  // This is required for the monireal module
  ...monirealRoutes,
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
