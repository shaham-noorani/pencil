// APP COMPONENT
// Upon rendering of App component, make a request to create and
// obtain a link token to be used in the Link component
import React, { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Button } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

// LINK COMPONENT
// Use Plaid Link and pass link token and onSuccess function
// in configuration to initialize Plaid Link
interface PlaidLinkProps {
  type: string;
}

const PlaidLink = ({ type }: PlaidLinkProps) => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const [linkToken, setLinkToken] = useState(null);
  const generateToken = async () => {
    const response = await axiosPrivate.get("/plaid/create_link_token");
    setLinkToken(response.data.link_token);
  };
  useEffect(() => {
    generateToken();
  }, []);

  const onSuccess = React.useCallback(async (temp_token: string) => {
    // send public_token to server
    const response = await axiosPrivate.post("/plaid/item_inital_setup", {
      public_token: temp_token,
    });
    await axiosPrivate.post(`/plaid/refresh_transaction_data`);
    await axiosPrivate.post(`/plaid/refresh_net_worth`);

    navigate("/dashboard", { state: { refreshed: true } });
  }, [navigate, axiosPrivate]);

  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken,
    onSuccess,
  };
  const { open, ready } = usePlaidLink(config);

  return (
    <Button width="100%" onClick={() => open()} disabled={!ready}>
      {type === "connect-first-account"
        ? "Link Account"
        : "Link Another Account"}
    </Button>
  );
};
export default PlaidLink;
