import "../styles/App.scss";
import { useHistory} from "react-router-dom";
import { Pane, Button, TickCircleIcon, TextInputField, Spinner, Alert, Card, Heading} from "evergreen-ui";
import axios from "axios";
import { useState } from "react";
import "rsuite/dist/styles/rsuite-default.css";
import { Header, Footer } from "./Layout";
import { useEffect } from "react";

const apiUrl = "http://localhost:3000/api/v1";

function SendMoneyContent() {
  var history = useHistory();
  const loggedUserId = localStorage.getItem("userId");

  console.info(`User Id in Forum is: ${loggedUserId}`);

  const [transaction, setTransaction] = useState({
    username: null,
    email: null,
    amount: 0
  });

  const [loggedUser, setUser] = useState({
    username: null,
    balance: null,
  });

  const [loading, setLoading] = useState(false);
  const [resultMsg, setResultMsg] = useState("");

  const setUsername = (finput) => {
    transaction.username = finput.target.value;
    setTransaction(transaction);
  };

  const setEmail = (finput) => {
    transaction.email = finput.target.value;
    setTransaction(transaction);
  };

  const setAmount = (finput) => {
    transaction.amount = finput.target.value;
    setTransaction(transaction);
  };

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
        loggedUser.balance = user.balance;

        setUser(loggedUser);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const doTransaction = () => {

        setLoading(true);
        setResultMsg("Successfully sent the money");

        const token = localStorage.getItem("token");
        console.info(`Token: ${token}`);

        console.info(`My balance: ${loggedUser.balance} and my name: ${loggedUser.username} and the amount to send: ${transaction.amount}`);

        if (!loggedUser.balance || loggedUser.balance - transaction.amount < 0) {
          alert("You don't have enough funds to make this transaction, please deposit");
          setLoading(false);
          setResultMsg('');

          return;
        }

        var url = `${apiUrl}/transactions/${loggedUserId}`;
        console.info(`URL is: ${url}`);

        axios.post(
        url,
        {
          amount: transaction.amount,
          receiver_name: transaction.username
        },

        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        ).then((response) => {
            const postResponse = response.data.response;

            console.log("Successfully sent money", postResponse.id_sender);
        }).catch((error) => {
            alert("Something went wrong while sending the money");
        });

        setLoading(false);
  };

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

    <Card width="fit-content" padding="5%" height="70%" boxShadow="2px 2px 10px gray" backgroundColor="white" display="flex" flexDirection="column" alignItems="center" justifyContent="center"> 
                
                <Card flexBasis="20%" width="100%" borderBottom marginBottom="20px" display="flex" justifyContent="center">
                    <Heading marginBottom="5px" marginTop="5px">Send Money</Heading>
                </Card>

                <TextInputField
                    isInvalid
                    required
                    label="Receiver's username"
                    validationMessage="This field is required"
                    onChange={setUsername}
                />

                <TextInputField
                    isInvalid
                    required
                    label="Receiver's email"
                    validationMessage="This field is required"
                    onChange={setEmail}
                />

                <TextInputField
                    isInvalid
                    required
                    label="Amount"
                    validationMessage="This field is required"
                    onChange={setAmount}
                />

                <Button
                    marginY={8}
                    marginRight={12}
                    iconBefore={TickCircleIcon}
                    onClick={doTransaction}
                    intent="success"
                >
                    Send
                </Button>

      </Card>

      <Pane id="messages" display="flex" justifyContent="center" alignItems="center" marginTop="20px">
            {resultMsg.length != 0 && <Alert intent="success" title={resultMsg}></Alert>}
        </Pane>

    </Pane>
  );
}

function SendMoney() {
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
      <SendMoneyContent />
      <Footer />
    </Pane>
  );
}

export { SendMoney };
