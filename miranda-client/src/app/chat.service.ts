import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export class ChatService {
    private url = 'http://localhost:3000';
    private socket;    

    constructor() {
        if (environment.production)
            this.url = "http://miranda.noahgearhart.com:3000";
    }

    public login(data, onSuccess, onError) {
        this.socket = io(this.url, { query: data });

        this.socket.on('connect', () => {
            console.log("Successfully logged in and connected socket.io");
            onSuccess();
        });

        this.socket.on('error', (message) => {
            console.log("Login error: " + message);
            onError();
        });        
    }

    public send(type, message) {
        if (!this.socket) {
            console.log('WARN: Somebody called socket.send before login');
            return;
        }
        this.socket.emit(type, message);
    }
    
    public sendMessage(message) {
        if (!this.socket) return;
        this.socket.emit('new-message', message);
    }

    public getData = (id) => {
        if (!this.socket) return;
        return Observable.create((observer) => {
            this.socket.on(id, (message) => {
                observer.next(message);
            });
        });
    }
}

/* DATABASE REFERENCE
*
*   database - Keyword
*       Users:
*           user.getUser.id = Get User Object by id
*           user.createUser.{username,firstname,lastname,password,permissions,fingerprint}
*           user.updateUser.{id,username,firstname,lastname,password,permissions,fingerprint}
*
*
*/