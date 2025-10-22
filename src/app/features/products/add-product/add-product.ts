import { Component, Input, signal, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../core/services/data';
import { Status } from '../../../core/models/products';

@Component({
  selector: 'app-add-product',
  imports: [ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.scss'
})
export class AddProduct {
  productForm!: FormGroup;
  loading = signal<boolean>(false);

  @Input() productId: number | null = null;

  constructor(private fb: FormBuilder, private ds: DataService) {
    this.productForm = this.fb.group({
      id: [0],
      title: ['', Validators.required],
      price: [0, Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      image: ['', Validators.required]
    })
  }

  onSubmit() {
    this.loading.set(true);
    this.ds.addProduct(this.productForm.value).subscribe((res) => {
      if(res.status === 'success') {
        console.log('Product added successfully:', res.data);
        this.productForm.reset();
      } else {
        console.error('Failed to add product:', res.error);
      }
      this.loading.set(false);
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Changes detected:', changes);
    if (changes['productId'] && this.productId) {
      this.fetchProduct(this.productId);
    }
  }

  ngOnInit() {
    console.log('Product ID:', this.productId);
    this.fetchProduct(this.productId!);
  }

  fetchProduct(id: number) {
    if(this.productId) {
      this.ds.getProductById(this.productId).subscribe((res) => {
        if(res.status === 'success') {
          this.productForm.patchValue(res.data);
        } else {
          console.error('Failed to fetch product details:', res.error);
        }
      });
    }
  }

}
