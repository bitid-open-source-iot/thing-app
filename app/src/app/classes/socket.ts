import { BehaviorSubject, Subject } from "rxjs";

export class Socket {

    public data: Subject<any> = new Subject<any>();
    public status: BehaviorSubject<string> = new BehaviorSubject<string>('disconnected');

    private socket: WebSocket;
    
    constructor(url: string) {
        this.status.next('connecting');
        this.socket = new WebSocket(url);
        this.socket.onopen = (event) => this.status.next('connected');
        this.socket.onclose = (event) => this.status.next('disconnected');
        this.socket.onerror = (event) => this.status.next('socket-error');
        this.socket.onmessage = (event) => this.data.next(JSON.parse(event.data));
    };

}