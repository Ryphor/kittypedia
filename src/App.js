import React, { Component } from "react";
import axios from "axios";
import Autocomplete from "./components/Autocomplete";
import BreedInfoWidget from "./components/BreedInfoWidget";
import Spinner from './components/Spinner'
import "./App.css";

// Setting API key here for ease-of-access, obviously not suitable for production.
axios.defaults.headers.common["x-api-key"] =
  "bf93372e-72a4-4ef8-8460-a3d04b4c07fa";

class App extends Component {
  state = {
    inputFocused: false,
    selectedId: null,
    listOfBreeds: [],
    loading: true
  };

  componentDidMount() {
    // Fetch basic info for all breeds and store in state. Enables instant rendering of info (except images).
    axios.get("https://api.thecatapi.com/v1/breeds").then(res => {
      let listOfBreeds = [];
      res.data.forEach(breed => {
        listOfBreeds.push({
          id: breed.id,
          name: breed.name,
          temp: breed.temperament,
          origin: breed.origin,
          desc: breed.description
        });
      });
      // Add list of breed info to state and stop loading
      this.setState({ listOfBreeds: listOfBreeds, loading: false });
    });
  }

  // Track whether our input field is active. Takes a boolean.
  focusHandler = focused => {
    this.setState({ inputFocused: focused });
  };

  // This function is passed to the Autocomplete component as a prop and allows us
  // to get the index of the correct breed in this.state.listOfBreeds when the user
  // selects a breed from the autocomplete dropdown. It accepts the 4-char id string
  // returned from the API.
  selectIdHandler = id => {
      if (this.state.inputFocused) {
        const index = this.state.listOfBreeds.findIndex(breed => breed.id === id);
        this.setState({ selectedId: index });
      }
  };

  render() {
    // Make the logo small or big depending on state.
    let renderedStyles = {};
    if (!this.state.inputFocused) {
      renderedStyles.logo = "fas fa-cat logo-full-size";
    } else {
      renderedStyles.logo = "fas fa-cat logo-small-size";
    }

    return (
      
      <div className="Container">
        {/* Render a spinner until the data has been fetched */}
        {this.state.loading ? <Spinner /> : 
          <>
          <i className={renderedStyles.logo} />
          <Autocomplete
            listOfBreeds={this.state.listOfBreeds}
            onFocus={() => this.focusHandler(true)}
            onBlur={() => this.focusHandler(false)}
            selectIdHandler={this.selectIdHandler}
          />
          {/* Below, we display the BreedInfoWidget if a breed has been selected and the input field is not active. */}
          {this.state.selectedId && !this.state.inputFocused ? (
            <BreedInfoWidget
              info={this.state.listOfBreeds[this.state.selectedId]}
            />
          ) : null}
          </>
        
        }
        
      </div>
    );
  }
}

export default App;
