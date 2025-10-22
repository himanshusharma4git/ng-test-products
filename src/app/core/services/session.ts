import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Session {

  setSeessionStorage(key:string, value:string){
    sessionStorage.setItem(key, value);
  }
  setSessionStorageObject(key:string, value:Object){
    sessionStorage.setItem(key, JSON.stringify(value));
  }
  getSessionStorage(key:string): string | null {
    return sessionStorage.getItem(key);
  }
  getSessionStorageObject<T>(key:string): T | null {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) as T : null;
  }

  setSeesionToken(token:string){
    this.setSeessionStorage('auth_token', token);
    this.setSeessionStorage('details', JSON.stringify({ loggedInAt: new Date().toISOString(), userId: 1}));
  }
}
