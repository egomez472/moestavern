import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  save(key:string, value:any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  get(key:string) {
    const obj = localStorage.getItem(key);
    if(obj) {
      return JSON.parse(obj);
    }
  }
}
