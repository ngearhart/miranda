import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';

/**
 * @title Login Dialog
 */
@Component({
  selector: 'login.dialog',
  templateUrl: 'login.dialog.html',
})
export class LoginDialog {
  hide = true;
  errorMessage = false;
  rememberMe: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<LoginDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.errorMessage) this.errorMessage = data.errorMessage;
  }

  // onNoClick(): void {
  //   this.dialogRef.close();
  // }

}

@Component({
  selector: 'loading.dialog',
  template: '<table style="width:100%;"><tbody><tr><td><mat-spinner [diameter]="50"></mat-spinner></td><td><h2 class="mat-h2" style="margin:auto;">{{message}}</h2></td></tr></tbody></table>',
})
export class LoadingDialog {
  message = "Loading...";

  constructor(
    public dialogRef: MatDialogRef<LoadingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.message) this.message = data.message;
  }
}

@Component({
  selector: 'newuser.dialog',
  templateUrl: 'newuser.dialog.html'
})
export class NewUserDialog {
  hide = true;
  permVal = "";

  permissionTypes = ['Admin', 'Guest'];

  constructor(
    public dialogRef: MatDialogRef<LoadingDialog>
   // @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}