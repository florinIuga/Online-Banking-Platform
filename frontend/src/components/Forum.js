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
  Alert
} from "evergreen-ui";

import axios from "axios";
import { useState } from "react";
import "rsuite/dist/styles/rsuite-default.css";
import { Header, Footer } from "./Layout";
import { useEffect } from "react";

const apiUrl = "http://localhost:3000/api/v1";

function ForumContent() {
  var history = useHistory();
  const loggedUserId = localStorage.getItem("userId");

  console.info(`User Id in Forum is: ${loggedUserId}`);

  const [loading, setLoading] = useState(false);
  const [resultMsg, setResultMsg] = useState("");

  const [loggedUser, setUser] = useState({
    username: null,
    email: null,
  });

  const [forumPosts, setPosts] = useState([]);
  const [postInput, setPostInput] = useState({
    title: null,
    description: null,
    user_id: null,
    response: "",
  });

  // finput e trimis ca parametru automat de onChange
  // si pt a avea acces la input => finput.target.value
  const setPostTitle = (finput) => {
    postInput.title = finput.target.value;
    setPostInput(postInput);
  };

  const setPostDescription = (finput) => {
    postInput.description = finput.target.value;
    postInput.user_id = loggedUserId;
    setPostInput(postInput);
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
        history.replaceState("/forum", "/login");
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

        setPosts(posts.filter((el) => el.visible));
      } catch (err) {
        console.info("erroare in al doilea try catch");
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const publishPost = () => {

    setLoading(true);
    setResultMsg("Post sent successfully");

    const token = localStorage.getItem("token");
    axios
      .post(
        apiUrl + "/forum",
        {
          title: postInput.title,
          description: postInput.description,
          user_id: postInput.user_id,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          crossDomain: true,
        }
      )
      .then((response) => {
        const postResponse = response.data.response;

        console.log("Successfully added post ", postResponse.title);
      })
      .catch((error) => {
        alert("Something went wrong while publishing the post");
      });

      setLoading(false);
  };

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
        flexBasis="60%"
        justifyContent="center"
      >
        <Table>
          <Table.Head>
            <Table.TextHeaderCell>Title</Table.TextHeaderCell>
            <Table.TextHeaderCell>Description</Table.TextHeaderCell>
            <Table.TextHeaderCell>Response</Table.TextHeaderCell>
            <Table.TextHeaderCell>Publisher</Table.TextHeaderCell>
          </Table.Head>
          <Table.VirtualBody height={370} width={1630}>
            {forumPosts.map((post) => (
              <Table.Row
                key={post.id}
                isSelectable
                onSelect={() => alert(post.title)}
              >
                <Table.TextCell>{post.title}</Table.TextCell>
                <Table.TextCell>{post.description}</Table.TextCell>
                <Table.TextCell>
                  {post.response ? post.response : "No response"}
                </Table.TextCell>
                <Table.TextCell><Badge color="purple" marginRight={8}>
                    {post.publisher}
                  </Badge></Table.TextCell>
              </Table.Row>
            ))}
          </Table.VirtualBody>
        </Table>
      </Pane>

      <Pane
        id="input_fields"
        display="flex"
        justifyContent="center"
        flexBasis="40%"
        marginTop="75px"
      >
        <Card
          width="fit-content"
          marginTop="5px"
          padding="5%"
          height="40%"
          backgroundColor="white"
          boxShadow="2px 2px 10px gray"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Card
            borderBottom
            marginBottom="20px"
            display="flex"
            justifyContent="center"
          >
            <Heading marginBottom="5px" marginTop="5px">
              Write a new post
            </Heading>
          </Card>

          <Pane
            id="textFields"
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
          >
            <TextareaField
              isInvalid={true}
              width="300px"
              label="Title"
              onChange={setPostTitle}
              required
              placeholder="Title"
            />

            <TextareaField
              marginTop="0px"
              marginLeft="10px"
              width="300px"
              isInvalid={true}
              label="Description"
              onChange={setPostDescription}
              required
              placeholder="Enter a valid description"
            />
          </Pane>

          <Button
            display="flex"
            width="fit-content"
            justifyContent="center"
            iconBefore={LogInIcon}
            intent="success"
            onClick={publishPost}
          >
            Submit
          </Button>

          <Pane id="messages" display="flex">
            {resultMsg.length != 0 && <Alert intent="success" marginTop="20px" title={resultMsg}></Alert>}
          </Pane>
        </Card>
      </Pane>

      

    </Pane>
  );
}

function Forum() {
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

export { Forum };
