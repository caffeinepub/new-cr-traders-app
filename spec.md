# NEW CR TRADERS App

## Current State
Orders saved to customer localStorage only. Admin on different device cannot see them.

## Requested Changes (Diff)

### Add
- createOrderAnon: public backend, no ICP auth, saves order with phone as ID
- getAllOrdersAdmin: takes admin PIN, returns all orders
- updateOrderStatusAdmin: takes order ID, status, PIN

### Modify
- Checkout.tsx: also call backend createOrderAnon
- AdminDashboard.tsx: fetch orders from backend on mount and refresh

### Remove
- Nothing

## Implementation Plan
1. Regenerate backend with public order functions
2. Update Checkout to save to backend
3. Update AdminDashboard to read from backend
