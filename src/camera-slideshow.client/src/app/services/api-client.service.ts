import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {

  httpClient = inject(HttpClient);

  post<T>(url: string, body: any): Observable<T> {
    return this.httpClient.post<T>(url, body);
  }

  upload(url: string, files: File[]): Observable<any> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'multipart/form-data');

    const formData: FormData = new FormData();
    for (const file of files) {
      formData.append('image', file, file.name);
    }

    return this.httpClient.post(url, formData, {headers});
  }
}
