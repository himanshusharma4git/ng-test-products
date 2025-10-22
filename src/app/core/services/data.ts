import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiResponse, Status, Product } from '../models/products';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient){}

  catchError(error: HttpErrorResponse, data: any, status:Status, errorMsg?:string): Observable<ApiResponse<any>> {
    return of({
      data: data,
      status: status,
      error: errorMsg || error?.message || 'An unknown error occurred'
    });
  }

  getAllProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<Product[]>('https://fakestoreapi.com/products').pipe(
      map((products): ApiResponse<Product[]> => ({
        data: products,
        status: Status.Success,
        error: ''
      })),
      catchError((err) => this.catchError(err, [] as Product[], Status.Failed, 'An error occurred while fetching products'))
    );
  }

  addProduct(product: Product): Observable<ApiResponse<Product>> {
    let observable$: Observable<Product>;
    if(product.id && product.id > 0) {
      observable$ = this.http.put<Product>(`https://fakestoreapi.com/products/${product.id}`, product)
    }else{
      observable$ = this.http.post<Product>('https://fakestoreapi.com/products', product);
    }
    return observable$.pipe(
      map((newProduct): ApiResponse<Product> => ({
        data: newProduct,
        status: Status.Success,
        error: ''
      })),
      catchError((error) => this.catchError(error, {} as Product, Status.Failed, 'An error occurred while adding the product'))
    );
  }

  getProductById(id: number):Observable<ApiResponse<Product>> {
    return this.http.get<Product>(`https://fakestoreapi.com/products/${id}`).pipe(
      map((product:Product) => {
        return {
          data: product as Product,
          status: Status.Success,
          error: ''
        }
      },
      catchError(err => this.catchError(err, {} as Product, Status.Failed, 'An error occurred while fetching the product details')))
    )
  }

  userLogin(loginData:LoginData):Observable<ApiResponse<any>> {
    return this.http.post('https://fakestoreapi.com/auth/login', loginData).pipe(
      map(res => ({
        data: res,
        status: Status.Success,
        error: ''
      })),
      catchError(err => this.catchError(err, {}, Status.Failed, 'Login failed'))
    );
  }
}
