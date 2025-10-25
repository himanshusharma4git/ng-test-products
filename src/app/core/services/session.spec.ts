import { TestBed } from '@angular/core/testing';
import { Session } from './session';

describe('Session Service', () => {
  let service: Session;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Session]
    });
    service = TestBed.inject(Session);
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get a string value', () => {
    service.setSeessionStorage('testKey', 'testValue');
    const value = service.getSessionStorage('testKey');
    expect(value).toBe('testValue');
  });

  it('should set and get an object', () => {
    const obj = { name: 'Alice', age: 30 };
    service.setSessionStorageObject('user', obj);

    const result = service.getSessionStorageObject<typeof obj>('user');
    expect(result).toEqual(obj);
  });

  it('should return null for missing key', () => {
    const value = service.getSessionStorage('missingKey');
    expect(value).toBeNull();
  });

  it('should store auth_token and details when calling setSeesionToken', () => {
    const mockToken = 'abc123';
    service.setSeesionToken(mockToken);

    const storedToken = service.getSessionStorage('auth_token');
    const details = service.getSessionStorageObject<{ loggedInAt: string; userId: number }>('details');

    expect(storedToken).toBe(mockToken);
    expect(details).toBeTruthy();
    expect(details?.userId).toBe(1);
    expect(new Date(details!.loggedInAt).toString()).not.toBe('Invalid Date');
  });
});
