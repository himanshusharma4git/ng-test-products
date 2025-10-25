import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
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

  getUsersById(id: number):Observable<ApiResponse<any>> {
    return this.http.get<any>(`https://fakestoreapi.com/users/${id}`).pipe(
      map(res => ({
        data: res,
        status:Status.Success,
        error: ''
      })),
      catchError(err => this.catchError(err, {} as any, Status.Failed))
    )
  }

  userLogin(loginData:LoginData):Observable<ApiResponse<any>> {
    return this.http.post<{token:string}>('https://fakestoreapi.com/auth/login', loginData).pipe(
      switchMap((token:{token:string}) => this.getUsersById(4).pipe(map(res => ({...res.data, ...token})))),
      map(res => ({
        data: res,
        status: Status.Success,
        error: ''
      })),
      catchError(err => this.catchError(err, {}, Status.Failed, 'Login failed'))
    );
  }

  getCartById(userId:number):Observable<ApiResponse<Product[]>>{
    return this.http.get<{ products: any[] }>('https://fakestoreapi.com/carts/'+ userId).pipe(
      switchMap(cart => forkJoin(cart.products.map(x => this.getProductById(x.productId)
        .pipe(map(product => ({ ...x, ...product.data })))))
      ),
      map(res => ({data:res as Product[], status: Status.Success, error:''})),
      catchError(err => this.catchError(err, {} as Product, Status.Failed, 'An error occurred while fetching the product details'))
    )
  }
}
