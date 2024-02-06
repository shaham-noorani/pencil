import { NextFunction, Request, Response } from "express";
import { OAuth2Client, UserRefreshClient } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const getUserInformationFromToken = async (idToken: string) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  if (!payload) throw new Error("Invalid token");

  return {
    email: payload.email as string,
    name: payload.name as string,
    profile: payload.picture as string,
  };
};

export const refreshCredentials = async (refreshToken: string) => {
  const user = new UserRefreshClient(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    refreshToken
  );

  return await user.refreshAccessToken();
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const idToken = authHeader.split(" ")[1]; // Bearer <token>

  if (!idToken) {
    return res.status(401).json({ error: "Invalid token" });
  }

  let email: string;
  try {
    email = (await getUserInformationFromToken(idToken)).email;
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }

  next();
};
