// 1. Take planets from imported json file which should have planet name, distance, orbits what, speed, moons
// import * as planet from './planets.json';
// for some reason node just doesn't want to import as above is shown
import fs from 'fs';
let rawPlanets = fs.readFileSync('planets.json');
let planets = JSON.parse(rawPlanets);
// 2. For loop which loops as long as there are planets left in json file.
let planetsAsThreejsObjects = {};

planets.forEach(planet => {
  const name = planet.name;
  console.log(name, planet.size);
});
// 3. Export variable which stores the settings for each planet

// Exporting functions

// https://stackoverflow.com/questions/49616639/how-can-i-export-all-functions-from-a-file-in-js
// TL:DR; there isn't wild card to export everything. Just export functions one by one.

// export function myFunction () { ... }