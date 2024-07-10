import {Component, inject, Input, OnInit, signal} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../services/auth-service.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
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

  ngOnInit(): void {
    this.login();
  }

  login(): void {
    if (this.loginText()) {
      this.authService.login(this.loginText()).subscribe(token => {
        console.log(token);
        this.authService.storeToken(token);
        this.router.navigate(['/upload']);
      });
    }
  }
}
