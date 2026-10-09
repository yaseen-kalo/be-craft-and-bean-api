import express from "express";
import { sendError, buildAuthResponse } from "./helpers";
import { randomUUID } from "crypto";

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

const users: {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}[] = [];

const categories = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "Coffee Beans",
    slug: "coffee-beans",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    name: "Brewing Gear",
    slug: "brewing-gear",
  },
  { id: "33333333-3333-4333-8333-333333333333", name: "Merch", slug: "merch" },
];

const apiRouter = express.Router();

// Get all categories
apiRouter.get("/categories", (req, res) => {
  res.status(200).json(categories);
});

// POST /v1/auth/register -- user registration endpoint
apiRouter.post("/auth/register", (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  // Validate Email
  if (typeof email !== "string") {
    return sendError(
      res,
      400,
      "VALIDATION_ERROR",
      "Email is required and must be a string",
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return sendError(res, 400, "VALIDATION_ERROR", "Email is not valid");
  }

  // Validate Password
  if (typeof password !== "string" || password.length < 8) {
    return sendError(
      res,
      400,
      "VALIDATION_ERROR",
      "Password is required and must be a string with at least 8 characters",
    );
  }

  // Validate First Name
  if (
    typeof firstName !== "string" ||
    firstName.length < 1 ||
    firstName.length > 50
  ) {
    return sendError(
      res,
      400,
      "VALIDATION_ERROR",
      "First name is required and must be a string with between 1 and 50 characters",
    );
  }

  // Validate Last Name
  if (
    typeof lastName !== "string" ||
    lastName.length < 1 ||
    lastName.length > 50
  ) {
    return sendError(
      res,
      400,
      "VALIDATION_ERROR",
      "Last name is required and must be a string with between 1 and 50 characters",
    );
  }

  // Check if the email is already registered
  if (users.some((u) => u.email === email)) {
    return sendError(
      res,
      409,
      "EMAIL_ALREADY_REGISTERED",
      "Email already exists",
    );
  }

  const id = randomUUID();
  const newUser = { id, email, password, firstName, lastName };
  const user = {
    id: newUser.id,
    email: newUser.email,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
  };

  users.push(newUser);
  res.status(201).json(buildAuthResponse(user));
});

// POST /v1/auth/login -- user login endpoint
apiRouter.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return sendError(
      res,
      401,
      "INVALID_CREDENTIALS",
      "Invalid email or password",
    );
  }
  res.status(200).json(buildAuthResponse(user));
});
app.use("/v1", apiRouter);

app.listen(3001, () => {
  console.log("Mock server is running on http://localhost:3001");
});
