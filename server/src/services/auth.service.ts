import { OAuth2Client, UserRefreshClient } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const getEmployeeInformationFromToken = async (idToken: string) => {
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
