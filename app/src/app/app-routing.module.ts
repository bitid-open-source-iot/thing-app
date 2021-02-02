import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'logs',
        loadChildren: () => import('./pages/logs/logs.module').then(m => m.LogsModule)
    },
    {
        path: '**',
        redirectTo: 'logs'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
