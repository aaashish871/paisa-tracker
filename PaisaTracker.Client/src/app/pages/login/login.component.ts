import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    if (!this.username.trim() || !this.password.trim()) return;
    this.loading = true;
    this.error = '';

    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        const isAdmin = this.auth.hasRole('Admin');
        this.router.navigateByUrl(isAdmin ? '/admin/users' : '/home/dashboard');
      },
      error: (err) => {
        this.error = err.status === 401 ? 'Invalid username or password.' : 'Could not reach the server.';
        this.loading = false;
      }
    });
  }
}
