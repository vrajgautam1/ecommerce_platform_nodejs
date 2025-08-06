let {Country, State, City} = require("country-state-city")

// console.log(State.getStatesOfCountry("IN"))
// console.log(City.getCitiesOfState("IN","GJ"))


const statesList = State.getStatesOfCountry("IN")
// console.log(typeof states)
// console.log(states);

// const lowercaseStateList = statesList.map(state => state.name.toLowerCase())
// const isValidState = lowercaseStateList.includes(stateName.toLowerCase())
// console.log(isValidState)

let stateName = "Gujarat"
const state = statesList.find(state => state.name.toLowerCase() === stateName.toLowerCase())
// const somethingWillHappen = statesList.some(state => state.name.toLowerCase() === stateName.toLowerCase())
// console.log(somethingWillHappen)

// console.log(state.isoCode)

let cityName = "mumbai"
const citiesList = City.getCitiesOfState("IN", state.isoCode)

const city = citiesList.find(city => city.name.toLowerCase() === cityName.toLowerCase())
console.log(city);

if(!city){
  console.log(`please check ${cityName} probably is not located in ${stateName}`);
}
