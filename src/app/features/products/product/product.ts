import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DataService } from '../../../core/services/data';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import { ApiResponse, Status } from '../../../core/models/products';

@Component({
  selector: 'app-product',
  imports: [CurrencyPipe],
  templateUrl: './product.html',
  styleUrl: './product.scss'
})
export class Product {

  @Input() selectedProductId: number = 0;
  private ds = inject(DataService);
  product = signal<any>(null);
  status = signal<Status>(Status.Pending);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedProductId'] && this.selectedProductId) {
      this.fetchProduct(this.selectedProductId);
    }
  }

  fetchProduct(id: number = this.selectedProductId) {
    this.status.set(Status.Pending);
    this.ds.getProductById(id).subscribe((res) => {
      if(res.status === 'success'){
        this.product.set(res.data);
      } else {
        console.error('Failed to fetch product:', res.error);
      }
      this.status.set(res.status);
    });
  } 
}
