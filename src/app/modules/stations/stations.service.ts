import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StationsModel } from './Stations.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import {CustomResponse} from '../../utils/custome-responce';

@Injectable({
  providedIn: 'root',
})
export class StationsService {

  public resourceUrl = 'api/stations';
  public stationsUrl = 'api/stations';
  public regionsUrl = 'api/regions';

  constructor(private http: HttpClient) { }
  /**
   * Query the station data
   */
  query(): Observable<StationsModel[]> {
    return this.http.get<StationsModel[]>(this.resourceUrl);
  }

  /**
   * Get all stations without pagination
   */
  getAllRegions(): Observable<any[]> {
    return this.http.get<any[]>(this.regionsUrl);
  }

  getAllStations(): Observable<any[]> {
    return this.http.get<any[]>(this.stationsUrl);
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
  create(stationsModel: StationsModel): Observable<CustomResponse<StationsModel>> {
    return this.http.post<CustomResponse<StationsModel>>(this.resourceUrl, stationsModel);
  }

  /**
   * Update an existing station
   */
  update(stationsModel: StationsModel): Observable<CustomResponse<StationsModel>> {
    const url = `${this.resourceUrl}/${stationsModel.id}`; // Include the resource ID in the URL
    return this.http.patch<CustomResponse<StationsModel>>(url, stationsModel);
  }

  /**
   * Get ambulances by filters (used example for ambulance API)
   */
  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
