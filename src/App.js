import React, { Component, Fragment } from "react";
import "./App.css";

// font awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faCheckSquare, faCoffee, faCheck, faUser, faSadTear } from '@fortawesome/free-solid-svg-icons'

// react router
import { BrowserRouter as Router, Route, Link, withRouter } from "react-router-dom";

// components
import NavBar from "./components/NavBar";
import Clip from "./hocs/Clip";
import AddClipForm from "./components/AddClipForm";
import AddVideoClipForm from "./components/AddVideoClipForm";
import SignUpForm from "./components/SignUpForm";
import LoginForm from "./components/LoginForm"
import User from "./hocs/User"
import Jumbotron from "./components/Jumbotron"

//  hocs
import Feed from "./hocs/Feed"


// api URL
import API_URL from "./components/config"

// font awesome icons in use
library.add(fab, faCheckSquare, faCoffee, faCheck, faUser, faSadTear)

// filtered clips and clips used for results in clips container
class App extends Component {
  state = {
    currentUser: null,
  };

  componentDidMount() {
    this.getCurrentUser()
  }

  // auto login method that sets current user if one has already logged in
  getCurrentUser= () => {
    let token = localStorage.getItem("token")
    if (token) {
      fetch(`${API_URL}/auto_login`, {
          method: "GET",
          headers: {
            "Authorization": token
          }
        })
      .then(r => r.json())
      .then(r => this.setState({
         currentUser: r,
        }))
    }
  }

  // for use with the login form component
  setCurrentUser = (response) => {
    this.setState({
      currentUser: response.user,
    })

    localStorage.setItem("token", response.jwt)
  }


  logout = () => {
    localStorage.removeItem("token")
    this.setState({currentUser: null})
    this.props.history.push("/")
  }



  render() {

    console.log(process.env)
    return (
        <Fragment >
          <NavBar logout={this.logout} currentUser={this.state.currentUser} />
          <div className="site-container" >
            <Route exact path="/" component={this.Home} />
            <Route exact path="/feed" component={this.Feed} />
            <Route exact path="/clips" component={this.ClipsIndex} />
            <Route path="/clips/:id" component={this.ClipShow} />
            <Route path="/upload" component={this.Upload} />
            <Route path="/uploadvideo" component={this.UploadVideo} />
            <Route path="/signup" component={this.SignUp} />
            <Route path="/users/:id" component={this.UserShow}/>
            <Route path="/login" render={(routerProps) => <LoginForm {...routerProps} getCurrentUser={this.getCurrentUser} setCurrentUser={this.setCurrentUser}/> } />
          </div>
        </Fragment>
    );
  } // end of render method

  Home = () => {
    return(
      < Jumbotron / >
    )
  }

  Feed = () => {
    return (
      <Feed 
        filterClips={this.filterClips}
        getAllClips={this.getAllClips}
        filteredClips={this.state.filteredClips}
        clips={this.state.clips}
      />
    );
  };


  ClipShow = ({ match }) => {
    // id used to find clip in clip component with its own fetch request
    let id = match.params.id
    return (
      <Clip  
        currentUser={this.state.currentUser}
        id={id}
        getCurrentUser={this.getCurrentUser}
      />
    );
  }; 


  UserShow = ({match}) => {
    return (
      <User
        currentUser={this.state.currentUser}
        getCurrentUser={this.getCurrentUser}
      
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


  SignUp = () => {
    return (
        <SignUpForm />
    );
  };

} 
{/* end of app */}




export default withRouter(App);


