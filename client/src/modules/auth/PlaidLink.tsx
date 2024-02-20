// APP COMPONENT
// Upon rendering of App component, make a request to create and
// obtain a link token to be used in the Link component
import axios from "axios";
import React from "react";
import { usePlaidLink } from "react-plaid-link";

// LINK COMPONENT
// Use Plaid Link and pass link token and onSuccess function
// in configuration to initialize Plaid Link
interface LinkProps {
  linkToken: string | null;
}
const PlaidLink: React.FC<LinkProps> = (props: LinkProps) => {
  const onSuccess = React.useCallback(async (temp_token: string) => {
    // send public_token to server
    const url = import.meta.env.PROD ? "" : "http://localhost:3000";
    await axios.post(url + "/api/plaid/exchange_public_token", {
      public_token: temp_token,
    });
  }, []);

  const config: Parameters<typeof usePlaidLink>[0] = {
    token: props.linkToken!,
    onSuccess,
  };
  const { open, ready } = usePlaidLink(config);
  return (
    <button onClick={() => open()} disabled={!ready}>
      Link account
    </button>
  );
};
export default PlaidLink;
