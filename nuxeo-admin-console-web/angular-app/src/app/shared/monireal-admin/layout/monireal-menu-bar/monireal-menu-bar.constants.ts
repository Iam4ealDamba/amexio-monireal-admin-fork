import {MONIREAL_ROUTE_ROOT} from "../../constants/nuxeo.constants";

export interface MoniMenu {
  id: number;
  name: string;
  path: string | null;
  isSelected: boolean;
}

export const MONI_ADMIN_MENU: MoniMenu[] = [
  {
    id: 0,
    name: "User Activities",
    path: MONIREAL_ROUTE_ROOT + "user-activities",
    isSelected: false,
  },
  {
    id: 1,
    name: "Monitoring",
    path: MONIREAL_ROUTE_ROOT + "monitoring",
    isSelected: false,
  },
  {
    id: 2,
    name: "ElasticSearch",
    path: MONIREAL_ROUTE_ROOT + "elasticsearch",
    isSelected: false,
  },
];

export const MONI_ROUTES_TITLE = {
  ELASTICSEARCH: "ElasticSearch",
  MONITORING: "Monitoring",
  USER_ACTIVITY: "User Activities",
};
