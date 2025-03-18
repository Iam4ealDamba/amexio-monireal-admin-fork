import {Injectable} from "@angular/core";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Nuxeo from "nuxeo";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {
  EndpointConfigInterface,
  UserInterface,
  EndpointName,
} from "../../interfaces/types";
import {REST_ENDPOINTS} from "../../constants/nuxeo.constants";
import {URLType} from "../../interfaces/types"
import {environment} from "../../../../../environments/environment.development";

/**
 * Create the Nuxeo Client Service
 */
@Injectable()
export class NuxeoCliService {
  private _instance: Nuxeo = {};
  
  /**
   * Constructor of Nuxeo Client Service
   */
  constructor(private http: HttpClient) {
    this.initiateNuxeoInstance();
  }
  
  private initiateNuxeoInstance() {
    if (!environment.production) {
      this._instance = new Nuxeo({
        baseURL: environment.apiUrl
      });
    } else {
      this._instance = new Nuxeo({
        baseURL: location.origin
      });
    }
  }
  
  private _removeSlashFromURL(url: URLType): URLType {
    return url?.endsWith('/') ? url?.slice(0, -1) : url;
  }
  
  private getEndpoint(type: string, endpoint: string): string {
    let url = "";
    if (type === "base") {
      url = this._removeSlashFromURL(this._instance["_baseURL"]) + "/nuxeo/site/automation";
      return url + endpoint;
    }
    
    url = this._removeSlashFromURL(this._instance["_restURL"].slice(0, -8)) + "/nuxeo/api/v1"
    return url + endpoint;
  }
  
  exec<T>(endpoint: keyof EndpointName, conf?: EndpointConfigInterface) {
    let query = "";
    const op = REST_ENDPOINTS[endpoint];
    const url = this.getEndpoint(op.urlType, op.endpoint);
    const params: HttpParams = new HttpParams();
    const headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      "X-NXproperties": "*",
    });
    const body = {query: "", params: {}, context: {}};
    
    // Fill the body, if exists
    if (conf?.body) {
      body.params = conf.body.params;
      body.context = conf.body.context;
    }
    
    // Fill the headers
    if (conf?.headers) {
      for (const [key, value] of Object.entries(conf.headers)) {
        headers.append(key, value);
      }
    }
    
    // Fill the params
    if (conf?.params) {
      for (const [key, value] of Object.entries(conf?.params)) {
        params.append(key, value);
      }
    }
    
    if (conf?.query) {
      query = conf?.query;
    }
    
    switch (op.method) {
      case "GET":
        headers;
        return this.http.get<T>(url + query, {
          headers: headers,
          params: params,
        });
      case "POST":
        return this.http.post<T>(url + query, body, {
          headers: headers,
          params: params,
        });
      case "PUT":
        return this.http.put<T>(url + query, body, {
          headers: headers,
          params: params,
        });
      case "DELETE":
        return this.http.delete<T>(url + query, {
          headers: headers,
          params: params,
        });
      default:
        throw new Error(`Method not supported : ${op.method}}`);
    }
  }
}
