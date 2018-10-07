import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth = false;
  authSubscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authSubscription = this.authService.authChange.subscribe( status => {
      this.isAuth = status;
    });

  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
   this.authService.logout();
  }

// ------------------------------------
  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
