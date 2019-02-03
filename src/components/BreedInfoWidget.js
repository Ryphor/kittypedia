import React, { Component } from "react";
import axios from "axios";
import "./BreedInfoWidget.css";

class BreedInfoWidget extends Component {
  state = {
    imgUrls: []
  };

  componentDidMount() {
  // Pull eight image URLs of selected breed from The Cat API.
    axios
      .get("https://api.thecatapi.com/v1/images/search", {
        params: { breed_id: this.props.info.id, limit: 8 }
      })
      .then(res => {
        let urls = [];
        res.data.forEach(img => {
          urls.push(img.url);
        });
        this.setState({ imgUrls: urls });
      })
      .catch(err => {
          console.log(err)
      });
  }

  render() {
    const { name, desc, temp } = this.props.info;
    // Make breed temperaments into array so we can map each one to JSX.
    const tempsArray = temp.split(", ");
    return (
      <div className="BreedInfoContainer">
        <h1>{name}</h1>
        {/* Map each temperament to a styled div */}
        {tempsArray.map((temp, i) => {
          return (
            <div key={i} className="TempEntry">
              <h5>{temp}</h5>
            </div>
          );
        })}
        <p>{desc}</p>
        <div className="BreedImagesContainer">
          {/* Map each image to a styled div */}
          {this.state.imgUrls.map((url, i) => {
            return (
              <div
                key={i}
                className="BreedImageContainer"
                style={{ backgroundImage: "url(" + url + ") " }}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default BreedInfoWidget;
