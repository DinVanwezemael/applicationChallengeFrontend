import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }
  
  logWarnings(warning: string) {
    console.warn(warning);
  }

  logErrors(error: string) {
    console.error(error);
    
  }
}