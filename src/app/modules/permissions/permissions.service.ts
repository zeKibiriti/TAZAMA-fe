import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {CustomResponse} from "../../utils/custome-responce";
import {PermissionsModel} from "./Permissions.model";

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  public resourceUrl = 'api/permissions';

  constructor(private http: HttpClient) { }
  /**
   * Query the station data
   */
  query(): Observable<PermissionsModel[]> {
    return this.http.get<PermissionsModel[]>(this.resourceUrl);
  }

  /**
   * Get all stations without pagination
   */
  reduce(): Observable<PermissionsModel[]> {
    return this.http.get<PermissionsModel[]>(this.resourceUrl);
  }

  /**
   * Get all stations with optional pagination
   */
  getAll(page: number = 1, size: number = 10): Observable<any> {
    const params = new HttpParams()
        .set('page', `${page}`)
        .set('size', `${size}`);
    return this.http.get<any>(this.resourceUrl, { params });
  }

  /**
   * Create a new station
   */
  create(permissionsModel: PermissionsModel): Observable<CustomResponse<PermissionsModel>> {
    return this.http.post<CustomResponse<PermissionsModel>>(this.resourceUrl, permissionsModel);
  }

  /**
   * Update an existing station
   */
  update(permissionsModel: PermissionsModel): Observable<CustomResponse<PermissionsModel>> {
    const url = `${this.resourceUrl}/${permissionsModel.id}`; // Include the resource ID in the URL
    return this.http.patch<CustomResponse<PermissionsModel>>(url, permissionsModel);
  }

  /**
   * Get ambulances by filters (used example for ambulance API)
   */
  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
