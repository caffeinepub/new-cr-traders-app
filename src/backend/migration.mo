import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  type Product = {
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

  type Category = {
    id : Text;
    name : Text;
    emoji : Text;
  };

  type Order = {
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

  type AnonOrder = {
    id : Text;
    customerName : Text;
    customerPhone : Text;
    deliveryAddress : Text;
    items : Text;
    totalAmount : Text;
    status : Text;
    createdAt : Time.Time;
  };

  type UserProfile = {
    fullName : Text;
    phone : Text;
    email : Text;
    address : Text;
    city : Text;
    state : Text;
  };

  public type OldActor = {
    loyaltyPoints : Map.Map<Principal, Nat>;
    productStore : Map.Map<Text, Product>;
    categoryStore : Map.Map<Text, Category>;
    orderStore : Map.Map<Text, Order>;
    userProfiles : Map.Map<Principal, UserProfile>;
    adminPhone : Text;
    adminPin : Text;
  };

  public type NewActor = {
    loyaltyPoints : Map.Map<Principal, Nat>;
    productStore : Map.Map<Text, Product>;
    categoryStore : Map.Map<Text, Category>;
    orderStore : Map.Map<Text, Order>;
    anonOrderStore : Map.Map<Text, AnonOrder>;
    userProfiles : Map.Map<Principal, UserProfile>;
    adminPhone : Text;
    adminPin : Text;
  };

  public func run(old : OldActor) : NewActor {
    {
      loyaltyPoints = old.loyaltyPoints;
      productStore = old.productStore;
      categoryStore = old.categoryStore;
      orderStore = old.orderStore;
      userProfiles = old.userProfiles;
      adminPhone = old.adminPhone;
      adminPin = old.adminPin;
      anonOrderStore = Map.empty<Text, AnonOrder>();
    };
  };
};
