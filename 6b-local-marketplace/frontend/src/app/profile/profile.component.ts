import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  addressLabel = 'Delivery Address';
  editMode = false;
  loading = true;

  profile: any = {
    name: '',
    email: '',
    mobile: '',
    address: '',
  };

  constructor(private route: ActivatedRoute,private http: HttpClient) {}

  ngOnInit() {
     this.route.queryParams.subscribe(params => {
      this.addressLabel = params['role'] === 'vendor' ? 'Current Address' : 'Delivery Address';

      // Also load profile from localStorage here as before
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.profile = JSON.parse(storedUser);
      }
      this.loading = false;
    });
  
    // 1️⃣ Load profile from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.profile = JSON.parse(storedUser);
    }

    
      this.loading = false;
    }
  
  enableEdit() {
    this.editMode = true;
  }

updateProfile() {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Prepare updated payload
  const updatedData = {
    name: this.profile.name,
    email: this.profile.email,
    mobile: this.profile.mobile,
    address: this.profile.address
  };

  // Call backend API
  this.http.put(`http://localhost:5000/api/users/update/${storedUser._id}`, updatedData)
    .subscribe({
      next: (res: any) => {
        // Save latest data to localStorage
        localStorage.setItem('user', JSON.stringify(res.user));
        this.profile = res.user;
        alert('Profile updated successfully!');
        this.editMode = false;
      },
      error: (err) => {
        alert('Failed to update profile. Please try again.');
        console.error(err);
      }
    });
}

}