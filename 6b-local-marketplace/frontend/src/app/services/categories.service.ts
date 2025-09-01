import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface Category {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:5000/api/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Failed to fetch categories:', error);
        return throwError(() => new Error('Unable to load categories. Please try again later.'));
      })
    );
  }
}