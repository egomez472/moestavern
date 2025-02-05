import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería guardar un valor en localStorage', () => {
    const key = 'testKey';
    const value = { name: 'Test' };

    service.save(key, value);

    const storedValue = localStorage.getItem(key);
    expect(storedValue).toBeTruthy();
    expect(JSON.parse(storedValue!)).toEqual(value);
  });


  it('debería recuperar un valor de localStorage', () => {
    const key = 'testKey';
    const value = { name: 'Test' };
    localStorage.setItem(key, JSON.stringify(value));

    const result = service.get(key);
    expect(result).toEqual(value);
  });

  it('debería devolver false si no hay valor en localStorage', () => {
    const key = 'nonExistentKey';

    const result = service.get(key);
    expect(result).toBe(false);
  });
});
