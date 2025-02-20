import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AddToCartRequest = {
  product_id: Scalars['Int'];
  qty: Scalars['Int'];
  shop_id: Scalars['Int'];
};

export type AddToCartResponse = Cart | ErrorResponse;

export type AuthResponse = ErrorResponse | Token;

export type BaseResponse = {
  __typename?: 'BaseResponse';
  code: Scalars['String'];
  message: Scalars['String'];
  success: Scalars['Boolean'];
};

export type Cart = {
  __typename?: 'Cart';
  created_at?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  is_product_deleted?: Maybe<Scalars['Boolean']>;
  product_id?: Maybe<Scalars['Int']>;
  qty?: Maybe<Scalars['Int']>;
  shop_id?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['String']>;
};

export type CartList = {
  __typename?: 'CartList';
  carts?: Maybe<Array<Maybe<Cart>>>;
};

export type CartsResponse = CartList | ErrorResponse;

export type City = {
  __typename?: 'City';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type District = {
  __typename?: 'District';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type ErrorResponse = {
  __typename?: 'ErrorResponse';
  code: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addToCart?: Maybe<AddToCartResponse>;
  deleteFromCart?: Maybe<CartsResponse>;
  deleteProduct?: Maybe<ErrorResponse>;
  login?: Maybe<AuthResponse>;
  logout?: Maybe<ErrorResponse>;
  register?: Maybe<AuthResponse>;
  saveProduct?: Maybe<SaveProductResponse>;
  saveShop?: Maybe<ShopsResponse>;
  updateCartQty?: Maybe<CartsResponse>;
};


export type MutationAddToCartArgs = {
  cart?: InputMaybe<AddToCartRequest>;
};


export type MutationDeleteFromCartArgs = {
  id?: InputMaybe<Scalars['Int']>;
};


export type MutationDeleteProductArgs = {
  id?: InputMaybe<Scalars['Int']>;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationLogoutArgs = {
  token: Scalars['String'];
};


export type MutationRegisterArgs = {
  user?: InputMaybe<UserRegisterRequest>;
};


export type MutationSaveProductArgs = {
  product?: InputMaybe<SaveProductRequest>;
};


export type MutationSaveShopArgs = {
  shop?: InputMaybe<SaveShopRequest>;
};


export type MutationUpdateCartQtyArgs = {
  id?: InputMaybe<Scalars['Int']>;
  qty?: InputMaybe<Scalars['Int']>;
};

export type PaginationRequest = {
  cursor: Scalars['Int'];
  limit?: InputMaybe<Scalars['Int']>;
};

export type PaginationResponse = {
  __typename?: 'PaginationResponse';
  limit?: Maybe<Scalars['Int']>;
  next_cursor?: Maybe<Scalars['Int']>;
  previous_cursor?: Maybe<Scalars['Int']>;
  total_data?: Maybe<Scalars['Int']>;
};

export type Product = {
  __typename?: 'Product';
  created_at?: Maybe<Scalars['String']>;
  deleted_at?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  price?: Maybe<Scalars['Float']>;
  shop_id: Scalars['Int'];
  stock_quantity?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['String']>;
  user_id: Scalars['Int'];
};

export type ProductList = {
  __typename?: 'ProductList';
  pagination?: Maybe<PaginationResponse>;
  products?: Maybe<Array<Maybe<Product>>>;
};

export type ProductsResponse = ErrorResponse | ProductList;

export type ProfileResponse = ErrorResponse | UserSingleResult;

export type Province = {
  __typename?: 'Province';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  cart?: Maybe<CartsResponse>;
  me?: Maybe<ProfileResponse>;
  products?: Maybe<ProductsResponse>;
  shops?: Maybe<ShopsResponse>;
  version: Scalars['String'];
};


export type QueryProductsArgs = {
  pagination?: InputMaybe<PaginationRequest>;
  productId?: InputMaybe<Scalars['Int']>;
  q?: InputMaybe<Scalars['String']>;
  shopId?: InputMaybe<Scalars['Int']>;
};


export type QueryShopsArgs = {
  pagination?: InputMaybe<PaginationRequest>;
  q?: InputMaybe<Scalars['String']>;
  shopId?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['Int']>;
};

export type SaveProductRequest = {
  description: Scalars['String'];
  id?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  price: Scalars['Float'];
  stock_quantity: Scalars['Int'];
};

export type SaveProductResponse = ErrorResponse | Product;

export type SaveShopRequest = {
  address?: InputMaybe<Scalars['String']>;
  city_id: Scalars['Int'];
  closed_at?: InputMaybe<Scalars['String']>;
  coordinate: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  district_id: Scalars['Int'];
  icon?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  opened_at?: InputMaybe<Scalars['String']>;
  postal_code: Scalars['Int'];
  province_id: Scalars['Int'];
};

export type Shop = {
  __typename?: 'Shop';
  address?: Maybe<Scalars['String']>;
  city_id: Scalars['Int'];
  closed_at?: Maybe<Scalars['String']>;
  coordinate: Scalars['String'];
  created_at?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  district_id: Scalars['Int'];
  icon?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  opened_at?: Maybe<Scalars['String']>;
  postal_code: Scalars['Int'];
  province_id: Scalars['Int'];
  updated_at?: Maybe<Scalars['String']>;
  user_id: Scalars['Int'];
};

export type ShopList = {
  __typename?: 'ShopList';
  pagination?: Maybe<PaginationResponse>;
  shops?: Maybe<Array<Maybe<Shop>>>;
};

export type ShopsResponse = ErrorResponse | ShopList;

export type Token = {
  __typename?: 'Token';
  jwt: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  created_at?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type UserDetail = {
  __typename?: 'UserDetail';
  address?: Maybe<Scalars['String']>;
  city?: Maybe<City>;
  created_at?: Maybe<Scalars['String']>;
  district?: Maybe<District>;
  fullname?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  postal_code?: Maybe<Scalars['String']>;
  province?: Maybe<Province>;
  updated_at?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['Int']>;
};

export type UserRegisterRequest = {
  address?: InputMaybe<Scalars['String']>;
  city_id?: InputMaybe<Scalars['Int']>;
  district_id?: InputMaybe<Scalars['Int']>;
  email: Scalars['String'];
  fullname: Scalars['String'];
  password: Scalars['String'];
  province_id?: InputMaybe<Scalars['Int']>;
  username: Scalars['String'];
};

export type UserSingleResult = {
  __typename?: 'UserSingleResult';
  details?: Maybe<UserDetail>;
  user?: Maybe<User>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AddToCartRequest: AddToCartRequest;
  AddToCartResponse: ResolversTypes['Cart'] | ResolversTypes['ErrorResponse'];
  AuthResponse: ResolversTypes['ErrorResponse'] | ResolversTypes['Token'];
  BaseResponse: ResolverTypeWrapper<BaseResponse>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Cart: ResolverTypeWrapper<Cart>;
  CartList: ResolverTypeWrapper<CartList>;
  CartsResponse: ResolversTypes['CartList'] | ResolversTypes['ErrorResponse'];
  City: ResolverTypeWrapper<City>;
  District: ResolverTypeWrapper<District>;
  ErrorResponse: ResolverTypeWrapper<ErrorResponse>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  PaginationRequest: PaginationRequest;
  PaginationResponse: ResolverTypeWrapper<PaginationResponse>;
  Product: ResolverTypeWrapper<Product>;
  ProductList: ResolverTypeWrapper<ProductList>;
  ProductsResponse: ResolversTypes['ErrorResponse'] | ResolversTypes['ProductList'];
  ProfileResponse: ResolversTypes['ErrorResponse'] | ResolversTypes['UserSingleResult'];
  Province: ResolverTypeWrapper<Province>;
  Query: ResolverTypeWrapper<{}>;
  SaveProductRequest: SaveProductRequest;
  SaveProductResponse: ResolversTypes['ErrorResponse'] | ResolversTypes['Product'];
  SaveShopRequest: SaveShopRequest;
  Shop: ResolverTypeWrapper<Shop>;
  ShopList: ResolverTypeWrapper<ShopList>;
  ShopsResponse: ResolversTypes['ErrorResponse'] | ResolversTypes['ShopList'];
  String: ResolverTypeWrapper<Scalars['String']>;
  Token: ResolverTypeWrapper<Token>;
  User: ResolverTypeWrapper<User>;
  UserDetail: ResolverTypeWrapper<UserDetail>;
  UserRegisterRequest: UserRegisterRequest;
  UserSingleResult: ResolverTypeWrapper<UserSingleResult>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AddToCartRequest: AddToCartRequest;
  AddToCartResponse: ResolversParentTypes['Cart'] | ResolversParentTypes['ErrorResponse'];
  AuthResponse: ResolversParentTypes['ErrorResponse'] | ResolversParentTypes['Token'];
  BaseResponse: BaseResponse;
  Boolean: Scalars['Boolean'];
  Cart: Cart;
  CartList: CartList;
  CartsResponse: ResolversParentTypes['CartList'] | ResolversParentTypes['ErrorResponse'];
  City: City;
  District: District;
  ErrorResponse: ErrorResponse;
  Float: Scalars['Float'];
  Int: Scalars['Int'];
  Mutation: {};
  PaginationRequest: PaginationRequest;
  PaginationResponse: PaginationResponse;
  Product: Product;
  ProductList: ProductList;
  ProductsResponse: ResolversParentTypes['ErrorResponse'] | ResolversParentTypes['ProductList'];
  ProfileResponse: ResolversParentTypes['ErrorResponse'] | ResolversParentTypes['UserSingleResult'];
  Province: Province;
  Query: {};
  SaveProductRequest: SaveProductRequest;
  SaveProductResponse: ResolversParentTypes['ErrorResponse'] | ResolversParentTypes['Product'];
  SaveShopRequest: SaveShopRequest;
  Shop: Shop;
  ShopList: ShopList;
  ShopsResponse: ResolversParentTypes['ErrorResponse'] | ResolversParentTypes['ShopList'];
  String: Scalars['String'];
  Token: Token;
  User: User;
  UserDetail: UserDetail;
  UserRegisterRequest: UserRegisterRequest;
  UserSingleResult: UserSingleResult;
}>;

export type AddToCartResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['AddToCartResponse'] = ResolversParentTypes['AddToCartResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Cart' | 'ErrorResponse', ParentType, ContextType>;
}>;

export type AuthResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthResponse'] = ResolversParentTypes['AuthResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorResponse' | 'Token', ParentType, ContextType>;
}>;

export type BaseResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['BaseResponse'] = ResolversParentTypes['BaseResponse']> = ResolversObject<{
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CartResolvers<ContextType = any, ParentType extends ResolversParentTypes['Cart'] = ResolversParentTypes['Cart']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  is_product_deleted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  product_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  qty?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  shop_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CartListResolvers<ContextType = any, ParentType extends ResolversParentTypes['CartList'] = ResolversParentTypes['CartList']> = ResolversObject<{
  carts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Cart']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CartsResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CartsResponse'] = ResolversParentTypes['CartsResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CartList' | 'ErrorResponse', ParentType, ContextType>;
}>;

export type CityResolvers<ContextType = any, ParentType extends ResolversParentTypes['City'] = ResolversParentTypes['City']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DistrictResolvers<ContextType = any, ParentType extends ResolversParentTypes['District'] = ResolversParentTypes['District']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ErrorResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ErrorResponse'] = ResolversParentTypes['ErrorResponse']> = ResolversObject<{
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addToCart?: Resolver<Maybe<ResolversTypes['AddToCartResponse']>, ParentType, ContextType, Partial<MutationAddToCartArgs>>;
  deleteFromCart?: Resolver<Maybe<ResolversTypes['CartsResponse']>, ParentType, ContextType, Partial<MutationDeleteFromCartArgs>>;
  deleteProduct?: Resolver<Maybe<ResolversTypes['ErrorResponse']>, ParentType, ContextType, Partial<MutationDeleteProductArgs>>;
  login?: Resolver<Maybe<ResolversTypes['AuthResponse']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'password' | 'username'>>;
  logout?: Resolver<Maybe<ResolversTypes['ErrorResponse']>, ParentType, ContextType, RequireFields<MutationLogoutArgs, 'token'>>;
  register?: Resolver<Maybe<ResolversTypes['AuthResponse']>, ParentType, ContextType, Partial<MutationRegisterArgs>>;
  saveProduct?: Resolver<Maybe<ResolversTypes['SaveProductResponse']>, ParentType, ContextType, Partial<MutationSaveProductArgs>>;
  saveShop?: Resolver<Maybe<ResolversTypes['ShopsResponse']>, ParentType, ContextType, Partial<MutationSaveShopArgs>>;
  updateCartQty?: Resolver<Maybe<ResolversTypes['CartsResponse']>, ParentType, ContextType, Partial<MutationUpdateCartQtyArgs>>;
}>;

export type PaginationResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaginationResponse'] = ResolversParentTypes['PaginationResponse']> = ResolversObject<{
  limit?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  next_cursor?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  previous_cursor?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  total_data?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deleted_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  shop_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  stock_quantity?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductListResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductList'] = ResolversParentTypes['ProductList']> = ResolversObject<{
  pagination?: Resolver<Maybe<ResolversTypes['PaginationResponse']>, ParentType, ContextType>;
  products?: Resolver<Maybe<Array<Maybe<ResolversTypes['Product']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductsResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductsResponse'] = ResolversParentTypes['ProductsResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorResponse' | 'ProductList', ParentType, ContextType>;
}>;

export type ProfileResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProfileResponse'] = ResolversParentTypes['ProfileResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorResponse' | 'UserSingleResult', ParentType, ContextType>;
}>;

export type ProvinceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Province'] = ResolversParentTypes['Province']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  cart?: Resolver<Maybe<ResolversTypes['CartsResponse']>, ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes['ProfileResponse']>, ParentType, ContextType>;
  products?: Resolver<Maybe<ResolversTypes['ProductsResponse']>, ParentType, ContextType, Partial<QueryProductsArgs>>;
  shops?: Resolver<Maybe<ResolversTypes['ShopsResponse']>, ParentType, ContextType, Partial<QueryShopsArgs>>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type SaveProductResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SaveProductResponse'] = ResolversParentTypes['SaveProductResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorResponse' | 'Product', ParentType, ContextType>;
}>;

