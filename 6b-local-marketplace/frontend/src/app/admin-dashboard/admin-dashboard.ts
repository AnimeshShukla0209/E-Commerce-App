import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // ✅ Add this

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  activeTab: 'buyers' | 'vendors' = 'buyers';

  constructor(private http: HttpClient, private router: Router) {} // ✅ Router injected

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.http.get<any[]>('http://localhost:5000/api/users').subscribe(data => {
      this.users = data;
      this.showBuyers();
    });
  }

  showBuyers() {
    this.activeTab = 'buyers';
    this.filteredUsers = this.users.filter(u => u.role === 'buyer');
  }

  showVendors() {
    this.activeTab = 'vendors';
    this.filteredUsers = this.users.filter(u => u.role === 'vendor');
  }

  logout() {
    localStorage.clear(); // Remove all saved data
    this.router.navigate(['/login']); // Redirect to login
  }

}


