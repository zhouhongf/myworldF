import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './utils/guards/auth.guard';

const routes: Routes = [
    {path: '', redirectTo: 'search', pathMatch: 'full'},
    {path: 'search', loadChildren: () => import('./pages/search/search.module').then(m => m.SearchModule)},
    {path: 'wealth', loadChildren: () => import('./pages/wealth/wealth.module').then(m => m.WealthModule)},
    {path: 'text', loadChildren: () => import('./pages/text/text.module').then(m => m.TextModule)},
    {path: 'bank', loadChildren: () => import('./pages/bank/bank.module').then(m => m.BankModule)},
    {path: 'shared', loadChildren: () => import('./pages/shared/shared.module').then(m => m.SharedModule)},
    {path: 'auth', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule)},
    {path: 'show', loadChildren: () => import('./pages/show/show.module').then(m => m.ShowModule)},
    {path: 'chat', loadChildren: () => import('./pages/chat/chat.module').then(m => m.ChatModule), canLoad: [AuthGuard]},
    {path: 'sysuser', loadChildren: () => import('./pages/sysuser/sysuser.module').then(m => m.SysuserModule), canLoad: [AuthGuard]},
    {path: 'sysadmin', loadChildren: () => import('./pages/sysadmin/sysadmin.module').then(m => m.SysadminModule), canLoad: [AuthGuard]}
];

@NgModule({
    imports: [
        // RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
