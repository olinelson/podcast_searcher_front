import React, { Component, Fragment } from "react";

// browser router
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from "react-router-dom";

// react debouce input
import { DebounceInput } from "react-debounce-input";

// beat loader from react spinners
import { BeatLoader } from "react-spinners";

// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// api URL
import API_URL from "../config";

// unique id generator
const uuidv1 = require("uuid/v1");

class ClipsContainer extends Component {
  state = {
    clips: [],
    filteredClips: [],
    loading: true
  };

  // finds clips with titles that match input and puts result in state
  searchInputHandler = e => {
    let input = e.target.value;
    let result
    result = [...this.state.clips].filter(
      c => c.name.toLowerCase().includes(input)
    );
    this.setState({
      filteredClips: result,
      loading: false
    });
  };

  componentDidMount = () => {
    this.getAllClips();
  };

  //  gets all clips on load * will refactor to only on first load of app and when adding/ removing clips
  getAllClips = () => {
    fetch(`${API_URL}/clips`, {
      method: "GET"
    })
      .then(r => r.json())
      .then(r =>
        this.setState({
          clips: r,
          filteredClips: r,
          loading: false
        })
      );
  }; // end of getAllClips

  showClips = () => {
    if (this.state.filteredClips) {
      if (
        this.state.filteredClips.length === 0 &&
        this.state.loading === false
      ) {
        return (
          <Fragment>
            <p className="no-results-message">
              {" "}
              <FontAwesomeIcon icon="sad-tear" /> no results...
            </p>
          </Fragment>
        );
      } //end of no results if statements

      return this.state.filteredClips.map(c => (
        <div key={uuidv1()} className="clip-card">
          <div className="clip-image-container">
            <img
              alt="clip-thumbnail"
              className="clip-image"
              src={c.gcloud_image_link}
            />
          </div>

          <Link className="clip-card-title" key={uuidv1()} to={`clips/${c.id}`}>
            {" "}
            {c.name}
          </Link>

          <small className="author-tag">{c.author.user_name} </small>
        </div>
      ));
    } // end of if statement to wait for props
  }; //end of show clip

  render() {
    return (
      <div className="clips-container">
        <div className="search-container">
          <DebounceInput
            label="search clips"
            placeholder="search for clips..."
            minLength={2}
            debounceTimeout={300}
            onChange={this.searchInputHandler}
          />
        </div>

        <div className="clips-grid">
          {this.state.loading === true ? <BeatLoader /> : null}
          {this.showClips()}
        </div>
      </div> //end of clips container div
    ); // end of return
  } // end of render
} // end of ClipsContainer

export default ClipsContainer;
