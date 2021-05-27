import "../styles/App.scss";
import { useHistory } from "react-router-dom";
import "rsuite/dist/styles/rsuite-default.css";
import { Pane, Card, Heading, Avatar, Badge } from "evergreen-ui";
import axios from "axios";
import { useEffect, useState } from "react";
import { Header, Footer } from "./Layout";
import { Bar } from "react-chartjs-2";
import "./graph.css";
import * as React from "react";

const apiUrl = "http://localhost:3000/api/v1";

function DashboardContent() {
  var history = useHistory();
  const [state_transactions, setTransactions] = useState(null);
  const loggedUserId = localStorage.getItem("userId");

  const [loggedUser, setUser] = useState({
    username: null,
    balance: null,
  });

  // get logged in user's details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.info(`Token: ${token}`);
        var url = `${apiUrl}/${loggedUserId}`;
        console.info(`URL is: ${url}`);

        var apiData = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.info(apiData.response);
        var user = apiData.data.response;

        setUser((prev) => ({
          ...prev,
          username: user.username,
          balance: user.balance,
        }));
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  // get transactions
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token == undefined) {
        localStorage.clear();
        history.replaceState("/dashboard", "/login");
        history.push("/login");
        return;
      }

      try {
        var url = `${apiUrl}/statistics/transactions/${loggedUserId}`;
        var apiData = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        var transactions = apiData.data.response;
        const transactionData = {
          labels: transactions.map((transaction) => transaction.transfer_date),
          datasets: [
            {
              label: "Transactions",
              fill: false,
              lineTension: 0.5,
              backgroundColor: "#0000FF",
              borderColor: "#0000FF",
              borderWidth: 2,
              data: transactions.map(
                (transaction) => transaction.transfer_count
              ),
            },
          ],
        };

        setTransactions((prev) => ({
          ...prev,
          state_transactions: transactionData,
        }));

        console.log(state_transactions);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <Pane
      width="100%"
      flex="1"
      backgroundColor="whitesmoke"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Avatar name={loggedUser.username} size={80} />
      <Card
        width="fit-content"
        borderBottom
        marginBottom="20px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Heading size="25px" marginBottom="5px" marginTop="5px">
          Welcome back, {loggedUser.username}!
        </Heading>
        <Heading marginBottom="5px" marginTop="5px">
          You have
          <Badge marginLeft="10px" boxSizing="10px" color="green" marginRight={8}>
            {loggedUser.balance}
          </Badge>
          $ in your account.
        </Heading>
      </Card>

      <Pane id="transactions" display="flex" marginTop="30px">
        {state_transactions && (
          <Bar
            data={state_transactions.state_transactions}
            options={{
              title: {
                display: true,
                text: "Average Rainfall per month",
                fontSize: 20,
              },
              legend: {
                display: true,
                position: "right",
              },
            }}
          />
        )}
      </Pane>
    </Pane>
  );
}

function Dashboard() {
  return (
    <Pane
      height="100vh"
      width="100vw"
      maxHeight="100vh"
      maxWidth="100vw"
      margin="0"
      padding="0"
      display="flex"
      flexDirection="column"
    >
      <Header />
      <DashboardContent />
      <Footer />
    </Pane>
  );
}

export { Dashboard };
