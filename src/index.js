import FetchWrapper from "./fetch_wrapper.js";
// Snackbar
import snackbar from "snackbar";
import "snackbar/dist/snackbar.min.css";
// Chart
import Chart from "chart.js/auto";

const form = document.querySelector("form");
const foodChart = document.querySelector("#food-chart");
const displayCalories = document.querySelector("#display-calories");
const foodCards = document.querySelector("#food-cards");
const API = new FetchWrapper(
  "https://firestore.googleapis.com/v1/projects/programmingjs-90a13/databases/(default)/documents/"
);

const getFoodData = () => {
  API.get("kev").then((data) => {
    for (let i = 0; i < data.documents.length; i++) {
      const name = data.documents[i].fields.name.stringValue;
      const carbs = data.documents[i].fields.carbs.integerValue;
      const protein = data.documents[i].fields.protein.integerValue;
      const fat = data.documents[i].fields.fat.integerValue;
      renderFoodData(carbs, protein, fat, name);
    }
  });
};

const postFoodData = (carbs, protein, fat, foodName) => {
  return API.post("kev", {
    fields: {
      fat: {
        integerValue: fat,
      },
      name: {
        stringValue: foodName,
      },
      protein: {
        integerValue: protein,
      },
      carbs: {
        integerValue: carbs,
      },
    },
  });
};

const addFood = (e) => {
  e.preventDefault();
  const foodName = document.querySelector("#food-name").value;
  const inputCarbs = document.querySelector("#input-carbs").value;
  const inputProtein = document.querySelector("#input-protein").value;
  const inputFat = document.querySelector("#input-fat").value;
  if (foodName !== "Please select" && inputCarbs && inputProtein && inputFat) {
    snackbar.duration = 2500;
    snackbar.show("Food data added successfully.");

    blankChart.destroy();
    blankChart = renderFoodChart(inputCarbs, inputProtein, inputFat, foodName);
    postFoodData(inputCarbs, inputProtein, inputFat, foodName);
    renderFoodData(inputCarbs, inputProtein, inputFat, foodName);
  } else {
    snackbar.duration = 3500;
    snackbar.show("Something's not right. Please complete all fields");
  }
  form.reset();
};

const renderFoodChart = (carbs, protein, fat) => {
  const data = {
    labels: ["Carbs", "Protein", "Fat"],
    datasets: [
      {
        label: "Nutrients",
        backgroundColor: ["#86fbfb", "#e310cb", "#ffe100"],
        data: [carbs, protein, fat],
      },
    ],
  };

  const config = {
    type: "bar",
    data: data,
    options: {},
  };

  const newChart = new Chart(foodChart, config);
  return newChart;
};

const renderFoodData = (carbs, protein, fat, foodname) => {
  const caloriesTotal = carbs * 4 + protein * 4 + fat * 9;

  foodCards.insertAdjacentHTML(
    "beforeend",
    `<div class="card">
        <h3>${foodname}</h3>
        <p>${caloriesTotal} calories</p>
        <ul>
          <li>
            <div><span class="carbs-dot">&bull;</span> Carbs</div>
            <div>${carbs}g</div>
          </li>
          <li>
            <div><span class="protein-dot">&bull;</span> Protein</div>
            <div>${protein}g</div>
          </li>
          <li>
            <div><span class="fat-dot">&bull;</span> Fat</div>
            <div>${fat}g</div>
          </li>
        </ul>
      </div>
    `
  );

  displayCalories.textContent = caloriesTotal;
};

getFoodData();
let blankChart = renderFoodChart(0, 0, 0);
form.addEventListener("submit", addFood);
