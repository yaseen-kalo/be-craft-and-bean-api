import express from "express";
import { randomUUID } from "crypto";

// helper method to sendErrorResponse
function sendError(
  res: express.Response,
  status: number,
  code: string,
  message: string,
) {
  return res
    .status(status)
    .json({ code, message, timestamp: new Date().toISOString() });
}

// helper method buildAuthResponse
function buildAuthResponse(user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}) {
  return {
    accessToken: `access-${randomUUID()}`,
    refreshToken: `refresh-${randomUUID()}`,
    expiresIn: 3600,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  };
}

export { sendError, buildAuthResponse };
