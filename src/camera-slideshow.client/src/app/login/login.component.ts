import {Component, inject, Input, OnInit, signal} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../services/auth-service.service";
import {Router} from "@angular/router";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgClass
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  @Input()
  set loginTxt(loginHash: string) {
    this.loginText.set(loginHash);
  }

  authService = inject(AuthService);
  router = inject(Router);

  loginText = signal<string>('');
  isLoggingIn = signal<boolean>(false);
  wrongCode = signal<boolean>(false);

  ngOnInit(): void {
    this.login();
  }

  login(): void {
    if (this.loginText()) {
      this.isLoggingIn.set(true);
      this.wrongCode.set(false);
      this.authService.login(this.loginText()).subscribe(
        this.handleLoginComplete.bind(this),
        this.handleLoginError.bind(this));
    }
  }

  handleLoginComplete(token: string): void {
    this.isLoggingIn.set(false);
    this.authService.storeToken(token);
    this.router.navigate(['/upload']);
  }

  handleLoginError(error: any): void {
    this.isLoggingIn.set(false);
    this.wrongCode.set(true);
  }
}
