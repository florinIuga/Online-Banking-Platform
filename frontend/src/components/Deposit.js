import "../styles/App.scss";
import { useHistory } from "react-router-dom";
import {
  Pane,
  Button,
  TickCircleIcon,
  TextInputField,
  Spinner,
  Alert,
  Card,
  Heading,
  Avatar
} from "evergreen-ui";
import axios from "axios";
import { useState } from "react";
import "rsuite/dist/styles/rsuite-default.css";
import { Header, Footer } from "./Layout";
import { useEffect } from "react";

const apiUrl = "http://localhost:3000/api/v1";

function DepositMoneyContent() {
  var history = useHistory();
  const loggedUserId = localStorage.getItem("userId");

  console.info(`User Id in Deposit is: ${loggedUserId}`);

  const [loggedUser, setUser] = useState({
    username: null,
    balance: null,
  });

  const [amount_to_deposit, setAmount] = useState("0");
  const [loading, setLoading] = useState(false);
  const [resultMsg, setResultMsg] = useState("");
  const [validAmount, setValidAmount] = useState(false);
  const [validAmountMsg, setValidAmountMsg] = useState(null);
  const [reset, setReset] = useState(false);

  const f_reset = () => {

    setReset(!reset);
  }

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

        setUser(prev => ({...prev, username:user.username, balance:user.balance}));

      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [reset]);

  const inputIsValid = () => {

    if (amount_to_deposit.length === 0) {
        setValidAmount(false);
        setValidAmountMsg("This field is required");
        return false;
    } else if (isNaN(amount_to_deposit)) {
        setValidAmount(false);
        setValidAmountMsg("Please enter a valid amount number");
        return false;
    } else {
        setValidAmount(true);
        return true;
    }

  }

  const doDeposit = () => {

    if (!inputIsValid()) {
        return;
    }

    setLoading(true);
    setResultMsg("Successfully deposit the money");

    const token = localStorage.getItem("token");
    console.info(`Token: ${token}`);

    var url = `${apiUrl}/${loggedUserId}`;
    console.info(`URL is: ${url}`);
    console.info(`Amount: ${amount_to_deposit}`);

    axios
      .put(
        url,
        {
          amount: parseInt(amount_to_deposit),
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const postResponse = response.data.response;

        console.log("Successfully deposit the money", postResponse.balance);
      })
      .catch((error) => {
        alert("Something went wrong while depositing the money");
      });

    f_reset();
    setLoading(false);
    setResultMsg("");
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
      <Card
        width="fit-content"
        padding="5%"
        height="70%"
        boxShadow="2px 2px 10px gray"
        backgroundColor="white"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Avatar name={loggedUser.username} size={70} />
        <Card
          flexBasis="20%"
          width="100%"
          borderBottom
          marginBottom="20px"
          display="flex"
          justifyContent="center"
          flexDirection="center"
          alignItems="center"
        >
          <Heading size="10px" marginBottom="5px" marginTop="5px">
            You have {loggedUser.balance}$
          </Heading>
        </Card>

        <TextInputField
          isInvalid={validAmount}
          required
          label="Amount"
          value={amount_to_deposit}
          validationMessage={validAmountMsg}
          onChange={(e) => {setAmount(e.target.value)}}
        />

        <Button
          marginY={8}
          marginRight={12}
          iconBefore={TickCircleIcon}
          onClick={doDeposit}
          intent="success"
        >
          Deposit
        </Button>
      </Card>

      <Pane
        id="messages"
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginLeft="800px"
      >
        {loading && <Spinner marginTop="15px"></Spinner>}
        {resultMsg.length != 0 && (
          <Alert intent="success" title={resultMsg}></Alert>
        )}
      </Pane>
    </Pane>
  );
}

function DepositMoney() {
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
      <DepositMoneyContent />
      <Footer />
    </Pane>
  );
}

export { DepositMoney };
