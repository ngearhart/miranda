import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChatService } from './chat.service';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';
import { LoginDialog, LoadingDialog, NewUserDialog } from './dialog/dialog.component';
import { MatButtonModule, MatToolbarModule, MatInputModule, MatFormFieldModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule, MatTableModule, MatSortModule, MatSelectModule, MatCheckboxModule } from '@angular/material';
import { UserTable } from './tables/tables.component';
import { CookieService } from 'angular2-cookie/services/cookies.service';


// DONT FORGET NOAH TO ADD MODULE IF MATDESIGN WONT WORK!
@NgModule({
  declarations: [
    AppComponent,
    LoginDialog,
    LoadingDialog,
    NewUserDialog,
    UserTable
  ],
  entryComponents: [
    LoginDialog,
    LoadingDialog,
    NewUserDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  providers: [ChatService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
