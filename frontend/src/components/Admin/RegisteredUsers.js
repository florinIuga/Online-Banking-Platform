import "../../styles/App.scss";
import { useHistory, Link } from "react-router-dom";
import {
  Pane,
  Button,
  LogInIcon,
  TextareaField,
  Table,
  Dialog,
  FormFieldDescription,
  FormFieldLabel,
  EditIcon,
  TrashIcon,
  Spinner,
  Alert,
  Badge,
  UserIcon,
} from "evergreen-ui";
import axios from "axios";
import { useState } from "react";
import "rsuite/dist/styles/rsuite-default.css";
import { Header, Footer } from "./LayoutAdmin";
import * as React from "react";
import { useEffect } from "react";

const apiUrl = "http://localhost:3000/api/v1";

function EditUserRoleDialog({ id, username }) {
  const [isShown, setIsShown] = React.useState(false);

  const [roleInput, setRole] = useState(3);

  const editUser = () => {
    const token = localStorage.getItem("token");
    var url = `${apiUrl}/${id}/role/${roleInput}`;
    console.info(url);
    console.log(roleInput);

    axios
      .put(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const userResponse = response.data.response;

        console.log("Successfully updated user", userResponse.username);
        setIsShown(false);
      })
      .catch((error) => {
        alert("Something went wrong while updating the user");
      });
  };

  return (
    <Pane>
      <Dialog
        isShown={isShown}
        title="Change role"
        onCloseComplete={() => setIsShown(false)}
        onConfirm={editUser}
      >
        <Pane width="100%" backgroundColor="whitesmoke">
          <FormFieldLabel>Username</FormFieldLabel>
          <textarea
            cols="40"
            readOnly
            style={{
              resize: "none",
              width: "fit-content",
              height: "fit-content",
            }}
          >
            {username}
          </textarea>

          <FormFieldLabel isAstrixShown>New Role Id</FormFieldLabel>
          <textarea
            cols="40"
            rows="10"
            style={{ resize: "none" }}
            onChange={(e) => setRole(e.target.value)}
          ></textarea>
        </Pane>
      </Dialog>

      <Button intent="success" onClick={() => setIsShown(true)}>
        Change role
      </Button>
    </Pane>
  );
}

function UsersContent() {
  var history = useHistory();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultMsg, setResultMsg] = useState("");
  const [reset, setReset] = useState(false);

  const f_reset = () => {
    setReset(!reset);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token == undefined) {
        history.replaceState("/users", "/login");
        localStorage.clear();
        history.push("/login");
        return;
      }

      try {
        var apiData = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        var db_users = apiData.data.response;
        setUsers(db_users);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [reset]);

  const deleteUser = (id) => {
    const token = localStorage.getItem("token");
    var url = `${apiUrl}/${id}`;
    console.info(url);

    setLoading(true);

    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const postResponse = response.data.response;
        console.log("Successfully deleted user ");
        setResultMsg("Successfully deleted user");
        f_reset();
        setLoading(false);
        setResultMsg("");
      })
      .catch((error) => {
        alert("Something went wrong while deleting the user");
        setResultMsg("Something went wrong while deleting the user");
        setLoading(false);
      });
  };

  return (
    <Pane
      width="100%"
      flex="1"
      backgroundColor="whitesmoke"
      display="flex"
      justifyContent="flex-start"
      alignItems="flex-start"
      flexDirection="column"
    >
      <Pane
        id="forum-table"
        display="flex"
        justifyContent="flex-start"
        marginLeft="65px"
        marginTop="15px"
      >
        <Table>
          <Table.Head>
            <Table.TextHeaderCell>
              <UserIcon marginRight="5px" />
              Username
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>Email</Table.TextHeaderCell>
            <Table.TextHeaderCell>Role</Table.TextHeaderCell>
            <Table.TextHeaderCell></Table.TextHeaderCell>
            <Table.TextHeaderCell></Table.TextHeaderCell>
          </Table.Head>
          <Table.VirtualBody height={710} width={1780}>
            {users.map((user) => (
              <Table.Row key={user.id}>
                <Table.TextCell>
                  <Badge color="purple" marginRight={8}>
                    {user.username}
                  </Badge>
                </Table.TextCell>
                <Table.TextCell><Badge color="teal" marginRight={8}>
                    {user.email}
                  </Badge></Table.TextCell>
                <Table.TextCell><Badge color="green" marginRight={8}>
                    {user.role}
                  </Badge></Table.TextCell>
                <Table.TextCell>
                  <EditUserRoleDialog id={user.id} username={user.username} />
                </Table.TextCell>
                <Table.TextCell>
                  <Button
                    marginY={8}
                    marginRight={12}
                    iconBefore={TrashIcon}
                    intent="danger"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </Button>
                </Table.TextCell>
              </Table.Row>
            ))}
          </Table.VirtualBody>
        </Table>
      </Pane>

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

function RegisteredUsers() {
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
      <UsersContent />
      <Footer />
    </Pane>
  );
}

export { RegisteredUsers };
