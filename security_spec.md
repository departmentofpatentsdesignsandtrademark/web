# Security Specification - Lumina Luxury

## 1. Data Invariants
- A product cannot exist without a name, price, and category.
- An order must have customer details (name, phone, address) and at least one item.
- Only authenticated admins can modify products, categories, banners, and update order statuses.
- Guests (unauthenticated users) can only:
    - Read products, categories, and banners.
    - Create orders (write-only to collection).
- Users cannot edit or delete orders once placed (only admin can).
- Every order must have `paymentMethod` set to `COD`.

## 2. The "Dirty Dozen" Payloads (Anti-Patterns)
1. **Admin Spoofing**: Attempting to create a product as an unauthenticated user.
2. **Price Manipulation**: Attempting to update a product price to ৳0 or negative.
3. **Ghost Orders**: Creating an order without any items.
4. **Order Status Injection**: A guest trying to set an order status to 'delivered' upon creation.
5. **PII Leakage**: A guest trying to read all documents in the `orders` collection.
6. **Shadow Fields**: Adding an `isAdmin` field to a user profile or order.
7. **Identity Theft**: Trying to delete a product by its ID without admin auth.
8. **Resource Exhaustion**: Sending a 1MB string as a product name.
9. **Update Gaps**: Updating an order status without the required status transition checks (if applicable).
10. **Orphaned Writes**: Creating an order that references a non-existent product ID.
11. **Timestamp Forgery**: Providing a `createdAt` timestamp from a client instead of `serverTimestamp()`.
12. **Id Poisoning**: Using a 1KB string as a document ID for a new product.

## 3. Test Runner - Logic
The `firestore.rules` will be verified against these patterns.
- `allow read: if true` for products.
- `allow write: if isAdmin()` for products.
- `allow create: if true` for orders (with strict validation).
- `allow read, update, delete: if isAdmin()` for orders.
