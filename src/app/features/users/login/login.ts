import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../../core/services/data';
import { Session } from '../../../core/services/session';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  private ds = inject(DataService);
  private session = inject(Session);

  loginForm!:FormGroup;
  constructor(private fb:FormBuilder, private router:Router) {
    this.loginForm = this.fb.group({
      username:['', Validators.required],
      password:['', Validators.required]
    });
  }

  onSubmit() {
    this.ds.userLogin(this.loginForm.value).subscribe(res => {
      if(res.status === 'success') {
        this.loginForm.reset();
        this.session.setSeesionToken(res.data.token);
        this.router.navigateByUrl('/');
      }else{
        console.error('Login failed',res, res.error);
      }
    })
  }
}
