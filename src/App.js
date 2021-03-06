import React, { Component, Fragment } from "react";
import "./App.css";

// react router
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from "react-router-dom";

import { Container } from "semantic-ui-react";

// components
import NavBar from "./components/NavBar";
import Clip from "./hocs/Clip";
import AddClipForm from "./components/AddClipForm";
import AddVideoClipForm from "./components/AddVideoClipForm";
import SignUpForm from "./components/SignUpForm";
import LoginForm from "./components/LoginForm";
import User from "./hocs/User";
import HomePage from "./components/HomePage";
import NewClipChooser from "./components/NewClipChooser";
import AddUrlForm from "./components/AddUrlForm";

//  hocs
import FeedContainer from "./hocs/FeedContainer";

// api URL
import API_URL from "./config";
import { RaceSubscriber } from "rxjs/internal/observable/race";

// filtered clips and clips used for results in clips container
class App extends Component {
  state = {
    currentUser: null
  };

  componentDidMount() {
    this.getCurrentUser();
  }

  // auto login method that sets current user if one has already logged in
  getCurrentUser = () => {
    let token = localStorage.getItem("token");

    if (token) {
      fetch(`${API_URL}/auto_login`, {
        method: "GET",
        headers: {
          Authorization: token
        }
      })
        .then(r => r.json())

        .then(r =>
          this.setState({
            currentUser: r.user.data
          })
        );
    }
  };

  // for use with the login form component
  setCurrentUser = response => {
    this.setState({
      currentUser: response.user.data
    });

    localStorage.setItem("token", response.jwt);
  };

  logout = () => {
    localStorage.removeItem("token");
    this.setState({ currentUser: null });
    this.props.history.push("/");
  };

  render() {
    return (
      <Fragment>
        <NavBar logout={this.logout} currentUser={this.state.currentUser} />
        <Container
          fluid
          // style={{
          //   backgroundColor: "#C8C2C9",
          // }}
        >
          <Route exact path="/" component={this.Home} />
          <Route exact path="/feed" component={this.Feed} />
          <Route exact path="/clips" component={this.ClipsIndex} />
          <Route path="/clips/:id" component={this.ClipShow} />
          <Route path="/upload" component={this.Upload} />
          <Route path="/uploadvideo" component={this.UploadVideo} />
          <Route path="/addurl" component={this.AddUrl} />
          <Route path="/newClip" component={this.NewClip} />
          {/* <Route path="/signup" component={this.SignUp} /> */}
          <Route
            path="/signup"
            render={routerProps => (
              <SignUpForm
                {...routerProps}
                getCurrentUser={this.getCurrentUser}
                setCurrentUser={this.setCurrentUser}
              />
            )}
          />
          <Route path="/users/:id" component={this.UserShow} />
          <Route
            path="/login"
            render={routerProps => (
              <LoginForm
                {...routerProps}
                getCurrentUser={this.getCurrentUser}
                setCurrentUser={this.setCurrentUser}
              />
            )}
          />
        </Container>
      </Fragment>
    );
  } // end of render method

  Home = () => {
    return <HomePage />;
  };

  Feed = () => {
    return (
      <FeedContainer
        filterClips={this.filterClips}
        getAllClips={this.getAllClips}
        filteredClips={this.state.filteredClips}
        clips={this.state.clips}
      />
    );
  };

  ClipShow = ({ match }) => {
    // id used to find clip in clip component with its own fetch request
    let id = match.params.id;
    return (
      <Clip
        currentUser={this.state.currentUser}
        id={id}
        getCurrentUser={this.getCurrentUser}
      />
    );
  };

  UserShow = ({ match }) => {
    return (
      <User
        currentUser={this.state.currentUser}
        getCurrentUser={this.getCurrentUser}
      />
    );
  };

  NewClip = () => {
    return (
      <NewClipChooser
        getCurrentUser={this.getCurrentUser}
        getAllClips={this.getAllClips}
        currentUser={this.state.currentUser}
        getUsersClips={this.getUsersClips}
      />
    );
  };

  Upload = () => {
    return (
      <AddClipForm
        getCurrentUser={this.getCurrentUser}
        getAllClips={this.getAllClips}
        currentUser={this.state.currentUser}
        getUsersClips={this.getUsersClips}
      />
    );
  };

  UploadVideo = () => {
    return (
      <AddVideoClipForm
        getCurrentUser={this.getCurrentUser}
        getAllClips={this.getAllClips}
        currentUser={this.state.currentUser}
        getUsersClips={this.getUsersClips}
      />
    );
  };

  AddUrl = () => {
    return (
      <AddUrlForm
        getCurrentUser={this.getCurrentUser}
        getAllClips={this.getAllClips}
        currentUser={this.state.currentUser}
        getUsersClips={this.getUsersClips}
      />
    );
  };

  SignUp = routerProps => {
    return (
      <SignUpForm
        {...routerProps}
        getCurrentUser={this.getCurrentUser}
        setCurrentUser={this.setCurrentUser}
      />
    );
  };
}

export default withRouter(App);
