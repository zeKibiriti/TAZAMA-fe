import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  public casesAtVariousStageUrl = 'api/cases/dashboard/various_stage';
  public appealsAtVariousStageUrl = 'api/appeals/dashboard/various_stage';
  public dashboardDisciplinarySummaryUrl = 'api/cases/dashboard_disciplinary_summary';
  public formalVsSummaryCasesChartUrl = 'api/cases/formal_vs_summary_cases_count';

  constructor(protected http: HttpClient) {}

  casesAtVariousStages(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.casesAtVariousStageUrl}/${id}`
    );
  }
  appealAtVariousStages(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.appealsAtVariousStageUrl}/${id}`
    );
  }
  dashboardDisciplinarySummary(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.dashboardDisciplinarySummaryUrl}/${id}`
    );
  }
  formalVsSummaryCasesChart(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.formalVsSummaryCasesChartUrl}/${id}`
    );
  }

}
