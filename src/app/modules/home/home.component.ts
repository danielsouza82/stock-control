import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SignupUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { UserService } from 'src/app/services/user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  loginCard = true;

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  signupForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService,
    private  messageService: MessageService
  ) {}

  onSubmitLoginForm(): void {
    if (this.loginForm.value && this.loginForm.valid) {
      this.userService.authUser(this.loginForm.value as AuthRequest).subscribe({
        next: (response) => {
          if (response) {
            this.cookieService.set('USER_INFO', response?.token);

            this.loginForm.reset();

            this.messageService.add({
              severity: 'Sucesso',
              summary: 'Sucesso',
              detail: `Bem Vindo de Volta ${response?.name}!`,
              life: 2000,

            });
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao fazer o login!`,
            life: 2000,

          });
         { 
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao criar usuário!`,
            life: 2000,

          });
          console.log(err)}
        },
      });
    }
  }

  onSubmitSignupForm(): void {
    if (this.signupForm.value && this.signupForm.valid) {
      this.userService
        .signupUser(this.signupForm.value as SignupUserRequest)
        .subscribe({
          next: (response) => {
            if (response) {
              alert('Usuário teste criado com sucesso!');
              this.signupForm.reset();
              this.loginCard = true;

              this.messageService.add({
                severity: 'Sucesso',
                summary: 'Sucesso',
                detail: `Usuário Criado com Sucesso`,
                life: 2000,
  
              });

            }
          },
          error: (err) => console.log(err),
        });
    }
  }
}
