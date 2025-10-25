export enum Status {
    Success = 'success',
    Failed = 'failed',
    Pending = 'pending',
}
export type ApiResponse<T> = {
    data:T,
    status:Status,
    error?:string
}
export type Product = {
    id?: number,
    title: string,
    price: number,
    description: string,
    category: string,
    image: string,
    rating?: any,
    productId?:number,
    quantity?:number
  }
