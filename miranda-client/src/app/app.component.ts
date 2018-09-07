import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChatService } from './chat.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { LoginDialog, LoadingDialog, LightDialog } from './dialog/dialog.component';
import { User } from './tables/tables.component';
import { CookieService } from './cookie.service';
import { trigger, state, transition, style, animate } from '../../node_modules/@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    trigger('flyInOut', [
      state('in', style({opacity: 1, transform: 'translateY(0)'})),
      transition('void => *', [
        style({opacity: 0, transform: 'translateY(100%)'}),
        animate('500ms ease-out')
      ]),
      transition('* => void', [
        animate('500ms ease-out', style({opacity: 0, transform: 'translateY(100%)'}))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'Main Menu';
  info = 'Waiting for login...';
  messages: string[] = [];
  user: UserData;
  
  users: User[]; // For UserTable

  loggedIn: boolean = false;
  flyIn: string;

  constructor(private chatService: ChatService, private dialog: MatDialog, private snackBar: MatSnackBar, private cookies: CookieService) {
    this.openLoginDialog(false);

    var sesscookie = this.cookies.getCookie("miranda-sessionvar");
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
            this.cookies.setCookie("miranda-sessionvar", result);
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
    this.loggedIn = true;
    this.flyIn = "in";
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

    });
  }

  openLoadingDialog(): void {
    const dialogRef = this.dialog.open(LoadingDialog, {
      width: '300px',
      disableClose: true,
      data: { message: "Logging in..."}
    });
  }

  openLightDialog(): void {
    const dialogRef = this.dialog.open(LightDialog, {
      width: '300px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(data => {
      //console.log(data.applyTo + " 1 " + data.red + " " + data.green + " " + data.blue);
      this.chatService.send('colors', data.applyTo + " 1 " + data.red + " " + data.green + " " + data.blue);
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