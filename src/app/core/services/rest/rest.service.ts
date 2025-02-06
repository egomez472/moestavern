import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) {}

  /**
   * Realiza una solicitud HTTP GET de tipo genérico.
   *
   * Este método se utiliza para obtener datos de la API.
   *
   * @template T - El tipo de respuesta esperada del servidor.
   * @param {string} url - La URL a la que se enviará la solicitud GET.
   * @param {HttpParams} [params] - (Opcional) Parámetros de consulta para filtrar la solicitud.
   * @param {HttpHeaders} [headers] - (Opcional) Encabezados HTTP que se enviarán con la solicitud.
   * @returns {Observable<T>} - Un observable que emite la respuesta del servidor.
   */
  get<T>(url: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.http.get<T>(url, { params, headers });
  }

  /**
   * Realiza una solicitud HTTP POST de tipo genérico.
   *
   * Este método se utiliza para enviar datos a la API.
   *
   * @template T - El tipo de respuesta esperada del servidor.
   * @param {string} url - La URL a la que se enviará la solicitud POST.
   * @param {any} body - El cuerpo de la solicitud que se enviará al servidor.
   * @param {HttpHeaders} [headers] - (Opcional) Encabezados HTTP que se enviarán con la solicitud.
   * @returns {Observable<T>} - Un observable que emite la respuesta del servidor.
   */
  post<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(url, body, { headers });
  }

  /**
   * Realiza una solicitud HTTP PUT de tipo genérico.
   *
   * Este método se utiliza para actualizar un recurso existente en la API.
   *
   * @template T - El tipo de respuesta esperada del servidor.
   * @param {string} url - La URL a la que se enviará la solicitud PUT.
   * @param {any} body - El cuerpo de la solicitud que se enviará al servidor.
   * @param {HttpHeaders} [headers] - (Opcional) Encabezados HTTP que se enviarán con la solicitud.
   * @returns {Observable<T>} - Un observable que emite la respuesta del servidor.
   */
  put<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(url, body, { headers });
  }

  /**
   * Realiza una solicitud HTTP DELETE de tipo genérico.
   *
   * Este método se utiliza para eliminar un recurso en la API.
   *
   * @template T - El tipo de respuesta esperada del servidor.
   * @param {string} url - La URL a la que se enviará la solicitud DELETE.
   * @param {HttpParams} [params] - (Opcional) Parámetros de consulta para filtrar la solicitud.
   * @param {HttpHeaders} [headers] - (Opcional) Encabezados HTTP que se enviarán con la solicitud.
   * @returns {Observable<T>} - Un observable que emite la respuesta del servidor.
   */
  delete<T>(url: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(url, { params, headers });
  }
}
