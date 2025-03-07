// ----------------------------
// APPLICATION
// ----------------------------

export type ToastrLevelType = "Info" | "Success" | "Warning" | "Danger";

export type URLType = string | null;

export type TaskType = {
  path: string;
  creator: string;
  name: string;
  modified: Date;
  dueDate: Date;
  id: string;
  state: string;
  repository: string;
  type: string;
  directive: string;
};

export type UserInterface = {
  id?: string;
  properties?: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    company: string;
    groups: string[];
  };
  isAdministrator?: boolean;
  _rest?: string;
  _base?: string;
};

export type AuthStateInterface = {
  currentUser: UserInterface | null;
};

export type EndpointConfigInterface = {
  headers?: object;
  query?: string;
  params?: object;
  body?: {
    params: object;
    context: object;
  };
};

export type EndpointName = {
  DOCUMENT_DETAIL: "DOCUMENT_DETAIL";
  PROBES: 'PROBES';
  LOGOUT: 'LOGOUT';
  USER_SESSIONS: 'USER_SESSIONS';
  USER_EVENTS: 'USER_EVENTS';
  USER_SEARCH: " USER_SEARCH";
  AUTH_CURRENT: 'AUTH_CURRENT';
  WORKFLOWS: 'WORKFLOWS';
  WORKFLOWS_DELEGATION: "WORKFLOWS_DELEGATION";
  TASK_CANCELLATION: "TASK_CANCELLATION",
  ELASTIC_REINDEX_STATE: 'ELASTIC_REINDEX_STATE';
  ELASTIC_AUDIT: 'ELASTIC_AUDIT';
  ELASTIC_REINDEX_NXQL: 'ELASTIC_REINDEX_NXQL';
  ELASTIC_REINDEX_DOCUMENT: 'ELASTIC_REINDEX_DOCUMENT';
  ELASTIC_REINDEX_FLUSH: 'ELASTIC_REINDEX_FLUSH';
  ELASTIC_REINDEX_OPTIMIZE: 'ELASTIC_REINDEX_OPTIMIZE';
};
export type TabsType = {
  id: number;
  name: string;
  active: boolean;
};

export type ChartDataInterface = {
  labels: string[];
  datasets: {
    label: string;
    data: any[];
    backgroundColor: string[];
    hoverOffset: number;
  }[];
};

export type ElasticSearchAuditResultInterface = {
  took: number;
  resultsCount: number;
  pageProvider: string;
  resultsCountLimit: number;
  results: string[];
};


// ----------------------------
// RESPONSE
// ----------------------------

export type UserActivitiesResponseType = {
  activeSessionsCount: number;
  activeSessions: UserActiveSessionsResponseType[];
  totalRequests: number;
};

export type UserActiveSessionsResponseType = {
  accessedPagesCount: number;
  lastAccessTime: number;
  creationTime: number;
  lastAccessDate: string;
  inactivityAsString: string;
  loginName: string;
  durationInS: number;
  sessionId: string;
  durationAsString: string;
  lastAccessUrl: string;
  inactivityInS: number;
};

export type ProbeObjResponseType = {
  runnedCount: number;
  succeedCount: number;
  failedCount: number;
  lastDuration: number;
  name: string;
  lastSucceedDate: null | string;
  lastRunnedDate: null | string;
  lastFailedDate: null | string;
  status: {
    success: boolean;
    info: string;
  };
};

export type ElasticSearchAuditInterface = {
  repoSearch: {
    took: number;
    resultsCount: number;
    pageProvider: string;
    resultsCountLimit: number;
    results: string[];
  };
  elasticSearch: {
    took: number;
    resultsCount: number;
    pageProvider: string;
    resultsCountLimit: number;
    results: string[];
  };
  query: string;
  desyncDocsResults: string[];
};

export type DocumentDetailType = {
  path: string,
  creator: string,
  created: number,
  modified: number,
  id: string,
  state: string,
  contributors: string[],
  type: string,
  title: string,
  repository: string
}