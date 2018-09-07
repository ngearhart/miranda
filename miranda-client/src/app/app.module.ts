import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChatService } from './chat.service';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';
import { LoginDialog, LoadingDialog, NewUserDialog, LightDialog } from './dialog/dialog.component';
import { MatButtonModule, MatToolbarModule, MatInputModule, MatFormFieldModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule, MatTableModule, MatSortModule, MatSelectModule, MatCheckboxModule, MatSliderModule, MatMenuModule } from '@angular/material';
import { UserTable } from './tables/tables.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CookieService } from './cookie.service';


// DONT FORGET NOAH TO ADD MODULE IF MATDESIGN WONT WORK!
@NgModule({
  declarations: [
    AppComponent,
    LoginDialog,
    LoadingDialog,
    NewUserDialog,
    LightDialog,
    UserTable
  ],
  entryComponents: [
    LoginDialog,
    LoadingDialog,
    NewUserDialog,
    LightDialog
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
    MatCheckboxModule,
    MatSliderModule,
    MatMenuModule,
    HttpModule,
    HttpClientModule,
    HttpClientTestingModule
  ],
  providers: [ChatService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
