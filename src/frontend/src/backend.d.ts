import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Category {
    id: string;
    name: string;
    emoji: string;
}
export type Time = bigint;
export interface AnonOrder {
    id: string;
    customerName: string;
    status: string;
    deliveryAddress: string;
    customerPhone: string;
    createdAt: Time;
    totalAmount: string;
    items: string;
}
export interface Order {
    id: string;
    customerName: string;
    status: string;
    deliveryAddress: string;
    customerPhone: string;
    createdAt: Time;
    totalAmount: string;
    customerId: Principal;
    items: string;
}
export interface UserProfile {
    city: string;
    fullName: string;
    email: string;
    state: string;
    address: string;
    phone: string;
}
export interface Product {
    id: string;
    mrp?: string;
    categoryId: string;
    isPacked: boolean;
    name: string;
    size: string;
    isAvailable: boolean;
    description: string;
    imageUrl: string;
    brand?: string;
    price: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addLoyaltyPoints(userId: Principal, points: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCategory(category: Category): Promise<void>;
    createOrder(order: Order): Promise<void>;
    createOrderAnon(customerName: string, customerPhone: string, deliveryAddress: string, items: string, totalAmount: string): Promise<string>;
    createProduct(product: Product): Promise<void>;
    deleteCategory(id: string): Promise<void>;
    deleteOrder(id: string): Promise<void>;
    deleteProduct(id: string): Promise<void>;
    getAllCategories(): Promise<Array<Category>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllOrdersAdmin(pin: string): Promise<Array<AnonOrder>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategory(id: string): Promise<Category>;
    getLoyaltyPoints(userId: Principal): Promise<bigint>;
    getOrder(id: string): Promise<Order>;
    getProduct(id: string): Promise<Product>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeSeedData(): Promise<void>;
    isAdmin(phone: string, pin: string): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCategory(category: Category): Promise<void>;
    updateOrder(order: Order): Promise<void>;
    updateOrderStatusAdmin(orderId: string, newStatus: string, pin: string): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
