import dotenv from "dotenv";

dotenv.config();

const testEnv = process.env.TEST_ENV || "mock"; // Default to "mock" if TEST_ENV is not set

let env: { name: string; baseURL: string };

if (testEnv === "mock") {
  if (!process.env.MOCK_API_URL) {
    throw new Error("MOCK_API_URL is required");
  }

  env = {
    name: "mock",
    baseURL: process.env.MOCK_API_URL,
  };
} else if (testEnv === "staging") {
  if (!process.env.STAGING_API_URL) {
    throw new Error("STAGING_API_URL is required");
  }

  if (!process.env.STAGING_API_URL.includes("staging")) {
    throw new Error("STAGING_API_URL must contain 'staging'");
  }

  env = {
    name: "staging",
    baseURL: process.env.STAGING_API_URL,
  };
} else if (testEnv === "development") {
  if (!process.env.DEVELOPMENT_API_URL) {
    throw new Error("DEVELOPMENT_API_URL is required");
  }

  if (!process.env.DEVELOPMENT_API_URL.includes("development")) {
    throw new Error("DEVELOPMENT_API_URL must contain 'development'");
  }

  env = {
    name: "development",
    baseURL: process.env.DEVELOPMENT_API_URL,
  };
} else {
  throw new Error(
    `Invalid TEST_ENV: "${testEnv}". Expected "mock", "staging", or "development".`,
  );
}

export { env };
console.log(env);
