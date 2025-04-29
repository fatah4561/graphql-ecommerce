# Graphql e-commerce

## About

This project is a feature-rich GraphQL e-commerce backend built with **Encore.ts** and **Apollo Server**.
It serves as my personal learning journal for **TypeScript, GraphQL, and Encore.ts** on the backend.

I designed this project with a strong emphasis on:
✅ Readability & Maintainability
✅ Clean Code & Separation of Concerns (SoC)
✅ Flexibility to Adapt into a REST API (thanks to encore, might need some modifications)

Basic Features

* [X] Basic JWT Authentication & Registration (username & password) hashed with bcrypt
* [X] Single user manage single shop
* [X] User manage their products
* [X] View products with keyset pagination
* [ ] User file management (e.g product image), since grapqhl can't serve file directly a separate file management system is needed with REST API
* [ ] Payment system (using 3rd party payment gateway)
* [X] Cart system able to add items as guest, but account is required on checkout
* [X] Ordering system able to order multi products of different shops (split the delivery per shop)
* [ ] Order histories
* [X] User can have multiple shipping address (on checkout can choose only 1)
* [ ] Delivery & tracking system
* [X] User has multiple delivery address
* [ ] Reviews system (rating, comment, images)
* [ ] Wishlist system
* [ ] DIscount system
* [ ] API docs
* [ ] Cronjob to reset the app data each day for encore cloud (preventing abuse on my free plan -.-)
* [ ] Unit Test

Advance Features

* [ ] Multi factor authentication (MFA)
* [ ] Oauth or social login (Google, Facebook)
* [ ] Rate limiting (especially on login and register)
* [ ] Caching for cart system (using redis)
* [ ] If guest has products in cart on log in merge the cart
* [ ] Retry capabilities on payment system (on 5 retry considered payment really failed)
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

* username: techguy
* password: password

Or create a new account

Note using apollo studio won't automatically set guest session cookies, so you might need to apply it manually (or maybe use postman instead)

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

## Code design notes

* Naming convention:
  * function parameters and fields use snake_case (session_id)
  * variable name and function use camelCase (sessionId)

## Testing

```bash
encore test
```

## References

* Payment system design [by system design classroom](https://newsletter.systemdesignclassroom.com/p/every-backend-engineer-needs-to-know?ref=dailydev)
* Fast typescript analyzer (helps in making code clean) [here](https://ftaproject.dev/playground)

## License

This project is licensed under the GNU Affero General Public License v3 (AGPL-3.0-only).

It also depends on [Encore](https://encore.dev), which is licensed under the Mozilla Public License 2.0 (MPL-2.0).
