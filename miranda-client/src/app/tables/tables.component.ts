import { Component, Input, ViewChild } from "@angular/core";
import { ChatService } from "../chat.service";
import { MatTableDataSource, MatTable, MatDialog, MatSnackBar } from "@angular/material";
import { NewUserDialog } from "../dialog/dialog.component";

@Component({
    selector: 'table-users',
    templateUrl: 'tables.users.html',
  })
  export class UserTable {
    displayedColumns: string[] = ['username', 'firstname', 'lastname', 'permissions'];
    dataSource = new MatTableDataSource<User>([]);
    @ViewChild('userTable') table: MatTable<User>;

    constructor(private chatService: ChatService, private dialog: MatDialog, private snackBar: MatSnackBar) {
      chatService.send('userTable', 'admin');
      chatService.getData('userTable').subscribe((infoData) => {
        this.dataSource.data.push(new User(infoData["username"], infoData["firstname"], infoData["lastname"], infoData["permissions"]));
        this.table.renderRows();
      });
      chatService.getData('new-user').subscribe(message => {
        if (message == "success")
          this.snackBar.open("Added new user successfully", "Close", {duration: 5000});
        else
          this.snackBar.open("An error occured while creating new user", "Close", {duration: 5000}); 
      });
    }

    public addUser() {
      const dialogRef = this.dialog.open(NewUserDialog, {
        width: '400px'
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.chatService.send('new-user', result);
        }
      });
    }
  }

  export class User {
    constructor(public username: string, public firstname: string, public lastname: string, public permissions: string) {}
  }