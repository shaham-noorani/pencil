import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import {
  getEmployeeInformationFromToken,
  refreshCredentials,
} from "../services/auth.service";

// Initialize the Google OAuth2 client
export const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

// Controller for handling Google login
export const googleSignIn = async (req: Request, res: Response) => {
  try {
    const { tokens } = await client.getToken(req.body.code);

    const { email, name } = await getEmployeeInformationFromToken(
      tokens.id_token as string
    );

    res.json({ email, name, tokens });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ error: "Failed to authenticate with Google" });
  }
};

// Controller for handling token refresh
export const googleRefreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;

  try {
    const { credentials } = await refreshCredentials(refreshToken);

    return {
      id_token: credentials.id_token as string,
      refresh_token: credentials.refresh_token as string,
    };
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({ error: "Failed to refresh token" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  const idToken = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  const userInfo = await getEmployeeInformationFromToken(idToken as string);

  try {
    // actually pull the user from DB, this is just a placeholder
    const user = {
      email: userInfo.email,
      name: userInfo.name,
      profile: userInfo.profile,
    };

    return { ...user };
  } catch (err) {
    console.error("Get me error:", err);
    res.status(500).json({ error: "Failed to get user information" });
  }
};
