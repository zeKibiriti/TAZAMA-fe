import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomResponse} from '../../utils/custome-responce';
import {StatusModel} from './Station-status.model';

@Injectable({
  providedIn: 'root'
})
export class StationStatusService {

  public resourceUrl = 'api/station-status';

  constructor(private http: HttpClient) { }
  /**
   * Query the station data
   */
  query(): Observable<StatusModel[]> {
    return this.http.get<StatusModel[]>(this.resourceUrl);
  }

  /**
   * Get all stations without pagination
   */
  getAllUnPaged(): Observable<StatusModel[]> {
    return this.http.get<StatusModel[]>(this.resourceUrl);
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
  create(statusModel: StatusModel): Observable<CustomResponse<StatusModel>> {
    return this.http.post<CustomResponse<StatusModel>>(this.resourceUrl, statusModel);
  }

  /**
   * Update an existing station
   */
  update(statusModel: StatusModel): Observable<CustomResponse<StatusModel>> {
    const url = `${this.resourceUrl}/${statusModel.id}`; // Include the resource ID in the URL
    return this.http.patch<CustomResponse<StatusModel>>(url, statusModel);
  }

  /**
   * Get ambulances by filters (used example for ambulance API)
   */
  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
