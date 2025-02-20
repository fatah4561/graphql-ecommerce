# Graphql e-commerce

## About

Building a feature-rich graphql e-commerce using encore.ts with apollo-server. This serves as my journal on learning Typescript, Encore.ts, GraphQL, on back-end side.

Basic Features

* [X] Basic JWT Authentication & Registration (username & password) hashed with bcrypt
* [X] Single user manage single shop
* [X] User manage their products
* [X] View products with keyset pagination
* [ ] User file management (e.g product image), since grapqhl can't serve file directly a separate file management system is needed with REST API
* [ ] Payment system (using 3rd party payment gateway)
* [ ] Cart system able to add items as guest, but account is required on checkout
* [ ] Ordering system able to order multi products of different shops (split the delivery per shop), also has order histories
* [ ] Delivery & tracking system
* [ ] Reviews system (rating, comment, images)
* [ ] Wishlist system
* [ ] DIscount system
* [ ] API docs
* [ ] Cronjob to reset the app data each day for encore cloud (preventing abuse on my free plan -.-)

Advance Features

* [ ] Multi factor authentication (MFA)
* [ ] Oauth or social login (Google, Facebook)
* [ ] Rate limiting (especially on login and register)
* [ ] Caching for cart system (using redis)
* [ ] Products variant & categories system
* [ ] Admin dashboard for analytic
* [ ] Action logs system (turn into EDA in some services)
* [ ] Features flag system (to enable or disable some feature)

## Try in sandbox

My preferred ways to try graphql is using apollo studio explorer web app ([here](https://studio.apollographql.com/sandbox/explorer "Apollo sandbox")) then put the url:

```
https://staging-graphql-ecommerce-cpvi.encr.app/graphql
```

You can use the sandbox account

* username: techguy@example.com
* password: password

Or create a new account

## Running in local

Check [this](https://encore.dev/docs/ts/install) guide to install encore if not installed yet, then run

```zsh
encore run
```

While `encore run` is running, open [http://localhost:9400/](http://localhost:9400/) to view Encore's [local developer dashboard](https://encore.dev/docs/ts/observability/dev-dash). While the API endpoint should be [http://127.0.0.1:4000](http://127.0.0.1:4000) if no config was changed. Running encore will automatically run the migration to the database, I also have included the seeder so you can play around with dummy data, to access encore database you can consult the guide [here](https://encore.dev/docs/ts/primitives/databases).

Next make sure to set secret for the JWK_PUBLIC_KEY (SPKI format) and JWK_PRIVATE_KEY (PKCS8Pem format) using

```zsh
encore set --type dev,local JWK_PRIVATE_KEY
```

Just in case the generated GraphQL code is not up to date then run

```zsh
npm run generate
```

## Notes

setting encore secret might get stuck if values is too long, solution is to use input redirection:

```zsh
cat private.txt | encore secret set --type dev,local JWK_PRIVATE_KEY
```

## Testing

```bash
encore test
```
