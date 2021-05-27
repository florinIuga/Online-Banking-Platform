import "../styles/App.scss";
import { useHistory } from "react-router-dom";
import {
  Pane,
  Button,
  Table,
  Dialog,
  FormFieldLabel,
  EditIcon,
  Spinner,
  Alert,
  TickCircleIcon,
  TrashIcon,
  Badge
} from "evergreen-ui";
import axios from "axios";
import { useState } from "react";
import "rsuite/dist/styles/rsuite-default.css";
import { Header, Footer } from "./LayoutSupport";
import * as React from "react";
import { useEffect } from "react";

const apiUrl = "http://localhost:3000/api/v1";

function EditResponseDialog({ id, description }) {
  const [isShown, setIsShown] = React.useState(false);

  const [responseInput, setResponse] = useState("");

  const editResponse = () => {
    const token = localStorage.getItem("token");
    var url = `${apiUrl}/forum/${id}`;
    console.info(url);
    console.log(responseInput);

    axios
      .put(
        url,
        {
          response: responseInput,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const postResponse = response.data.response;

        console.log("Successfully updated post ", postResponse.title);
        setIsShown(false);
      })
      .catch((error) => {
        alert("Something went wrong while updating the post response ");
      });
  };

  return (
    <Pane>
      <Dialog
        isShown={isShown}
        title="Reply"
        onCloseComplete={() => setIsShown(false)}
        onConfirm={editResponse}
      >
        <Pane width="100%" backgroundColor="whitesmoke">
          <FormFieldLabel>Description</FormFieldLabel>
          <textarea
            cols="40"
            readOnly
            style={{
              resize: "none",
              width: "fit-content",
              height: "fit-content",
            }}
          >
            {description}
          </textarea>

          <FormFieldLabel isAstrixShown>Answer</FormFieldLabel>
          <textarea
            cols="40"
            rows="10"
            style={{ resize: "none" }}
            onChange={(e) => setResponse(e.target.value)}
          ></textarea>
        </Pane>
      </Dialog>

      <Button
        intent="success"
        appearance="primary"
        onClick={() => setIsShown(true)}
      >
        Reply
      </Button>
    </Pane>
  );
}

function ShowResponseDialog({ response }) {
  const [isShown, setIsShown] = React.useState(false);

  return (
    <Pane>
      <Dialog
        isShown={isShown}
        title="Response"
        onCloseComplete={() => setIsShown(false)}
        confirmLabel="Close"
        hasCancel="false"
      >
        {response}
      </Dialog>

      <Button
        intent="success"
        onClick={() => setIsShown(true)}
      >
        Show response
      </Button>
    </Pane>
  );
}

function DescriptionDialog({ description }) {
  const [isShown, setIsShown] = React.useState(false);

  return (
    <Pane>
      <Dialog
        isShown={isShown}
        title="Description"
        onCloseComplete={() => setIsShown(false)}
        confirmLabel="Close"
        hasCancel="false"
      >
        {description}
      </Dialog>

      <Button
        intent="success"
        appearance="primary"
        onClick={() => setIsShown(true)}
      >
        Show description
      </Button>
    </Pane>
  );
}

function ForumContent() {
  var history = useHistory();
  const [forumPosts, setPosts] = useState([]);
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
        history.replaceState("/forum_support", "/login");
        history.push("/login");
        return;
      }

      try {
        var apiData = await axios.get(apiUrl + "/forum", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (apiData == undefined) {
          console.info("Api is null");
        }

        var posts = apiData.data.response;
        setPosts(posts);
      } catch (err) {
        console.info("erroare in al doilea try catch");
        console.log(err);
      }
    };

    fetchData();
  }, [reset]);

  const deletePost = (id) => {
    const token = localStorage.getItem("token");
    var url = `${apiUrl}/forum/${id}`;
    console.info(url);

    setLoading(true);
    setResultMsg("Successfully deleted post");

    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const postResponse = response.data.response;
        f_reset();
        console.log("Successfully deleted post ", postResponse.title);

        setLoading(false);
        setResultMsg("");
      })
      .catch((error) => {
        alert("Something went wrong while deleting the post");
        setResultMsg("Something went wrong while deleting the post");
        setLoading(false);
      });
  };

  const setVisiblePost = (id) => {
    const token = localStorage.getItem("token");
    var url = `${apiUrl}/forum/${id}`;
    console.info(url);

    setLoading(true);

    axios
      .put(
        url,
        {
          visible: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const postResponse = response.data.response;
        console.log("Successfully updated post ", postResponse.title);
        setResultMsg("Successfully changed post visibility");
        setLoading(false);
        setResultMsg("");
      })
      .catch((error) => {
        alert("Something went wrong while deleting the post");
        setResultMsg("Something went wrong while deleting the post");
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
        marginLeft="25px"
        marginTop="15px"
      >
        <Table>
          <Table.Head>
            <Table.TextHeaderCell>Title</Table.TextHeaderCell>
            <Table.TextHeaderCell>Description</Table.TextHeaderCell>
            <Table.TextHeaderCell>Response</Table.TextHeaderCell>
            <Table.TextHeaderCell>Publisher</Table.TextHeaderCell>
            <Table.TextHeaderCell></Table.TextHeaderCell>
          </Table.Head>
          <Table.VirtualBody height={710} width={1780}>
            {forumPosts.map((post) => (
              <Table.Row key={post.id}>
                <Table.TextCell>{post.title}</Table.TextCell>
                <Table.TextCell>
                  <DescriptionDialog description={post.description} />
                </Table.TextCell>
                <Table.TextCell>
                  {post.response ? (
                    <ShowResponseDialog response={post.response} />
                  ) : (
                    <EditResponseDialog
                      id={post.id}
                      description={post.description}
                    />
                  )}
                </Table.TextCell>
                <Table.TextCell>
                  <Badge color="purple" marginRight={8}>
                    {post.publisher}
                  </Badge>
                </Table.TextCell>
                <Table.TextCell>
                  <Pane display="flex" justifyContent="center">
                    <Button
                      marginY={8}
                      marginRight={12}
                      iconBefore={EditIcon}
                      intent="success"
                      onClick={() => setVisiblePost(post.id)}
                    >
                      Set Visible
                    </Button>

                    <Button
                      marginY={8}
                      marginRight={12}
                      iconBefore={TrashIcon}
                      intent="danger"
                      onClick={() => deletePost(post.id)}
                    >
                      Delete
                    </Button>
                  </Pane>
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

function ForumSupport() {
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
      <ForumContent />
      <Footer />
    </Pane>
  );
}

export { ForumSupport };
