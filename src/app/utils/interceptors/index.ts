/* "Barrel" of Http Interceptors */
import { AuthInterceptor } from './auth-interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

/*还可添加其他拦截器，通过httpInterceptorProviders这个常量统一注入到app.module.ts的provide中去*/
/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
