# ☕ Be Craft & Bean API

API test automation for **Craft & Bean**, an online coffee shop.

Craft & Bean sells coffee beans, brewing equipment, and merchandise. Customers can register, log in, browse products, manage their carts, and place orders. Admins manage products and orders.

The real backend is not ready yet, so this project tests the API against a mock server that follows the API specification. When the real staging backend becomes available, we can change one setting and run the same tests against it.

## 🎯 Project Goals

* Test every endpoint defined in the API specification.
* Cover positive, negative, and edge cases.
* Validate response structures using JSON Schema.
* Test complete customer journeys, from registration to delivery.
* Run tests automatically through GitHub Actions.
* Keep the code simple, readable, and easy for beginners to extend.

## 🛠️ Tech Stack

| Technology     | Purpose                                   |
| -------------- | ----------------------------------------- |
| TypeScript     | Programming language                      |
| Playwright     | API test automation — no browser required |
| Express        | Mock API server                           |
| `.env`         | Environment configuration                 |
| GitHub Actions | Continuous integration (CI)               |
| npm            | Package management                        |

## 📋 API Coverage

The API specification defines the following areas:

| Area                 | Endpoints and functionality                                            |
| -------------------- | ---------------------------------------------------------------------- |
| **Authentication**   | Register, login, logout, refresh token                                 |
| **Catalog**          | List products, search, filter, pagination, product details, categories |
| **Cart**             | View cart, add items, update quantities, remove items, empty cart      |
| **Orders**           | Place orders, view order history, view order details, cancel orders    |
| **Admin — Products** | Create, update, and archive products                                   |
| **Admin — Orders**   | List orders and update order status                                    |
| **Staging Helpers**  | Test webhook to mark an order as paid; job to cancel expired orders    |

### Order Statuses

The expected order status flow is:

`pending → paid → processing → shipped → delivered`

Orders can also be cancelled when the applicable business rules allow it.

## 🧪 Business Rules Under Test

The tests verify that the API follows these rules:

* **Stock management:** Stock is checked when an item is added to the cart but is not reserved until checkout.
* **Cart behaviour:** Adding the same product twice updates the existing cart line instead of creating a duplicate.
* **Successful checkout:** The cart is empty after an order is placed successfully.
* **Price locking:** Order prices are fixed at checkout. Later product price changes do not affect existing orders.
* **Order cancellation:** Orders can be cancelled from supported statuses. Cancelling an order restores the stock.
* **Customer permissions:** Customers can cancel only orders in `pending` or `paid` status.
* **Order privacy:** Customers cannot access another customer's order. The API returns `404`.
* **Admin access:** Customers without admin permissions receive `403` when accessing admin endpoints.
* **Authentication:** Requests without a valid token receive `401` where authentication is required.

## 🔒 Environments and Safety

The project supports only two environments:

* **`mock`** — the local Express mock server.
* **`staging`** — the real staging API, when available.

Production is deliberately excluded.

The environment configuration includes safety checks:

* Any unsupported `TEST_ENV` value stops the test run.
* A staging URL must contain the word `staging`.
* Tests must never accidentally target production.

Environment variables are documented in `.env.example`. Keep real credentials and secrets out of Git.

## 📁 Project Structure

```text
be-craft-and-bean-api/
├── src/
│   ├── config/       # Settings and environment safety guard
│   ├── api/          # API services — send requests
│   ├── types/        # TypeScript request and response types
│   ├── factories/    # Builders for test data
│   ├── fixtures/     # Reusable test setup
│   ├── utils/        # Shared helper functions
│   └── validators/   # JSON Schema validation
├── data/             # JSON files for data-driven tests
├── mock-server/      # Express mock backend
├── tests/
│   ├── api/          # Tests grouped by API area
│   ├── e2e/          # End-to-end business flows
│   └── unit/         # Tests for project helper code
├── .env.example      # Example environment settings
├── playwright.config.ts
└── package.json
```

## 🏗️ How the Code Is Layered

Each part has one clear responsibility:

| Layer         | Responsibility                                                      |
| ------------- | ------------------------------------------------------------------- |
| **Test**      | Describes the scenario and checks the expected results.             |
| **Service**   | Sends requests to API endpoints without containing test assertions. |
| **Factory**   | Builds valid default test data that tests can override when needed. |
| **Type**      | Describes the expected shape of request and response data.          |
| **Validator** | Checks that response bodies match the expected JSON Schema.         |