export type ShopResolvers<ContextType = any, ParentType extends ResolversParentTypes['Shop'] = ResolversParentTypes['Shop']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  city_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  closed_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  coordinate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  district_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  opened_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  postal_code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  province_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ShopListResolvers<ContextType = any, ParentType extends ResolversParentTypes['ShopList'] = ResolversParentTypes['ShopList']> = ResolversObject<{
  pagination?: Resolver<Maybe<ResolversTypes['PaginationResponse']>, ParentType, ContextType>;
  shops?: Resolver<Maybe<Array<Maybe<ResolversTypes['Shop']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ShopsResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ShopsResponse'] = ResolversParentTypes['ShopsResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ErrorResponse' | 'ShopList', ParentType, ContextType>;
}>;

export type TokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['Token'] = ResolversParentTypes['Token']> = ResolversObject<{
  jwt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserDetailResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserDetail'] = ResolversParentTypes['UserDetail']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  city?: Resolver<Maybe<ResolversTypes['City']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  district?: Resolver<Maybe<ResolversTypes['District']>, ParentType, ContextType>;
  fullname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  postal_code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  province?: Resolver<Maybe<ResolversTypes['Province']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserSingleResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserSingleResult'] = ResolversParentTypes['UserSingleResult']> = ResolversObject<{
  details?: Resolver<Maybe<ResolversTypes['UserDetail']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  AddToCartResponse?: AddToCartResponseResolvers<ContextType>;
  AuthResponse?: AuthResponseResolvers<ContextType>;
  BaseResponse?: BaseResponseResolvers<ContextType>;
  Cart?: CartResolvers<ContextType>;
  CartList?: CartListResolvers<ContextType>;
  CartsResponse?: CartsResponseResolvers<ContextType>;
  City?: CityResolvers<ContextType>;
  District?: DistrictResolvers<ContextType>;
  ErrorResponse?: ErrorResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PaginationResponse?: PaginationResponseResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  ProductList?: ProductListResolvers<ContextType>;
  ProductsResponse?: ProductsResponseResolvers<ContextType>;
  ProfileResponse?: ProfileResponseResolvers<ContextType>;
  Province?: ProvinceResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SaveProductResponse?: SaveProductResponseResolvers<ContextType>;
  Shop?: ShopResolvers<ContextType>;
  ShopList?: ShopListResolvers<ContextType>;
  ShopsResponse?: ShopsResponseResolvers<ContextType>;
  Token?: TokenResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserDetail?: UserDetailResolvers<ContextType>;
  UserSingleResult?: UserSingleResultResolvers<ContextType>;
}>;

