import "../styles/App.scss";
import { useHistory} from "react-router-dom";
import { Pane, Button, TickCircleIcon, TextInputField, Spinner, Alert, Card, Heading} from "evergreen-ui";
import axios from "axios";
import { useState } from "react";
import "rsuite/dist/styles/rsuite-default.css";
import { Header, Footer } from "./Layout";
import { useEffect } from "react";

const apiUrl = "http://localhost:3000/api/v1";

function SettingsContent() {
  var history = useHistory();
  const loggedUserId = localStorage.getItem("userId");

  console.info(`User Id in Forum is: ${loggedUserId}`);

  const [loggedUser, setUser] = useState({
    username: null,
    email: null,
    password: null,
    retypePassword: null,
  });

  const [loading, setLoading] = useState(false);
  const [resultMsg, setResultMsg] = useState("");

  const setUsername = (finput) => {
    loggedUser.username = finput.target.value;
    setUser(loggedUser);
  };

  const setEmail = (finput) => {
    loggedUser.email = finput.target.value;
    setUser(loggedUser);
  };

  const setPassword = (finput) => {
    loggedUser.password = finput.target.value;
    setUser(loggedUser);
  };

  const setRetypePassword = (finput) => {
    loggedUser.retypePassword = finput.target.value;
    setUser(loggedUser);
  };

  const doUpdate = () => {
    // update user's details

        setLoading(true);
        setResultMsg("Successfully updated the details");

        const token = localStorage.getItem("token");
        console.info(`Token: ${token}`);
        var url = `${apiUrl}/${loggedUserId}`;
        console.info(`URL is: ${url}`);

        axios.put(
        url,
        {
            username: loggedUser.username,
            email: loggedUser.email,
        },

        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        ).then((response) => {
            const postResponse = response.data.response;

            console.log("Successfully updated details", postResponse.username);
        }).catch((error) => {
            alert("Something went wrong while updating the details");
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

    <Card width="fit-content" padding="5%" height="70%" backgroundColor="white" boxShadow="2px 2px 10px gray" display="flex" flexDirection="column" alignItems="center" justifyContent="center"> 
                
                <Card flexBasis="20%" width="100%" borderBottom marginBottom="20px" display="flex" justifyContent="center">
                    <Heading marginBottom="5px" marginTop="5px">Edit Your Account Details</Heading>
                </Card>

                <TextInputField
                    isInvalid
                    required
                    label="New Username"
                    validationMessage="This field is required"
                    onChange={setUsername}
                />

                <TextInputField
                    isInvalid
                    required
                    label="New Email"
                    validationMessage="This field is required"
                    onChange={setEmail}
                />

                <TextInputField
                    isInvalid
                    required
                    label="New Password"
                    type="password"
                    validationMessage="This field is required"
                    onChange={setPassword}
                />

                <TextInputField
                    isInvalid
                    required
                    label="Retype New Password"
                    type="password"
                    validationMessage="This field is required"
                    onChange={setRetypePassword}
                />

                <Button
                    marginY={8}
                    marginRight={12}
                    iconBefore={TickCircleIcon}
                    onClick={doUpdate}
                    intent="success"
                >
                    Submit
                </Button>

        </Card>

      <Pane id="messages" display="flex" justifyContent="center" alignItems="center" marginTop="30px">
            {resultMsg.length != 0 && <Alert intent="success" title={resultMsg}></Alert>}
        </Pane>

    </Pane>
  );
}

function AccountSettings() {
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
      <SettingsContent />
      <Footer />
    </Pane>
  );
}

export { AccountSettings };