**Important rule:** Services return the raw Playwright API response. Tests read the response body and check the HTTP status and expected behaviour.

This separation keeps the framework easier to understand, maintain, and extend.

## 🧩 Test Types

| Test type    | What it checks                                                           |
| ------------ | ------------------------------------------------------------------------ |
| **Positive** | Normal use with valid input and permissions                              |
| **Negative** | Invalid input, invalid tokens, wrong roles, or invalid state transitions |
| **Edge**     | Boundary values, special characters, and race conditions                 |
| **Schema**   | Response bodies match the expected JSON structure                        |
| **E2E**      | Complete business flows across multiple endpoints                        |
| **Unit**     | Individual helper functions and utilities                                |

Examples of edge cases include password length boundaries, quantities of `99` and `100`, and special characters.

### Test Tags

Tests can use tags such as `@smoke` and `@regression` to select groups of tests.

```bash
npx playwright test --grep @smoke
npx playwright test --grep @regression
```

## 🧾 Test Data Strategy

* Each test creates its own data, such as a unique email address or a new product.
* Tests do not depend on data created by other tests.
* Tests should be safe to run in parallel.
* Shared data is limited to values that are expected to remain stable, such as product categories.

This approach reduces flaky tests and makes failures easier to investigate.

## 🖥️ The Mock Server

The mock backend is a small Express server that stores data in memory.

It simulates the API specification, including:

* Request validation and error responses
* Authentication and authorization
* Cart behaviour and stock rules
* Order creation, status changes, and cancellation

Because the data is stored in memory, restarting the server resets it.

**Playwright starts the mock server automatically** when the tests run, so there is no need to start it manually.

Where the API specification does not provide a clear answer, the mock uses a documented assumption. These cases are marked with:

`TODO: confirm with BE`

## 🚀 How to Run the Tests

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the environment

```bash
cp .env.example .env
```

Check the values in `.env` before running the tests. For local development, use the mock environment.

### 3. Run the tests

```bash
# Run all tests
npx playwright test

# Run smoke tests
npx playwright test --grep @smoke

# Run regression tests
npx playwright test --grep @regression

# Open the HTML report
npx playwright show-report
```

The mock server starts automatically when Playwright runs.

### Test Against Staging

When staging is ready, update the environment configuration to use:

```dotenv
TEST_ENV=staging
```

Set the staging API URL and any required credentials according to `.env.example` and the project's configuration. Confirm the safety guard accepts the staging URL before running the tests.

Never put production credentials or real secrets in the repository.

## 📈 Current Project Status

### Completed

* [x] Initial project setup, configuration, and environment safety guard
* [x] Mock server with categories, registration validation, and login
* [x] `AuthService`, TypeScript types, and user factory
* [x] Registration tests for valid data and password limits
* [x] Smoke test for categories
* [x] Playwright configuration to start the mock server automatically

### Next Steps

* [ ] Expand login tests
* [ ] Complete GitHub Actions CI setup and verify the workflow
* [ ] Add fixtures for a logged-in customer
* [ ] Add product, cart, and order tests
* [ ] Add data-driven tests using JSON files
* [ ] Add admin tests and access-control checks
* [ ] Add JSON Schema validation
* [ ] Build end-to-end business flows

## ❓ Open Questions for the Backend Team

The following details need confirmation from the backend (BE) team:

1. Should duplicate email registration return `400` or `409`?
2. Does the refresh token change after every successful use?
3. Should invalid pagination values return an error or be corrected automatically?
4. Are draft and archived products hidden from customer-facing endpoints?
5. Does deleting a product archive it or permanently remove it?
6. Which payment token should staging use to return `402`?

These questions will be resolved against the official API specification or with the backend team before the tests are treated as final acceptance criteria.

## 💡 Why This Project Matters

This project demonstrates practical SDET skills:

* Translating an API specification into test scenarios
* Identifying missing or ambiguous requirements
* Designing a maintainable API automation framework
* Building a mock backend before the real backend is available
* Testing positive, negative, and edge cases
* Validating response schemas and business rules
* Automating test execution with CI

The goal is not just to make tests pass. It is to build a framework that is **reliable, understandable, and ready to use against the real staging API** when the backend becomes available.
