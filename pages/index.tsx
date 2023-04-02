import { NextPage } from "next";
import CLayout from "../components/layout";
import UserData from "../components/user_data";

const Home: NextPage = () => {
  return (
    <CLayout>
      <UserData />
    </CLayout>
  );
};

export default Home;
