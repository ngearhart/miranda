import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChatService } from './chat.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { LoginDialog, LoadingDialog } from './dialog/dialog.component';
import { User } from './tables/tables.component';
import { CookieService } from '../../node_modules/angular2-cookie/services/cookies.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Miranda-AWS Frontend';
  info = 'Waiting for login...';
  messages: string[] = [];
  user: UserData;
  
  users: User[]; // For UserTable

  loggedIn: boolean = false;

  constructor(private chatService: ChatService, private dialog: MatDialog, private snackBar: MatSnackBar, private cookies: CookieService) {
    this.openLoginDialog(false);

    var sesscookie = this.cookies.get("miranda-sessionvar");
    console.log("Sesscookie = " + sesscookie);
    if (sesscookie) {
      this.chatService.loginCookie(sesscookie, () => {
        dialog.closeAll();
        this.doLoggedIn();
      });
    }
  }

  sendMessage(message) {
    this.chatService.sendMessage(message);
  }

  ngOnInit() {
    // this.chatService
    //   .getMessages()
    //   .subscribe((message: string) => {
    //     this.messages.push(message);
    //   });
  }

  openLoginDialog(error: boolean): void {
    const dialogRef = this.dialog.open(LoginDialog, {
      width: '400px',
      disableClose: true,
      data: {errorMessage: error}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.loggedIn) return;
      this.chatService.login(result, () => {
        if (result.rememberMe) {
          console.log("Cookie requesting...");
          this.chatService.send("cookie", "create");
          this.chatService.getData("cookie").subscribe(result => {
            this.cookies.put("miranda-sessionvar", result);
            console.log("Cookie = " + result);
          });
        }

        this.doLoggedIn();
      }, () => {
        this.dialog.closeAll();
        this.openLoginDialog(true);
      });
      this.openLoadingDialog();
    });
  }

  doLoggedIn(): void {
    this.snackBar.open("Logged in!", "Close", {duration: 5000});
    this.dialog.closeAll();

    // Open socket listeners
    this.chatService.getData("userData").subscribe(result => {
      console.log("User data: " + result);
      var data = JSON.parse(result);
      this.user = new UserData();
      this.user.username = data["username"];
      this.user.firstname = data["firstname"];
      this.user.lastname = data["lastname"];

      this.info = "Welcome, " + this.user.firstname + " " + this.user.lastname + "!";

      this.loggedIn = true;
    });
  }

  openLoadingDialog(): void {
    const dialogRef = this.dialog.open(LoadingDialog, {
      width: '300px',
      disableClose: true,
      data: { message: "Logging in..."}
    });
  }
}

export class UserData {
  constructor() {}
  username: string;
  firstname: string;
  lastname: string;
  // More? Fingerprint?
}