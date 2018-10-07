import { Injectable } from '@angular/core';
import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { TrainingService } from '../training/training.service';
import { UiService } from '../shared/ui.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public authChange = new Subject<boolean>();
  private isLoggedin = false;

  constructor(private  router: Router,
              private afa: AngularFireAuth,
              private trainingService: TrainingService,
              private uiService: UiService) { }

  initAuthListener() {
    this.afa.authState.subscribe( user => {
      if (user) {
        console.log('AUTHENTICATED');
        this.isLoggedin = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);

      } else {
        console.log('UN-AUTHENTICATED');
        this.trainingService.cancelSubscriptions();
        this.isLoggedin = false;
        this.authChange.next(false);
        this.router.navigate(['/login']);
      }
    });
  }
  registerUser(authData: AuthData) {
    this.uiService.loadingStateChange.next(true);
    this.afa.auth.createUserWithEmailAndPassword(authData.email, authData.password)
    .then( result => {
      this.uiService.loadingStateChange.next(false);
    })
    .catch( error => {
      this.uiService.loadingStateChange.next(false);
      this.uiService.showSnackbar(error.message, null, { duration: 3000});
    });
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChange.next(true);
    this.afa.auth.signInWithEmailAndPassword(authData.email, authData.password)
    .then( result => {
      this.uiService.loadingStateChange.next(false);
    })
    .catch( error => {
      this.uiService.loadingStateChange.next(false);
      this.uiService.showSnackbar(error.message, null, { duration: 3000});
    });
  }

  logout() {
    this.afa.auth.signOut();
  }


  isAuth() {
    return this.isLoggedin;
  }

}
