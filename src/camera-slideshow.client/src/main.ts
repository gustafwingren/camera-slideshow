import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import {provideRouter, withComponentInputBinding} from "@angular/router";
import {LoginComponent} from "./app/login/login.component";
import {UploadComponent} from "./app/upload/upload.component";
import {AuthorizeGuard} from "./app/services/authoirize-guard";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {AuthInterceptor} from "./app/services/auth.interceptor";

bootstrapApplication(AppComponent, {
    providers: [
      provideHttpClient(withInterceptors([AuthInterceptor])),
      provideRouter([
      { path: 'login', component: LoginComponent },
      { path: 'upload', component: UploadComponent, canActivate: [AuthorizeGuard]},
      {path: '', redirectTo: '/login', pathMatch: 'full'},
    ], withComponentInputBinding()), ]
})
  .catch(err => console.error(err));
