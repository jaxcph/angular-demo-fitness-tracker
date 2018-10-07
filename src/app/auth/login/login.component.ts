import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { UiService } from '../../shared/ui.service';
import {  Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoadning = false;
  private loadingSubs: Subscription;

  constructor(private authService: AuthService,
              private uiService: UiService) { }

  ngOnInit() {
    this.loadingSubs = this.uiService.loadingStateChange.subscribe(state => { this.isLoadning = state; });
  }

  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe();
  }

  onSubmit(form: NgForm) {
    this.authService.login( {
      email: form.value.email,
      password: form.value.password
    });

  }

}
