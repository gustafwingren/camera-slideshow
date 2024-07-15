import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {FileItem} from "../upload/upload.component";

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {

  httpClient = inject(HttpClient);

  post<T>(url: string, body: any): Observable<T> {
    return this.httpClient.post<T>(url, body);
  }

  upload(url: string, file: FileItem): Observable<any> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'multipart/form-data');

    const formData: FormData = new FormData();
    formData.append(file.id.toString(), file.file, file.file.name);

    return this.httpClient.post(url, formData, {headers});
  }
}
