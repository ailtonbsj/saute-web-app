import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes(this.auth.api)) {
      const authToken = this.auth.getAuthorizationToken();
      if (authToken) {
        const authReq = req.clone({
          headers: req.headers.set('Authorization', authToken)
        });
        return next.handle(authReq);
      }
    }
    return next.handle(req);
  }
}
