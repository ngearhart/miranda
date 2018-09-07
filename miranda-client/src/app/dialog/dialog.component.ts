import {Component, Inject, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatSlider} from '@angular/material';

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

@Component({
  selector: 'lightdialog',
  templateUrl: 'light.dialog.html',
})
export class LightDialog {
  applyTo: number;

  red: number;
  green: number;
  blue: number;

  @ViewChild('red') redSlider: MatSlider;
  @ViewChild('green') greenSlider: MatSlider;
  @ViewChild('blue') blueSlider: MatSlider;

  constructor() {
    this.applyTo = 0;
    
    this.red = 0;
    this.green = 0;
    this.blue = 0;
  }

  resetVals(): void {
    this.redSlider.value = this.red;
    this.greenSlider.value = this.green;
    this.blueSlider.value = this.blue;
  }

  loadPreset(index: number): void {
    switch(index) {
      case 0: // All off
        this.red = 0;
        this.green = 0;
        this.blue = 0;
        break;
      case 1: // All on
        this.red = 255;
        this.green = 255;
        this.blue = 255;
        break;
      case 2: // Warm white
        this.red = 255;
        this.green = 255;
        this.blue = 100;
        break;
      case 3: // Night
        this.red = 200;
        this.green = 60;
        this.blue = 20;
        break;
    }
    this.resetVals();
  }

  // onNoClick(): void {
  //   this.dialogRef.close();
  // }

}