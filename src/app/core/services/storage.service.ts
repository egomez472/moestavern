import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  /**
   * Guarda un valor en el almacenamiento local.
   *
   * Este método convierte el valor en una cadena JSON y lo almacena
   * bajo la clave especificada.
   *
   * @param {string} key - La clave bajo la cual se almacenará el valor.
   * @param {any} value - El valor que se desea almacenar.
   */
  save(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Recupera un valor del almacenamiento local.
   *
   * Este método obtiene el valor almacenado bajo la clave especificada
   * y lo convierte de nuevo a su forma original.
   *
   * @param {string} key - La clave del valor que se desea recuperar.
   * @returns {any | false} - El valor recuperado, o false si no existe.
   */
  get(key: string) {
    const obj = localStorage.getItem(key);
    if (obj) {
      return JSON.parse(obj);
    } else return false;
  }
}
