import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StationLogModel} from './Station-Log.model';
import {CustomResponse} from "../../utils/custome-responce";

@Injectable({
  providedIn: 'root'
})
export class StationLogService {
  public resourceUrl = "api/station-log";

  constructor(
    public http: HttpClient,
    // private notificationService: NotificationService
  ) { }

  query(): Observable<StationLogModel[]> {
    return this.http.get<StationLogModel[]>(this.resourceUrl);
  }
  getAllUnPaged(): Observable<StationLogModel[]> {
    return this.http.get<any>(this.resourceUrl);
  }
  getAll(): Observable<any> {
    return this.http.get<any>(this.resourceUrl, {
      // params: {
      //   page: `${page}`,
      //   size: `${size}`,
      // },
    });
  }

  // getAllPaged(req?: any): Observable<HttpResponse<StationStatusModel[]>> {
  //   const options = createRequestOption(req);
  //   return this.http.get<StationStatusModel[]>(this.resourceUrl, {
  //     params: options,
  //     observe: 'response',
  //   });
  // }
  all(): Observable<any> {
    return this.http.get<any>(`${this.resourceUrl}`);
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }
}
