import { NextPage } from "next";
import CLayout from "../components/layout";
import Datatable from "../components/user_data";

const Home: NextPage = () => {
  return (
    <CLayout>
      <Datatable />
    </CLayout>
  );
};

export default Home;
