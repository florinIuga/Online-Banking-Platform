import "../styles/App.scss";
import { useHistory, Link } from "react-router-dom";
import {
  Card,
  Heading,
  Pane,
  Text,
  TextInputField,
  Button,
  LogInIcon,
} from "evergreen-ui";
import axios from "axios";
import { useState } from "react";
import { roleConfig } from "./Config";

const apiUrl = "http://localhost:3000/api/v1";

function LoginHeader() {
  return (
    <Pane
      width="100%"
      flexBasis="5%"
      backgroundColor="#00b0ff"
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
    >
      <Pane
        flexBasis="33%"
        display="flex"
        justifyContent="flex-start"
        alignItems="flex-start"
        marginLeft="25px"
      >
        <Heading color="white">Evo Bank</Heading>
      </Pane>
    </Pane>
  );
}

function LoginFooter() {
  return (
    <Pane
      width="100%"
      flexBasis="5%"
      backgroundColor="#00b0ff"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Text color="white">Copyright @EvoBankInc</Text>
    </Pane>
  );
}

function LoginContent() {
  const history = useHistory();

  const [validUsername, setValidUsername] = useState(true);
  const [validUsernameMsg, setValidUsernameMsg] = useState(null);

  const [validPassword, setValidPassword] = useState(true);
  const [validPasswordMsg, setValidPasswordMsg] = useState(null);

  const [userInput, setUserInput] = useState({
    username: '',
    password: '',
  });

  // finput e trimis ca parametru automat de onChange
  // si pt a avea acces la input => finput.target.value
  const setUsername = (finput) => {
    userInput.username = finput.target.value;
    setUserInput(prev => ({...prev, username:userInput.username}));
  };

  const setPassword = (finput) => {
    userInput.password = finput.target.value;
    setUserInput(prev => ({...prev, passoword:userInput.password}));
  };

  const inputIsValid = () => {

    let k = 0;

    if (userInput.username.length === 0) {
        setValidUsername(false);
        setValidUsernameMsg("This field is required");
        k += 1;
    } else {
        setValidUsername(true);
    }
    
    if (userInput.password.length === 0) {
        setValidPassword(false);
        setValidPasswordMsg("This field is required");
        k += 1;
    } else {
        setValidPassword(true);
    }

    return k === 0;
  }

  const doLogin = () => {

    if (!inputIsValid()) {
      return;
    }
    
    axios
      .post(
        apiUrl + "/login",
        {
          username: userInput.username,
          password: userInput.password,
        },
        { crossDomain: true }
      )
      .then((response) => {
        const userLoginResponse = response.data.response;

        if (response.data.response === "not activated") {
          alert("The account is not activated. Please check your email and activate it");
          return;
        }

        if (response.data.response === "Activation link expired") {
          alert("Activation link expired");
          return;
        }
        
        console.log("Succes", userLoginResponse.token);
        localStorage.setItem("token", userLoginResponse.token);
        localStorage.setItem("userId", userLoginResponse.id);

        console.info(`Role: ${userLoginResponse.role}`);

        // redirect to dashboard based on role
        history.push(roleConfig[userLoginResponse.role].dashboard);
      })
      .catch((error) => {
        alert("Invalid username/password combination");
      });
  };

  return (
    <Pane
      width="100%"
      flex="1"
      backgroundColor="whitesmoke"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Card
        width="fit-content"
        padding="5%"
        height="70%"
        backgroundColor="white"
        boxShadow="2px 2px 10px gray"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Card
          flexBasis="20%"
          width="100%"
          borderBottom
          marginBottom="20px"
          display="flex"
          justifyContent="center"
        >
          <Heading marginBottom="5px" marginTop="5px">
            Welcome to Evo Bank!
          </Heading>
        </Card>

        <TextInputField
          isInvalid={validUsername}
          required
          label="Username"
          value={userInput.username}
          validationMessage={validUsernameMsg}
          onChange={(e) => {setUsername(e)}}
        />

        <TextInputField
          isInvalid={validPassword}
          required
          label="Password"
          type="password"
          value={userInput.password}
          validationMessage={validPasswordMsg}
          onChange={(e) => {setPassword(e)}}
        />

        <Button
          marginY={8}
          marginRight={12}
          iconBefore={LogInIcon}
          onClick={doLogin}
        >
          Sign In
        </Button>

        <Card>
          <Text>
            Don't have an account?{" "}
            <Link exact to="/register">
              Sign Up
            </Link>
          </Text>
        </Card>
      </Card>
    </Pane>
  );
}

function Login() {
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
      <LoginHeader />
      <LoginContent />
      <LoginFooter />
    </Pane>
  );
}

export { Login };
