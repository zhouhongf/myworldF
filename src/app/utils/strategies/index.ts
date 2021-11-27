import {SimpleReuseStrategy} from './simple-reuse-strategy';
import {RouteReuseStrategy} from '@angular/router';
import {AppReuseStrategy} from './app-reuse-strategy';


export const SimpleRouteReuseStrategy = [
    { provide: RouteReuseStrategy, useClass: SimpleReuseStrategy }
];

export const AppRouteReuseStrategy = [
    { provide: RouteReuseStrategy, useClass: AppReuseStrategy }
];

