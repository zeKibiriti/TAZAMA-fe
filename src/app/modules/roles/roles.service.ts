import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {CustomResponse} from "../../utils/custome-responce";
import {RolesModel} from "./Roles.model";

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  public resourceUrl = 'api/roles';

  constructor(private http: HttpClient) { }
  /**
   * Query the station data
   */
  query(): Observable<RolesModel[]> {
    return this.http.get<RolesModel[]>(this.resourceUrl);
  }

  /**
   * Get all stations without pagination
   */
  getAllUnPaged(): Observable<RolesModel[]> {
    return this.http.get<RolesModel[]>(this.resourceUrl);
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
  create(rolesModel: RolesModel): Observable<CustomResponse<RolesModel>> {
    return this.http.post<CustomResponse<RolesModel>>(this.resourceUrl, rolesModel);
  }

  /**
   * Update an existing station
   */
  update(rolesModel: RolesModel): Observable<CustomResponse<RolesModel>> {
    const url = `${this.resourceUrl}/${rolesModel.id}`; // Include the resource ID in the URL
    return this.http.patch<CustomResponse<RolesModel>>(url, rolesModel);
  }

  /**
   * Get ambulances by filters (used example for ambulance API)
   */
  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
