import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {} // Inyecta el Router en el constructor

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.setupEventListeners();
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
  onSubmit() {
      this.router.navigate(['/seguientoPesca']); // Navega a la página de inicio después del login exitoso
  }
}