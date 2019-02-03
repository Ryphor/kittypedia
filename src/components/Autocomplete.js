// This component was only partially written by myself, it's taken from the below link and customised to my needs.
// I have commented where I have adjusted things.
// Essentially, it creates the autocomplete functionality by taking our list of breeds.

import React, { Component } from "react";
import * as Autosuggest from "react-autosuggest";
import AutosuggestHighlightMatch from "autosuggest-highlight/umd/match";
import AutosuggestHighlightParse from "autosuggest-highlight/umd/parse";
import "./Autocomplete.css";

class Autocomplete extends Component {
  constructor() {
    super();

    this.state = {
      value: "",
      suggestions: []
    };
  }

  componentDidMount() {
    this.setState({suggestions: this.props.listOfBreeds})
  }

  escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  getSuggestions(value) {
    const escapedValue = this.escapeRegexCharacters(value.trim());
    if (escapedValue === "") {
      return [];
    }
    const regex = new RegExp("\\b" + escapedValue, "i");
    return this.props.listOfBreeds.filter(breed =>
      regex.test(this.getSuggestionValue(breed))
    );
  }

  getSuggestionValue = suggestion => {
    // this.props.selectIdHandler() takes the breed id string from the API and finds the correct index in our breeds array.
    // We store it in the App state so we know what breed info to render.
    // Probably not the best place to call this function as it gets called way more often then needed. Need to optimise once I
    // understand this react-autosuggest package a little more.
    this.props.selectIdHandler(suggestion.id);

    return `${suggestion.name}`;
  };

  renderSuggestion(suggestion, { query }) {
    const suggestionText = `${suggestion.name}`;
    const matches = AutosuggestHighlightMatch(suggestionText, query);
    const parts = AutosuggestHighlightParse(suggestionText, matches);
    
    return (
      <span className="suggestion-content">
        <span className="name">
          {parts.map((part, index) => {
            const className = part.highlight ? "highlight" : null;

            return (
              <span className={className} key={index}>
                {part.text}
              </span>
            );
          })}
        </span>
      </span>
    );
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Start typing a cat breed",
      value,
      onChange: this.onChange,
      onFocus: this.props.onFocus,
      onBlur: this.props.onBlur
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        focusInputOnSuggestionClick={false}
        shouldRenderSuggestions={() => true}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

export default Autocomplete;
