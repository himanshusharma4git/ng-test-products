import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { Product, Status } from '../../core/models/products';
import { DataService } from '../../core/services/data';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart {
  @Input() userId:number | null = null;

  cart = signal<Product[]>([]);
  status = signal<Status>(Status.Pending)

  private ds = inject(DataService)

  ngOnChanges(change: SimpleChanges){
    if(change['userId']?.firstChange && this.userId){
      this.ds.getCartById(this.userId)
      .subscribe((res) => {
        this.status.set(res.status)
        if(res.status === Status.Success){
          this.cart.set(res.data);
        }
      })
    }
  }
  
}
