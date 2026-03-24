import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {BrowserModule} from "@angular/platform-browser";
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideRouter, RouterOutlet} from "@angular/router";
import {HomeComponent} from "./pages/home/home.component";
import {LogoutConfirmDialogComponent} from "./shared/components/logout-confirm-dialog/logout-confirm-dialog.component";
import {LoginComponent} from "./pages/login/login.component";
import {AlertDialogComponent} from "./shared/components/alert-dialog/alert-dialog.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CandidateAreaComponent} from "./pages/candidate-area/candidate-area.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CommonModule} from "@angular/common";
import {MatDialogActions, MatDialogContent, MatDialogModule} from "@angular/material/dialog";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {AppRoutingModule, routes} from "./app.routes";
import {AuthInterceptor} from "./core/interceptors/auth.interceptors";
import {ErrorInterceptor} from "./core/interceptors/error.interceptors";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatFormField} from "@angular/material/form-field";

@NgModule({
  declarations: [
    AppComponent, LogoutConfirmDialogComponent
  ],
  imports: [
    AlertDialogComponent,
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    RouterOutlet,
    MatDialogModule,
    MatButtonModule,
    CandidateAreaComponent,
    HomeComponent,
    LoginComponent,
    MatDialogContent,
    MatButton,
    MatDialogActions,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormField
  ],

  providers: [provideRouter(routes),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
