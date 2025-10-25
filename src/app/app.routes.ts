import { Routes } from '@angular/router';
import { authGuardGuard } from './core/guards/auth-guard-guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./features/home/home').then(c => c.Home) },
    { path: 'login', loadComponent: () => import('./features/users/login/login').then(c => c.Login) },
    { path: 'products', loadComponent: () => import('./features/products/products').then(c => c.Products), canActivate: [authGuardGuard] },
    { path: 'products/add-product', loadComponent: () => import('./features/products/add-product/add-product').then(c => c.AddProduct) },
    { path: 'products/add-product/:productId', loadComponent: () => import('./features/products/add-product/add-product').then(c => c.AddProduct) },
    { path: 'cart/:userId', loadComponent: () => import('./features/cart/cart').then(c => c.Cart), canActivate: [authGuardGuard] },
];
