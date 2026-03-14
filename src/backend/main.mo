import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  // Loyalty Points
  let loyaltyPoints = Map.empty<Principal, Nat>();

  // Product Store
  let productStore = Map.empty<Text, Product>();
  let categoryStore = Map.empty<Text, Category>();

  // Orders
  let orderStore = Map.empty<Text, Order>();

  // User Profiles
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Admin authentication (legacy - kept for backward compatibility but restricted)
  let adminPhone = "9358251328";
  let adminPin = "NCR9358";

  // Product Modules with Comparison Functions
  module Product {
    public func compare(a : Product, b : Product) : Order.Order {
      Text.compare(a.id, b.id);
    };

    public func compareByName(a : Product, b : Product) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  // Product Types
  public type Product = {
    id : Text;
    name : Text;
    categoryId : Text;
    description : Text;
    size : Text;
    isPacked : Bool;
    price : Text;
    imageUrl : Text;
    isAvailable : Bool;
    brand : ?Text;
    mrp : ?Text;
  };

  // Category Types
  public type Category = {
    id : Text;
    name : Text;
    emoji : Text;
  };

  // Order Types
  public type Order = {
    id : Text;
    customerId : Principal;
    customerName : Text;
    customerPhone : Text;
    deliveryAddress : Text;
    items : Text;
    totalAmount : Text;
    status : Text;
    createdAt : Time.Time;
  };

  // Review Types
  public type Review = {
    productId : Text;
    userId : Text;
    rating : Nat;
    comment : Text;
  };

  public type UserProfile = {
    fullName : Text;
    phone : Text;
    email : Text;
    address : Text;
    city : Text;
    state : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Loyalty Points
  public shared ({ caller }) func addLoyaltyPoints(userId : Principal, points : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add loyalty points");
    };
    let currentPoints = switch (loyaltyPoints.get(userId)) {
      case (null) { 0 };
      case (?p) { p };
    };
    loyaltyPoints.add(userId, currentPoints + points);
  };

  public query ({ caller }) func getLoyaltyPoints(userId : Principal) : async Nat {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own loyalty points");
    };
    switch (loyaltyPoints.get(userId)) {
      case (null) { 0 };
      case (?points) { points };
    };
  };

  // Products
  public shared ({ caller }) func createProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    if (productStore.containsKey(product.id)) {
      Runtime.trap("Product with this ID already exists");
    };
    productStore.add(product.id, product);
  };

  public query ({ caller }) func getProduct(id : Text) : async Product {
    switch (productStore.get(id)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    productStore.values().toArray().sort();
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    if (not (productStore.containsKey(product.id))) {
      Runtime.trap("Product does not exist");
    };
    productStore.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    if (not (productStore.containsKey(id))) {
      Runtime.trap("Product does not exist");
    };
    productStore.remove(id);
  };

  // Categories
  public shared ({ caller }) func createCategory(category : Category) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create categories");
    };
    if (categoryStore.containsKey(category.id)) {
      Runtime.trap("Category with this ID already exists");
    };
    categoryStore.add(category.id, category);
  };

  public query ({ caller }) func getCategory(id : Text) : async Category {
    switch (categoryStore.get(id)) {
      case (null) { Runtime.trap("Category does not exist") };
      case (?category) { category };
    };
  };

  public query ({ caller }) func getAllCategories() : async [Category] {
    categoryStore.values().toArray();
  };

  public shared ({ caller }) func updateCategory(category : Category) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update categories");
    };
    if (not (categoryStore.containsKey(category.id))) {
      Runtime.trap("Category does not exist");
    };
    categoryStore.add(category.id, category);
  };

  public shared ({ caller }) func deleteCategory(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete categories");
    };
    if (not (categoryStore.containsKey(id))) {
      Runtime.trap("Category does not exist");
    };
    categoryStore.remove(id);
  };

  // Orders
  public shared ({ caller }) func createOrder(order : Order) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };
    if (orderStore.containsKey(order.id)) {
      Runtime.trap("Order with this ID already exists");
    };
    // Verify the order belongs to the caller
    if (order.customerId != caller) {
      Runtime.trap("Unauthorized: Cannot create order for another user");
    };
    orderStore.add(order.id, order);
  };

  public query ({ caller }) func getOrder(id : Text) : async Order {
    switch (orderStore.get(id)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        // Users can only view their own orders, admins can view all
        if (order.customerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        order;
      };
    };
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };

    let allOrders = orderStore.values().toArray();

    // Admins can see all orders, regular users only see their own
    if (AccessControl.isAdmin(accessControlState, caller)) {
      allOrders;
    } else {
      let filteredOrders = allOrders.filter(
        func(order) {
          order.customerId == caller;
        }
      );
      filteredOrders;
    };
  };

  public shared ({ caller }) func updateOrder(order : Order) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update orders");
    };
    if (not (orderStore.containsKey(order.id))) {
      Runtime.trap("Order does not exist");
    };

    // Verify ownership or admin status
    switch (orderStore.get(order.id)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?existingOrder) {
        if (existingOrder.customerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own orders");
        };
      };
    };

    orderStore.add(order.id, order);
  };

  public shared ({ caller }) func deleteOrder(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete orders");
    };
    if (not (orderStore.containsKey(id))) {
      Runtime.trap("Order does not exist");
    };
    orderStore.remove(id);
  };

  // Admin check (legacy function - restricted to admin use only)
  public query ({ caller }) func isAdmin(phone : Text, pin : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can use this function");
    };
    phone == adminPhone and pin == adminPin;
  };

  // Seed data function
  public shared ({ caller }) func initializeSeedData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize seed data");
    };

    // Seed categories
    let categories = [
      { id = "1"; name = "Dal"; emoji = "🌾" },
      { id = "2"; name = "Masale"; emoji = "🥄" },
      { id = "3"; name = "Rice"; emoji = "🍚" },
      { id = "4"; name = "Meva"; emoji = "🥜" },
      { id = "5"; name = "Pooja Items"; emoji = "🪔" },
    ];

    for (category in categories.values()) {
      categoryStore.add(category.id, category);
    };

    // Seed products
    let products = [
      {
        id = "1";
        name = "Arhar Dal";
        categoryId = "1";
        description = "Premium quality Toor dal";
        size = "1kg";
        isPacked = true;
        price = "120";
        imageUrl = "https://example.com/arhar-dal.jpg";
        isAvailable = true;
        brand = ?"Best Farms";
        mrp = ?"150";
      },
      {
        id = "2";
        name = "Basmati Rice";
        categoryId = "3";
        description = "Long grain basmati rice";
        size = "5kg";
        isPacked = true;
        price = "500";
        imageUrl = "https://example.com/basmati.jpg";
        isAvailable = true;
        brand = ?"Best Farms";
        mrp = ?"550";
      },
      {
        id = "3";
        name = "Cashews";
        categoryId = "4";
        description = "Premium quality cashews";
        size = "500g";
        isPacked = true;
        price = "400";
        imageUrl = "https://example.com/cashews.jpg";
        isAvailable = true;
        brand = ?"Best Farms";
        mrp = ?"450";
      },
      {
        id = "4";
        name = "Turmeric Powder";
        categoryId = "2";
        description = "Pure turmeric powder";
        size = "200g";
        isPacked = true;
        price = "60";
        imageUrl = "https://example.com/turmeric.jpg";
        isAvailable = true;
        brand = ?"Best Farms";
        mrp = ?"80";
      },
      {
        id = "5";
        name = "Agarbatti";
        categoryId = "5";
        description = "Sandal fragrance agarbatti";
        size = "12 sticks";
        isPacked = true;
        price = "200";
        imageUrl = "https://example.com/agarbatti.jpg";
        isAvailable = true;
        brand = ?"Best Farms";
        mrp = ?"220";
      },
    ];

    for (product in products.values()) {
      productStore.add(product.id, product);
    };
  };
};
