import "../styles/App.scss";
import { Link, useHistory } from "react-router-dom";
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

const apiUrl = "http://localhost:3000/api/v1";

function RegisterHeader() {
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

function RegisterFooter() {
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

function RegisterContent() {
  const history = useHistory();

  const [validUsername, setValidUsername] = useState(true);
  const [validUsernameMsg, setValidUsernameMsg] = useState(null);

  const [validEmail, setValidEmail] = useState(true);
  const [validEmailMsg, setValidEmailMsg] = useState(null);

  const [validPassword, setValidPassword] = useState(true);
  const [validPasswordMsg, setValidPasswordMsg] = useState(null);

  const [userInput, setUserInput] = useState({
    username: '',
    password: '',
    email: '',
  });

  const setUsername = (finput) => {
    userInput.username = finput.target.value;
    setUserInput(prev => ({...prev, username:userInput.username}));
  };

  const setPassword = (finput) => {
    userInput.password = finput.target.value;
    setUserInput(prev => ({...prev, passoword:userInput.password}));
  };

  const setEmail = (finput) => {
    userInput.email = finput.target.value;
    setUserInput(prev => ({...prev, email:userInput.email}));
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
    
    if (userInput.email.length === 0) {
        setValidEmail(false);
        setValidEmailMsg("This field is required");
        k += 1;
    } else {
        setValidEmail(true)
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

  const doRegister = () => {

    if(!inputIsValid()) {
      return;
    }

    axios
      .post(
        apiUrl + "/register",
        {
          username: userInput.username,
          password: userInput.password,
          email: userInput.email,
        },
        { crossDomain: true }
      )
      .then((response) => {
        console.log("Succes", response.data.response.token);

        if (response.data.response === "This username already exists") {
          alert("Username already exists");
          return;
        }

        if (response.data.response === "This email already exists") {
          alert("Email already exists");
          return;
        }

        history.push("/");
      })
      .catch((error) => {
        alert(error);
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
          isInvalid={validEmail}
          required
          label="Email"
          type="email"
          value={userInput.email}
          validationMessage={validEmailMsg}
          onChange={(e) => {setEmail(e)}}
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
          onClick={doRegister}
        >
          Sign Up
        </Button>

        <Card>
          <Text>
            Already an account?{" "}
            <Link exact to="/login">
              Sign In
            </Link>
          </Text>
        </Card>
      </Card>
    </Pane>
  );
}

function Register() {
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
      <RegisterHeader />
      <RegisterContent />
      <RegisterFooter />
    </Pane>
  );
}

export { Register };
