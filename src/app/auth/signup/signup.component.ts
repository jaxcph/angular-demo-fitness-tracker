import { Component, OnInit, OnDestroy } from '@angular/core';
import { mixinColor } from '@angular/material';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UiService } from '../../shared/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  public maxDate;
  public isLoadning = false;

  private loadingSub: Subscription;

  constructor(private authService: AuthService,
              private uiService: UiService) { }

  ngOnInit() {
    this.loadingSub = this.uiService.loadingStateChange.subscribe( state => (this.isLoadning = state)) ;
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onSubmit(form: NgForm) {

    this.authService.registerUser( {
      email: form.value.email,
      password: form.value.password
    });

  }

  ngOnDestroy(): void {
    this.loadingSub.unsubscribe();
  }


}
