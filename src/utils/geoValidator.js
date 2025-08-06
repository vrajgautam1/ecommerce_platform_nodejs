const {City, State} = require("country-state-city")

function isValidState(stateName){
    const statesList = State.getStatesOfCountry("IN")
    const isValidstate = statesList.find(state => state.name.toLowerCase() === stateName.toLowerCase()) 
    return isValidstate
}

function isValidCity(stateName, cityName){
    const statesList = State.getStatesOfCountry("IN")
    let isValidstate = statesList.find(state => state.name.toLowerCase() === stateName.toLowerCase()) 

    if(!isValidstate) return false

    const citiesInStateList = City.getCitiesOfState("IN", isValidstate.isoCode)
    const isValidCity = citiesInStateList.find(city => city.name.toLowerCase() === cityName.toLowerCase())
    return isValidCity
}

module.exports = {isValidCity, isValidState}