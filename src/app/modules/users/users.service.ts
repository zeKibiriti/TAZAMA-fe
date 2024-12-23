import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {CustomResponse} from "../../utils/custome-responce";
import {UsersModel} from "./Users.model";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public resourceUrl = 'api/users';

  constructor(private http: HttpClient) { }
  /**
   * Query the station data
   */
  query(): Observable<UsersModel[]> {
    return this.http.get<UsersModel[]>(this.resourceUrl);
  }

  /**
   * Get all stations without pagination
   */
  // getAllRegions(): Observable<any[]> {
  //   return this.http.get<any[]>(this.regionsUrl);
  // }

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
  create(usersModel: UsersModel): Observable<CustomResponse<UsersModel>> {
    return this.http.post<CustomResponse<UsersModel>>(this.resourceUrl, usersModel);
  }

  /**
   * Update an existing station
   */
  update(usersModel: UsersModel): Observable<CustomResponse<UsersModel>> {
    const url = `${this.resourceUrl}/${usersModel.id}`; // Include the resource ID in the URL
    return this.http.patch<CustomResponse<UsersModel>>(url, usersModel);
  }

  /**
   * Get ambulances by filters (used example for ambulance API)
   */
  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
