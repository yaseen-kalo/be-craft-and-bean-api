be-craft-and-bean-api

API test automation for Craft & Bean, an online coffee shop.

The shop sells coffee beans, brewing gear, and merch. Customers can register, log in, browse products, fill a cart, and place orders. Admins manage products and orders.

The real backend is not ready yet. So this project tests the API against a fake server (a mock) that follows the API spec. When the real staging backend is ready, we change one setting and run the same tests against it.

Goals
Test every endpoint in the API spec.
Cover positive, negative, and edge cases.
Check that every response has the right shape (JSON schema checks).
Cover full customer flows from register to delivery (end-to-end).
Run automatically in GitHub Actions.
Keep the code simple, so a beginner can read it and extend it.
Tech stack
Language: TypeScript
Test tool: Playwright (API testing only, no browser)
Mock server: Express
Settings: .env file
CI: GitHub Actions
Package manager: npm
The API (from the spec)
Auth: register, login, logout, refresh token
Catalog: list products (search, filter, pages), product details, categories
Cart: view, add item, change quantity, remove item, empty cart
Orders: place order, order history, order details, cancel
Admin products: create, update, archive
Admin orders: list all, change status (paid, processing, shipped, delivered, cancelled)
Staging helpers: a test webhook that marks an order as paid, and a job that cancels expired orders
Business rules the tests check
Stock is checked when you add to the cart, but not reserved. It is reserved at checkout.
Adding the same product twice adds to the same cart line.
After a successful order, the cart is empty.
Order prices are locked at checkout. A later price change does not change old orders.
Order status flow: pending → paid → processing → shipped → delivered. An order can be cancelled from pending, paid, or processing.
A customer can cancel only in pending or paid.
Cancelling an order puts the stock back.
A customer cannot see another customer's order (the API answers 404).
Customers cannot use admin endpoints (403). No token gives 401.
Environments and safety

Only two environments exist: mock and staging. Production is not an option, so the tests can never hit it by mistake. Any other TEST_ENV value stops the run with an error. A staging URL must also contain the word staging.

Project structure
be-craft-and-bean-api/
├─ src/
│  ├─ config/       settings and the safety guard (env.ts)
│  ├─ api/          services: one class per API area (only sends requests)
│  ├─ types/        TypeScript shapes of the JSON (responses, errors)
│  ├─ factories/    builders for test data (a new user, a new product)
│  ├─ fixtures/     ready-made setup for tests (a logged-in customer)
│  ├─ utils/        small tools
│  └─ validators/   JSON schema checks
├─ data/            JSON files for data-driven tests
├─ mock-server/     the fake backend
├─ tests/
│  ├─ api/          one folder per API area
│  ├─ e2e/          full business flows
│  └─ unit/         tests for our own helper code
├─ .env.example     list of needed settings
└─ playwright.config.ts
How the code is layered
Test: says what to do and what is expected.
Service: sends one request to one endpoint. It has no expect.
Factory: builds good test data. Tests change only what they need.
Type: describes the JSON, so the editor can help.

Rule: the service returns the raw response. The test reads the body and checks the status.

Test types
Positive: normal, correct use.
Negative: wrong input, wrong token, wrong role, wrong state.
Edge: limits (8 and 7 character passwords, quantity 99 and 100), races, special characters.
Schema: the response matches the spec.
E2E: a full flow, like register → cart → order → paid → shipped → delivered.
Unit: tests for our own helpers.

Tags in test names (@smoke, @regression) let you run a group: npx playwright test --grep @smoke.

Test data rules
Every test makes its own data (a new email, a new product). Tests never depend on each other.
This lets tests run in parallel without random failures.
Only things that never change are shared, like categories.
The mock server

It is a small Express server that keeps data in memory. It follows the spec: validation, error codes, the cart rules, and the order flow. When you restart it, all data is gone. Playwright starts it for you when you run the tests.

Where the spec does not give an answer, the mock makes a guess and we mark it TODO: confirm with BE.

How to run
bash
npm install
cp .env.example .env
npx playwright test                 # all tests (the mock starts by itself)
npx playwright test --grep @smoke   # only smoke tests
npx playwright show-report          # open the HTML report

To test staging (when it is ready): set TEST_ENV=staging in .env.

Current status

Done

Setup, settings, and the safety guard
Mock server: categories, register (with validation), login
AuthService, types, and a user factory
Register tests (valid data, password limits)
Smoke test for categories

Next

Login tests
Push to GitHub and set up CI
Fixtures (a ready logged-in customer)
Products, cart, and order tests
Data-driven tests with JSON files
Admin tests and access control
JSON schema checks
End-to-end flows
Open questions for the BE team
Duplicate email: is it 400 or 409?
Does the refresh token change after each use?
Invalid page or limit: an error, or does the API fix it?
Are draft and archived products hidden from customers?
Does a product delete archive it, or remove it?
Which payment token makes staging return 402?
Why this project is worth it

It teaches the real work of an SDET: reading a spec, finding its gaps, building a clean framework, and testing before the backend exists.