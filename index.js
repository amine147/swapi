// Write you code here
const axios = require('axios');
const url = "https://swapi.dev/api/";

const getPlanets = async (idNumber) => {
  try {
    const response = await axios.get(`${url}films/${idNumber}/`);
    if (response?.data?.planets) {
      return Array.isArray(response.data.planets) ? response.data.planets : [];
    }
  } catch (errors) {
    console.warn('Error in getPlanets!');
    throw new Error(errors);
  }
}

const getPlanetDetails = async (planets) => {
  return axios
    .all(planets.map((endpoint) => axios.get(endpoint)))
    .then(result => {
      return result.map(item => item?.data) || [];
    })
    .catch(errors => {
      console.warn('Error in getPlanetData!');
      throw new Error(errors);
    });
}

const getFilmNumber = () => {
  let args = process.argv.slice(2);
  return Number.isInteger(parseInt(args[0])) ? parseInt(args[0]) : NaN;
}

const startApp = async () => {
  let filmNumber = getFilmNumber();
  if (filmNumber) {
    let diameter = 0;
    const planets = await getPlanets(filmNumber);
    const planetDetailsAll = await getPlanetDetails(planets); 

    planetDetailsAll.forEach(planetData => {
      if (planetData?.terrain?.includes('mountains') && planetData?.surface_water > 0) {
        diameter += parseInt(planetData?.diameter);
      }
    });
    console.log(diameter);
  } else {
    console.error('Please inter a valid number');
  }
};

startApp();