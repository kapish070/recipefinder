 
import React, { Component } from "react";
import { render } from "react-dom";
import "./style.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      search: "",
      foodToCook: {},
      img: "",
      lstate: null
    };
  }

  sName = event => {
    this.setState({
      search: event.target.value
    });
  };

  gRecipe = async () => {
    this.setState({
      lstate: "LOADING"
    });
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${this.state.search}`
    );

    const myJson = await response.json();
    console.log("myJson", myJson);

    if (myJson.meals == null) {
      this.setState({
        lstate: "LOADING_FAILED"
      });
    }
    var ingredients = myJson.meals.map(this.getIngredients);
    var measures = myJson.meals.map(this.getMeasures);
    this.setState({
      foodToCook: myJson.meals[0],
      img: myJson.meals[0].strMealThumb,
      lstate: "LOADING_DONE",
      ingredients: ingredients,
      measures: measures
    });
    console.log(this.state.foodToCook);
  };

  //toggle button
  toggleLike = event => {
    if (event.target.style.color == "black") event.target.style.color = "red";
    else event.target.style.color = "black";
  };

  //get ingredients
  getIngredients = object => {
    var keys = Object.keys(object);
    console.log(keys);
    var ingredients = [];
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].indexOf("strIngredient") != -1) {
        if (object["" + keys[i]] != null && object["" + keys[i]].length > 0)
          ingredients.push(object["" + keys[i]]);
      }
    }
    console.log(ingredients);
    return ingredients;
  };

  //get measures
  getMeasures = object => {
    var keys = Object.keys(object);
    console.log(keys);
    var measures = [];
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].indexOf("strMeasure") != -1) {
        if (object["" + keys[i]] != null && object["" + keys[i]].length > 0)
          measures.push(object["" + keys[i]]);
      }
    }
    console.log(measures);
    return measures;
  };

  //print ingredients and measures
  printIngredients = (value, index) => {
    console.log(this.state);
    return (
      <p>
        {value} ---- {this.state.measures[0][index]}
      </p>
    );
  };

  render() {
    return (
      <div id="parent">
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.css"
        />

        <div id="header">
          <h1 id="head">Recipe searcher</h1>
          <center>
            <input
              onChange={() => this.sName(event)}
              value={this.state.search}
              placeholder="Enter the Name of the Dish"
            />
            <span>
              <button onClick={this.gRecipe}>Get Recipes</button>
            </span>
            <br />
            <br />
            {this.state.lstate == null ? (
              <h2>Type a Dish Name to search for it's ingredient</h2>
            ) : (
              ""
            )}
          </center>
        </div>
        {this.state.lstate == "LOADING_FAILED" ? (
          <h1>No Data Has been received</h1>
        ) : (
          ""
        )}
        {this.state.lstate == "LOADING" ? <h1>Loading....</h1> : ""}
        {this.state.lstate == "LOADING_DONE" ? (
          <div id="container">
            <div id="header1">
              <div />
              <div>
                <h1 id="main">{this.state.foodToCook.strMeal}</h1>
              </div>
              <div>
                <i
                  id="heart"
                  className="far fa-heart"
                  onClick={this.toggleLike}
                />
              </div>
            </div>
            <div id="description">
              <div id="left">
                <img src={this.state.img} />
              </div>
              <div id="right">
                <i>Category of the Meal - </i>
                {this.state.foodToCook.strCategory}
                <br />
                <i>Area of the Meal - </i>
                {this.state.foodToCook.strArea}
                <br />
                <br />
                <i>Ingredients</i>
                <div id="ingredient">
                  {this.state.ingredients[0].map(this.printIngredients)}
                </div>
                <i>
                  <center>Recipe</center>
                </i>
                <div id="recipe">{this.state.foodToCook.strInstructions}</div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
render(<App />, document.getElementById("root"));
