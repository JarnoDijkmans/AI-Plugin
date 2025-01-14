import Subs from "../components/subs";
import Login from "../components/login";
import PaymentHistory from "../pages/payment-history";
import { TabPanel } from "@wordpress/components";

const AdminPage = () => {
  return (
    <TabPanel
      className="admin-page-tabs"
      activeClass="active-tab"
      tabs={[
        {
          name: "login",
          title: "Login",
          className: "tab-login",
        },
        {
          name: "subscriptions",
          title: "Abonnementen",
          className: "tab-subscription",
        },
        {
          name: "payment-history",
          title: "AI verbruik kosten",
          className: "tab-ai-usage",
        },
      ]}
    >
      {(tab) => (
        <div>
          {tab.name === "login" && (
            <div>
              <Login />
            </div>
          )}
          {tab.name === "subscriptions" && (
            <div>
              <Subs />
            </div>
          )}
          {tab.name === "payment-history" && (
            <div>
              <PaymentHistory />
            </div>
          )}
        </div>
      )}
    </TabPanel>
  );
};

export default AdminPage;
