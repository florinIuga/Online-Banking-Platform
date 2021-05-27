import '../styles/App.scss';
import { useHistory } from "react-router-dom";
import 'rsuite/dist/styles/rsuite-default.css';
import {Pane, Heading} from 'evergreen-ui';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {Header, Footer} from './LayoutSupport'
import { Bar } from "react-chartjs-2";
import * as React from 'react'

const apiUrl = 'http://localhost:3000/api/v1';


function DashboardContent() {
  var history = useHistory();
  const [state_forum, setForum] = useState(null);
  
  // get forum statistics
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token == undefined) {
        localStorage.clear();
        history.replaceState("/dashboard_support", "/login");
        history.push("/login");
        return;
      }

      try {
        var url = `${apiUrl}/statistics/forum`;
        var apiData = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        var forum_posts = apiData.data.response;
        const forumData = {
          labels: forum_posts.map((post) => post.post_date),
          datasets: [
            {
              label: "Forum posts / day",
              fill: false,
              lineTension: 0.5,
              backgroundColor: "#0000FF",
              borderColor: "#0000FF",
              borderWidth: 2,
              data: forum_posts.map(
                (post) => post.post_count
              ),
            },
          ],
        };

        setForum((prev) => ({
          ...prev,
          state_forum: forumData,
        }));

        console.log(state_forum);
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
      
      <Heading size="10px">Forum Analytics</Heading>

      <Pane id="forum" display="flex" marginTop="30px">
        {state_forum && (
          <Bar
            data={state_forum.state_forum}
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

function DashboardSupport() {
  return (
      <Pane height="100vh" width="100vw" maxHeight="100vh" maxWidth="100vw" margin="0" padding="0"
          display="flex" flexDirection="column">
          <Header/>
          <DashboardContent/>
          <Footer/>
      </Pane>
  )
}

  export {DashboardSupport};