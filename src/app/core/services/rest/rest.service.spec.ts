import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RestService } from './rest.service';
import { HttpParams } from '@angular/common/http';

describe('RestService', () => {
  let service: RestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RestService]
    });

    service = TestBed.inject(RestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería realizar una solicitud GET', () => {
    const mockResponse = { data: 'test' };
    const url = 'https://api.example.com/data';
    const params = new HttpParams().set('param1', 'value1');

    service.get<{ data: string }>(url, params).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req => req.method === 'GET' && req.url === url);
    req.flush(mockResponse);
  });

  it('debería realizar una solicitud POST', () => {
    const mockResponse = { success: true };
    const url = 'https://api.example.com/data';
    const body = { name: 'test' };

    service.post<{ success: boolean }>(url, body).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req => req.method === 'POST' && req.url === url);
    expect(req.request.body).toEqual(body);
    req.flush(mockResponse);
  });

  it('debería realizar una solicitud PUT', () => {
    const mockResponse = { success: true };
    const url = 'https://api.example.com/data';
    const body = { name: 'test' };

    service.put<{ success: boolean }>(url, body).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req => req.method === 'PUT' && req.url === url);
    expect(req.request.body).toEqual(body);
    req.flush(mockResponse);
  });

  it('debería realizar una solicitud DELETE', () => {
    const mockResponse = { success: true };
    const url = 'https://api.example.com/data';
    const params = new HttpParams().set('param1', 'value1');

    service.delete<{ success: boolean }>(url, params).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req => req.method === 'DELETE' && req.url === url);
    req.flush(mockResponse);
  });
});
