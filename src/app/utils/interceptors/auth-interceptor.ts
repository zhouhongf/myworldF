import {Injectable} from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {BaseService} from '../../providers/base.service';
import {tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

    constructor(private baseService: BaseService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let clonedReq = req.clone({ withCredentials: true });
        const value = this.baseService.getCurrentUser();
        if (value) {
            const authToken = value.token;
            if (authToken) {
                // 也可以这样写 const authReq = req.clone({headers: req.headers.set('Authorization', authToken)});
                clonedReq = req.clone({ setHeaders: { Authorization: authToken }, withCredentials: true });
            }
        }
        return next.handle(clonedReq).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    if (event.status === 200) {
                        if (event.body.code === 9) {
                            // 返回的是ApiResult
                            const currentUser = event.body.data;
                            alert('返回refreshToken的currentUser内容是：' + currentUser);
                            this.baseService.setCurrentUser(currentUser);
                            return of(event);
                        }
                    } else if (event.status === 401) {
                        // Unauthorized状态
                        return this.baseService.delCurrentUser();
                    }
                }
                // 返回正常情况的可观察对象
                return of(event);
            })
        );
    }

}
