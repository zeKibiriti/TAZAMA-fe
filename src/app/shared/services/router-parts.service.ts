import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Params} from '@angular/router';

interface IRoutePart {
  title: string;
  breadcrumb: string;
  params?: Params;
  url: string;
  urlSegments: any[];
}

@Injectable({
  providedIn: 'root'
})
export class RouterPartsService {

  private routeParts: IRoutePart[] | undefined;

  constructor() {}

  generateRouteParts(snapshot: ActivatedRouteSnapshot): IRoutePart[] {
    // this.routeParts = <IRoutePart[]>[];
    this.routeParts = [];
    if (snapshot) {
      if (snapshot.firstChild) {
        this.routeParts = this.routeParts.concat(
          this.generateRouteParts(snapshot.firstChild)
        );
      }
      if (snapshot.data['title'] && snapshot.url.length) {
        // console.log(snapshot.data['title'], snapshot.url)
        this.routeParts.push({
          title: snapshot.data['title'],
          breadcrumb: snapshot.data['breadcrumb'],
          url: snapshot.url[0].path,
          urlSegments: snapshot.url,
          params: snapshot.params,
        });
      }
    }
    return this.routeParts;
  }

}
