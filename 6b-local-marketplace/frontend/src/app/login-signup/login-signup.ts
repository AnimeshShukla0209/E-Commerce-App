import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login-signup',
  templateUrl: './login-signup.html',
  styleUrls: ['./login-signup.css'],
  imports: [CommonModule, FormsModule]
})
export class LoginSignup {
  activeTab: 'signin' | 'signup' = 'signin';
  selectedRole: 'buyer' | 'vendor' | 'admin' = 'buyer';

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  number = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab === 'signup') {
        this.activeTab = 'signup';
      }
    });
  }

  setTab(tab: 'signin' | 'signup') {
    this.activeTab = tab;
    // Reset role to buyer by default on tab change
    this.selectedRole = 'buyer';
  }

  setRole(role: 'buyer' | 'vendor' | 'admin') {
    this.selectedRole = role;
  }

  handleSubmit() {
    if (this.activeTab === 'signup') {
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      const payload = {
        name: this.name,
        email: this.email,
        mobile: this.number,
        password: this.password,
        role: this.selectedRole
      };

      this.http.post('http://localhost:5000/api/users/register', payload).subscribe({
        next: () => alert('Registered successfully!'),
        error: (err) => alert('Error: ' + (err.error?.message || err.message))
      });

    } else {
      const payload = {
        email: this.email,
        password: this.password,
        role: this.selectedRole
      };

      this.http.post<any>('http://localhost:5000/api/users/login', payload).subscribe({
        next: (res) => {
          alert('Login successful!');
          localStorage.setItem('user', JSON.stringify(res.user));
          localStorage.setItem('email', res.user.email);

          if (this.selectedRole === 'buyer') {
            this.router.navigate(['/buyer-dashboard']);
          } else if (this.selectedRole === 'vendor') {
            this.router.navigate(['/vendor-dashboard']);
          } else if (this.selectedRole === 'admin') {
            this.router.navigate(['/admin-dashboard']);
          }
        },
        error: (err) => alert('Login failed: ' + (err.error?.message || err.message))
      });
    }
  }
}
