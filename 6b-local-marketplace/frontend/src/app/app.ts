import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginSignup } from './login-signup/login-signup';
import { LandingPage } from './landing-page/landing-page';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('my-angular-app');
}
