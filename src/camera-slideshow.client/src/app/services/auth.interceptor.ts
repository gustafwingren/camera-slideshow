import {HttpInterceptorFn} from "@angular/common/http";
import {inject} from "@angular/core";
import {LocalStorageService} from "./local-storage-service.service";

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageService = inject(LocalStorageService);

    // add auth header with jwt if account is logged in and request is to the api url
    const token = localStorageService.get('token');
    if (token) {
      req = req.clone({
        setHeaders: { Authorization2: `Bearer ${token}` }
      });
    }

    return next(req);
  }
