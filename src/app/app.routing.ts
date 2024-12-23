import { Routes, RouterModule, PreloadAllModules  } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { ErrorComponent } from './pages/errors/error/error.component';
import {StationsComponent} from './modules/stations/stations.component';
import {StationStatusComponent} from './modules/station-status/station-status.component';
import {UsersComponent} from "./modules/users/users.component";
import {PermissionsComponent} from "./modules/permissions/permissions.component";
import {RolesComponent} from "./modules/roles/roles.component";

export const routes: Routes = [
    {
        path: '',
        component: PagesComponent, children: [
            { path: '', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule), data: { breadcrumb: 'Dashboard' } },
            {
                path: 'stations',
                component: StationsComponent, // Specify the default component here
                data: { breadcrumb: 'Stations' },
            },
            {
                path: 'station-status',
                component: StationStatusComponent, // Specify the default component here
                data: { breadcrumb: 'Station Status' },
            },
            {
                path: 'users',
                component: UsersComponent, // Specify the default component here
                data: { breadcrumb: 'Users' },
            },
            {
                path: 'roles',
                component: RolesComponent, // Specify the default component here
                data: { breadcrumb: 'Roles' },
            },
            {
                path: 'permissions',
                component: PermissionsComponent, // Specify the default component here
                data: { breadcrumb: 'Permissions' },
            },
            // tslint:disable-next-line:max-line-length
            // { path: 'stations', loadChildren: () => import('./modules/modules.module').then(m => m.ModulesModule), data: { breadcrumb: 'Stations' } },
            // tslint:disable-next-line:max-line-length
            // { path: '', loadChildren: () => import('./modules/modules.module').then(m => m.ModulesModule), data: { breadcrumb: 'Dashboard' } },
            // tslint:disable-next-line:max-line-length
            // { path: '', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule), data: { breadcrumb: 'Dashboard' } },
            // // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:max-line-length
            // { path: 'users', loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule), data: { breadcrumb: 'Users' } },
            // { path: 'ui', loadChildren: () => import('./pages/ui/ui.module').then(m => m.UiModule), data: { breadcrumb: 'UI' } },
            // // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:max-line-length
            // { path: 'form-controls', loadChildren: () => import('./pages/form-controls/form-controls.module').then(m => m.FormControlsModule), data: { breadcrumb: 'Form Controls' } },
            // tslint:disable-next-line:max-line-length
            // { path: 'tables', loadChildren: () => import('./pages/tables/tables.module').then(m => m.TablesModule), data: { breadcrumb: 'Tables' } },
            // { path: 'icons', loadChildren: () => import('./pages/icons/icons.module').then(m => m.IconsModule), data: { breadcrumb: 'Material Icons' } },
            // // tslint:disable-next-line:max-line-length
            // { path: 'drag-drop', loadChildren: () => import('./pages/drag-drop/drag-drop.module').then(m => m.DragDropModule), data: { breadcrumb: 'Drag & Drop' } },
            // // tslint:disable-next-line:max-line-length
            // { path: 'schedule', loadChildren: () => import('./pages/schedule/schedule.module').then(m => m.ScheduleModule), data: { breadcrumb: 'Schedule' } },
            // { path: 'mailbox', loadChildren: () => import('./pages/mailbox/mailbox.module').then(m => m.MailboxModule), data: { breadcrumb: 'Mailbox' } },
            // { path: 'chat', loadChildren: () => import('./pages/chat/chat.module').then(m => m.ChatModule), data: { breadcrumb: 'Chat' } },
            // { path: 'maps', loadChildren: () => import('./pages/maps/maps.module').then(m => m.MapsModule), data: { breadcrumb: 'Maps' } },
            // { path: 'charts', loadChildren: () => import('./pages/charts/charts.module').then(m => m.ChartsModule), data: { breadcrumb: 'Charts' } },
            // // tslint:disable-next-line:max-line-length
            // { path: 'dynamic-menu', loadChildren: () => import('./pages/dynamic-menu/dynamic-menu.module').then(m => m.DynamicMenuModule), data: { breadcrumb: 'Dynamic Menu' }  },
            // { path: 'profile', loadChildren: () => import ('./pages/profile/profile.module').then(m => m.ProfileModule), data: { breadcrumb: 'Profile' } },
            // { path: 'blank', component: BlankComponent, data: { breadcrumb: 'Blank page' } },
            // { path: 'search', component: SearchComponent, data: { breadcrumb: 'Search' } }
        ]
    },
    { path: 'landing', loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule) },
    { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
    { path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule) },
    { path: 'error', component: ErrorComponent, data: { breadcrumb: 'Error' } },
    { path: '**', component: NotFoundComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,  // <- comment this line for enable lazy load
    // useHash: true
});
