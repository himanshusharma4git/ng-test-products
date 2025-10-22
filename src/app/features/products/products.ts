import { Component, inject, signal } from '@angular/core';
import { DataService } from '../../core/services/data';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { map } from 'rxjs';
import { Status } from '../../core/models/products';
import { RouterLink } from '@angular/router';
import { Product } from './product/product';

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe, RouterLink, Product],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products {
  private ds = inject(DataService);

  status = signal<Status>(Status.Pending);
  selectedProductId = signal<number>(0);
  products = toSignal(this.ds.getAllProducts().pipe(map(res => {
    this.status.set(res.status);
    return res.data
  })));

  selectProduct(id: number) {
    console.log('Selected Product ID:', id);
    this.selectedProductId.set(id ?? 0);
  }
}
