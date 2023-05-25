import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { CoreService } from '../core/core.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private router: Router, private _coreService: CoreService) {}
  register = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [
      Validators.minLength(5),
      Validators.required,
    ]),
  });

  get vusername() {
    return this.register.get('username');
  }

  get vpassword() {
    return this.register.get('password');
  }
  b = {
    username: 'arun',
    password: '12345',
  };
  getData() {
    if (
      this.b.username == this.register.controls['username'].value &&
      this.b.password == this.register.controls['password'].value
    ) {
      console.log('same data');
      this.router.navigateByUrl('dashboard');
      console.log('dashboard routed succesfully');
    } else {
      this._coreService.openSnackBar('Username or password Error');
      console.log('different value');
    }
  }
}
