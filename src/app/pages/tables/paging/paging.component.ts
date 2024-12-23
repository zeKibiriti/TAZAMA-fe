// import { Component, ViewChild } from '@angular/core';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatTableDataSource } from '@angular/material/table';
// import { AppSettings } from '../../../app.settings';
// import { Settings } from '../../../app.settings.model';
// import { TablesService, Element } from '../tables.service';
//
// @Component({
//   selector: 'app-paging',
//   templateUrl: './paging.component.html'
// })
// export class PagingComponent {
//   @ViewChild(MatPaginator) paginator: MatPaginator;
//   public displayedColumns = ['position', 'name', 'weight', 'symbol'];
//   public dataSource: any;
//   public settings: Settings;
//   constructor(public appSettings: AppSettings, private tablesService: TablesService) {
//     this.settings = this.appSettings.settings;
//     this.dataSource = new MatTableDataSource<Element>(this.tablesService.getData());
//   }
//
//   // tslint:disable-next-line:use-lifecycle-interface
//   ngAfterViewInit() {
//     this.dataSource.paginator = this.paginator;
//   }
//
// }
