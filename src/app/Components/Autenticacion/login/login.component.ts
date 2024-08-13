import { HttpClient } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, forkJoin, throwError, timer } from 'rxjs';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from 'app/core/services/authentication.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgxSpinnerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  dni: string = '';
  password: string = '';
  notificationMessage: string = '';
  constructor(private authService: AuthenticationService, private spinner: NgxSpinnerService , private router: Router, private http: HttpClient, private elementRef: ElementRef, private renderer:Renderer2, private toastr: ToastrService) {}

  ngAfterViewInit(): void {
    this.setupEventListeners();
  }

  onLogin() {
    this.spinner.show();

    this.authService.login(this.dni, this.password).subscribe({
      next: () => {
        this.authService.getCurrentUserData().subscribe({
          next: userData => {
            console.log('JSON de los datos del usuario actual:', JSON.stringify(userData, null, 2));

            sessionStorage.setItem('dni', userData.dni);
            sessionStorage.setItem('email', userData.email);
            sessionStorage.setItem('idgeneral', userData.idgeneral);
            sessionStorage.setItem('nombrey_apellido', userData.nombrey_apellido);
            sessionStorage.setItem('imagen_usuario', userData.imagen_usuario);
            sessionStorage.setItem('cargo', userData.cargo);
            sessionStorage.setItem('area', userData.area);
            sessionStorage.setItem('tipo_usurio', userData.tipo_usurio);

            this.spinner.hide();
            this.toastr.success('Inicio de sesión exitoso', 'Bienvenido');
            this.router.navigate(['/db-flota']);
          },
          error: error => {
            console.error('Error al obtener los datos del usuario actual:', error);
            this.spinner.hide();
            this.toastr.error('Error al obtener los datos del usuario. Por favor, intente nuevamente.', 'Error');
          }
        });
      },
      error: error => {
        this.spinner.hide();
        if (error.status === 401) {
          this.toastr.error('Credenciales inválidas. Por favor, inténtalo de nuevo.', 'Error de inicio de sesión');
        } else {
          this.toastr.error(`Error al iniciar sesión: ${error.message}`, 'Error de inicio de sesión');
        }
      }
    });
  }


  setupEventListeners(): void {
    const btnSignIn = document.getElementById('sign-in');
    const btnSignUp = document.getElementById('sign-up');
    const containerFormRegister = document.querySelector('.register');
    const containerFormLogin = document.querySelector('.login');

    if (btnSignIn && btnSignUp && containerFormRegister && containerFormLogin) {
      btnSignIn.addEventListener('click', () => {
        containerFormRegister.classList.add('hide');
        containerFormLogin.classList.remove('hide');
      });

      btnSignUp.addEventListener('click', () => {
        containerFormLogin.classList.add('hide');
        containerFormRegister.classList.remove('hide');
      });
    }
  }
}
