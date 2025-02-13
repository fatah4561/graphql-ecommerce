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

export type City = {
  __typename?: 'City';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type CommonResponse = {
  __typename?: 'CommonResponse';
  code: Scalars['String'];
  message: Scalars['String'];
  success: Scalars['Boolean'];
};

export type District = {
  __typename?: 'District';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type GetProfileResponse = {
  __typename?: 'GetProfileResponse';
  details?: Maybe<UserDetail>;
  response?: Maybe<CommonResponse>;
  user?: Maybe<User>;
};

export type GetShopsResponse = {
  __typename?: 'GetShopsResponse';
  pagination?: Maybe<PaginationResponse>;
  response?: Maybe<CommonResponse>;
  shops?: Maybe<Array<Maybe<Shop>>>;
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  response?: Maybe<CommonResponse>;
  token: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login?: Maybe<LoginResponse>;
  logout?: Maybe<CommonResponse>;
  register?: Maybe<UserRegisterResponse>;
  save_shop?: Maybe<GetShopsResponse>;
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


export type MutationSave_ShopArgs = {
  shop?: InputMaybe<SaveShopRequest>;
};

export type PaginationRequest = {
  limit?: InputMaybe<Scalars['Int']>;
  start_key?: InputMaybe<Scalars['Int']>;
};

export type PaginationResponse = {
  __typename?: 'PaginationResponse';
  limit?: Maybe<Scalars['Int']>;
  next_key?: Maybe<Scalars['Int']>;
  previous_key?: Maybe<Scalars['Int']>;
  total_data?: Maybe<Scalars['Int']>;
};

export type Province = {
  __typename?: 'Province';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  profile?: Maybe<GetProfileResponse>;
  shops?: Maybe<GetShopsResponse>;
};


export type QueryShopsArgs = {
  pagination?: InputMaybe<PaginationRequest>;
  q?: InputMaybe<Scalars['String']>;
};

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

export type UserRegisterResponse = {
  __typename?: 'UserRegisterResponse';
  response?: Maybe<CommonResponse>;
  token: Scalars['String'];
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
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  City: ResolverTypeWrapper<City>;
  CommonResponse: ResolverTypeWrapper<CommonResponse>;
  District: ResolverTypeWrapper<District>;
  GetProfileResponse: ResolverTypeWrapper<GetProfileResponse>;
  GetShopsResponse: ResolverTypeWrapper<GetShopsResponse>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  LoginResponse: ResolverTypeWrapper<LoginResponse>;
  Mutation: ResolverTypeWrapper<{}>;
  PaginationRequest: PaginationRequest;
  PaginationResponse: ResolverTypeWrapper<PaginationResponse>;
  Province: ResolverTypeWrapper<Province>;
  Query: ResolverTypeWrapper<{}>;
  SaveShopRequest: SaveShopRequest;
  Shop: ResolverTypeWrapper<Shop>;
  String: ResolverTypeWrapper<Scalars['String']>;
  User: ResolverTypeWrapper<User>;
  UserDetail: ResolverTypeWrapper<UserDetail>;
  UserRegisterRequest: UserRegisterRequest;
  UserRegisterResponse: ResolverTypeWrapper<UserRegisterResponse>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean'];
  City: City;
  CommonResponse: CommonResponse;
  District: District;
  GetProfileResponse: GetProfileResponse;
  GetShopsResponse: GetShopsResponse;
  Int: Scalars['Int'];
  LoginResponse: LoginResponse;
  Mutation: {};
  PaginationRequest: PaginationRequest;
  PaginationResponse: PaginationResponse;
  Province: Province;
  Query: {};
  SaveShopRequest: SaveShopRequest;
  Shop: Shop;
  String: Scalars['String'];
  User: User;
  UserDetail: UserDetail;
  UserRegisterRequest: UserRegisterRequest;
  UserRegisterResponse: UserRegisterResponse;
}>;

export type CityResolvers<ContextType = any, ParentType extends ResolversParentTypes['City'] = ResolversParentTypes['City']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommonResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CommonResponse'] = ResolversParentTypes['CommonResponse']> = ResolversObject<{
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DistrictResolvers<ContextType = any, ParentType extends ResolversParentTypes['District'] = ResolversParentTypes['District']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GetProfileResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['GetProfileResponse'] = ResolversParentTypes['GetProfileResponse']> = ResolversObject<{
  details?: Resolver<Maybe<ResolversTypes['UserDetail']>, ParentType, ContextType>;
  response?: Resolver<Maybe<ResolversTypes['CommonResponse']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GetShopsResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['GetShopsResponse'] = ResolversParentTypes['GetShopsResponse']> = ResolversObject<{
  pagination?: Resolver<Maybe<ResolversTypes['PaginationResponse']>, ParentType, ContextType>;
  response?: Resolver<Maybe<ResolversTypes['CommonResponse']>, ParentType, ContextType>;
  shops?: Resolver<Maybe<Array<Maybe<ResolversTypes['Shop']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoginResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResponse'] = ResolversParentTypes['LoginResponse']> = ResolversObject<{
  response?: Resolver<Maybe<ResolversTypes['CommonResponse']>, ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  login?: Resolver<Maybe<ResolversTypes['LoginResponse']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'password' | 'username'>>;
  logout?: Resolver<Maybe<ResolversTypes['CommonResponse']>, ParentType, ContextType, RequireFields<MutationLogoutArgs, 'token'>>;
  register?: Resolver<Maybe<ResolversTypes['UserRegisterResponse']>, ParentType, ContextType, Partial<MutationRegisterArgs>>;
  save_shop?: Resolver<Maybe<ResolversTypes['GetShopsResponse']>, ParentType, ContextType, Partial<MutationSave_ShopArgs>>;
}>;

export type PaginationResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaginationResponse'] = ResolversParentTypes['PaginationResponse']> = ResolversObject<{
  limit?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  next_key?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  previous_key?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  total_data?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProvinceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Province'] = ResolversParentTypes['Province']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  profile?: Resolver<Maybe<ResolversTypes['GetProfileResponse']>, ParentType, ContextType>;
  shops?: Resolver<Maybe<ResolversTypes['GetShopsResponse']>, ParentType, ContextType, Partial<QueryShopsArgs>>;
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

export type UserRegisterResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserRegisterResponse'] = ResolversParentTypes['UserRegisterResponse']> = ResolversObject<{
  response?: Resolver<Maybe<ResolversTypes['CommonResponse']>, ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  City?: CityResolvers<ContextType>;
  CommonResponse?: CommonResponseResolvers<ContextType>;
  District?: DistrictResolvers<ContextType>;
  GetProfileResponse?: GetProfileResponseResolvers<ContextType>;
  GetShopsResponse?: GetShopsResponseResolvers<ContextType>;
  LoginResponse?: LoginResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PaginationResponse?: PaginationResponseResolvers<ContextType>;
  Province?: ProvinceResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Shop?: ShopResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserDetail?: UserDetailResolvers<ContextType>;
  UserRegisterResponse?: UserRegisterResponseResolvers<ContextType>;
}>;

