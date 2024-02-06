import axios from "axios";
import useUser from "../../hooks/useUser";

const useMe = () => {
  const { setUser }: any = useUser();

  const url = import.meta.env.PROD ? "" : "http://localhost:3000";

  const me = async () => {
    const res = await axios.get(url + "/auth/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("idToken")}`,
      },
    });

    try {
      setUser(res.data);
    } catch {
      console.error("Error getting user info (me)");
    }
  };

  return me;
};

export default useMe;
