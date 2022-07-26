import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { NotificationService } from '../shared/notification.service';

@Component({
  selector: 'app-authen',
  templateUrl: './authen.component.html',
  styleUrls: ['./authen.component.css'],
})
export class AuthenComponent implements OnInit {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private notifService: NotificationService
  ) {}

  datas = [{ username: 'admin', password: '123456' }];
  ngOnInit(): void {}

  login() {
    this.datas.forEach((data) => {
      if (this.username == data.username && this.password == data.password) {
        this.authService.logIn();
        this.router.navigate(['/home']);

        return;
      } else {
        this.notifService.warn('Login ou mot de passe incorrect');
      }
    });
  }

  @Input() error: string | null | undefined;

  @Output() submitEM = new EventEmitter();
}
