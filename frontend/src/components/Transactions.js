import "../styles/App.scss";
import { useHistory, Link } from "react-router-dom";
import {
  Pane,
  Button,
  LogInIcon,
  TextareaField,
  Table,
  Card,
  Heading,
  Badge,
  SendToIcon,
  ArrowRightIcon,
  BankAccountIcon,
  DollarIcon,
  CalendarIcon,
} from "evergreen-ui";
import axios from "axios";
import { useState } from "react";
import "rsuite/dist/styles/rsuite-default.css";
import { Header, Footer } from "./Layout";
import { useEffect } from "react";

const apiUrl = "http://localhost:3000/api/v1";

function TransactionsContent() {
  var history = useHistory();
  const loggedUserId = localStorage.getItem("userId");

  console.info(`User Id in Forum is: ${loggedUserId}`);

  const [loggedUser, setUser] = useState({
    username: null,
    email: null,
  });

  const [transactions, setTransactions] = useState([]);

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
        loggedUser.username = user.username;
        loggedUser.email = user.email;

        setUser(loggedUser);
      } catch (err) {
        console.info("erroare in primul try catch");
        console.log(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token == undefined) {
        history.replaceState("/transactions", "/login");
        history.push("/login");
        return;
      }

      try {
        var url = `${apiUrl}/transactions/${loggedUserId}`;
        var apiData = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (apiData == undefined) {
          console.info("Api is null");
        }

        var transactions_resp = apiData.data.response;

        setTransactions(transactions_resp);
      } catch (err) {
        console.info("erroare in al doilea try catch");
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
      justifyContent="flex-start"
      alignItems="center"
      flexDirection="column"
    >
      <Pane
        id="forum-table"
        marginTop="10px"
        display="flex"
        justifyContent="center"
      >
        <Table>
          <Table.Head>
            <Table.TextHeaderCell>
              <SendToIcon size={10} marginRight="2px" />
              Sender
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              <ArrowRightIcon size={10} marginRight="2px" /> Receiver
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              <DollarIcon size={10} marginRight="2px" /> Amount
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              <CalendarIcon size={10} marginRight="2px" />
              Date
            </Table.TextHeaderCell>
          </Table.Head>
          <Table.VirtualBody height={710} width={1630}>
            {transactions.map((transaction) => (
              <Table.Row key={transaction.id} isSelectable>
                <Table.TextCell>
                  <Badge color="purple" marginRight={8}>
                    {transaction.sender_username}
                  </Badge>
                </Table.TextCell>
                <Table.TextCell><Badge color="green" marginRight={8}>
                    {transaction.receiver_username}
                  </Badge></Table.TextCell>
                <Table.TextCell>{transaction.amount}</Table.TextCell>
                <Table.TextCell>
                  {transaction.transac_transfer_date_str}
                </Table.TextCell>
              </Table.Row>
            ))}
          </Table.VirtualBody>
        </Table>
      </Pane>
    </Pane>
  );
}

function Transactions() {
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
      <TransactionsContent />
      <Footer />
    </Pane>
  );
}

export { Transactions };
