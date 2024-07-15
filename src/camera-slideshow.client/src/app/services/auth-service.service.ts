import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {LocalStorageService} from "./local-storage-service.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);
  localStorageService = inject(LocalStorageService);

  login(secret: string): Observable<string> {
    return this.http.post('https://roa.gwingren.se/api/auth', {token: btoa(secret)})
      .pipe(map((response: any) => {
        return response.Token;
      }));
  }

  storeToken(token: string): void {
    this.localStorageService.set('token', token);
  }
}
