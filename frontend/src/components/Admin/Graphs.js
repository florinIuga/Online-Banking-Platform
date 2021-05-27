import "../../styles/App.scss";
import { useHistory, Link } from "react-router-dom";
import { Pane, Heading } from "evergreen-ui";
import axios from "axios";
import { useState } from "react";
import "rsuite/dist/styles/rsuite-default.css";
import { Header, Footer } from "./LayoutAdmin";
import * as React from "react";
import { useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import "./graph.css";

const apiUrl = "http://localhost:3000/api/v1/statistics";

function GraphsContent() {
  var history = useHistory();
  const [state_registers, setRegisters] = useState(null);
  const [state_logins, setLogins] = useState(null);
  const [state_transactions, setTransactions] = useState(null);

  // get registers
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token == undefined) {
        localStorage.clear();
        history.replaceState("/statistics", "/login");
        history.push("/login");
        return;
      }

      try {
        var apiData = await axios.get(apiUrl + "/registers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        var registers = apiData.data.response;

        const registerData = {
          labels: registers.map((register) => register.register_date),
          datasets: [
            {
              label: "Register",
              fill: false,
              lineTension: 0.5,
              backgroundColor: "#0000FF",
              borderColor: "#0000FF",
              borderWidth: 2,
              data: registers.map((register) => register.register_count),
            },
          ],
        };

        setRegisters((prev) => ({ ...prev, state_registers: registerData }));
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  // get logins
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token == undefined) {
        localStorage.clear();
        history.replaceState("/statistics", "/login");
        history.push("/login");
        return;
      }

      try {
        var apiData = await axios.get(apiUrl + "/logins", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        var logins = apiData.data.response;
        const loginData = {
          labels: logins.map((login) => login.login_date),
          datasets: [
            {
              label: "Login",
              fill: false,
              lineTension: 0.5,
              backgroundColor: "#87CEEB",
              borderColor: "#87CEEB",
              borderWidth: 2,
              data: logins.map((login) => login.login_count),
            },
          ],
        };

        setLogins((prev) => ({ ...prev, state_logins: loginData }));
        console.log(state_logins);
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
        history.replaceState("/statistics", "/login");
        history.push("/login");
        return;
      }

      try {
        var apiData = await axios.get(apiUrl + "/transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        var transactions = apiData.data.response;
        const transactionData = {
          labels: transactions.map((transaction) => transaction.transfer_date),
          datasets: [
            {
              label: "Transaction",
              fill: false,
              lineTension: 0.5,
              backgroundColor: "#00BFFF",
              borderColor: "#00BFFF",
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
      <Heading size="10px">Platform Analytics</Heading>
      <Pane display="flex" flexDirection="row">
        <Pane id="registers" display="flex">
          {state_registers && (
            <Line
              data={state_registers.state_registers}
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

        <Pane id="logins" display="flex" marginLeft="20px">
          {state_logins && (
            <Line
              data={state_logins.state_logins}
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

      <Pane id="registers" display="flex" marginTop="20px">
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

function Graphs() {
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
      <GraphsContent />
      <Footer />
    </Pane>
  );
}

export { Graphs };
