import RailRoadGraph from "./components/RailRoadGraph";
var rrGraph = new RailRoadGraph();

const getData = async () => {
  let res = await fetch("../public/city_connections.txt");
  let txt = await res.text();
  return txt.split(", ");
};

const begin = async () => {
  ["A", "B", "C", "D", "E"].forEach((cityName) => {
    rrGraph.addCityToGraph(cityName);
  });

  let cityConnections = await getData();
  cityConnections.forEach((connection) => {
    let [sourceCityName, destCityName, trackLength] = connection.split("");
    rrGraph.addTrackToCity(sourceCityName, destCityName, parseInt(trackLength));
  });

  /*
    Checks to see if the path sent to a function is an existing path.
    The railroad graph throws a flag ("-1") when it can't find a 
    path that matches the path in the input
  */

  let checkIsValid = (res: number) => (res === -1 ? "NO SUCH PATH" : res);

  console.log(
    "Path length along ABC is " +
      checkIsValid(rrGraph.getPathLength("ABC".split("")))
  );
  console.log(
    "Path length along AD is " +
      checkIsValid(rrGraph.getPathLength("AD".split("")))
  );
  console.log(
    "Path length along ADC is " +
      checkIsValid(rrGraph.getPathLength("ADC".split("")))
  );
  console.log(
    "Path length along AEBCD is " +
      checkIsValid(rrGraph.getPathLength("AEBCD".split("")))
  );
  console.log(
    "Path length along AED is " +
      checkIsValid(rrGraph.getPathLength("AED".split("")))
  );
  console.log(
    "Number paths from C to C <= 3 stops is " +
      checkIsValid(rrGraph.getNumTripsLimitByStops("C", "C", 0, 3))
  );
  console.log(
    "Number paths from A to C == 4 stops is " +
      checkIsValid(rrGraph.getNumTripsLimitByStops("A", "C", 4, 4))
  );
  console.log(
    "shortest distnce from A to C is " +
      checkIsValid(rrGraph.getShortestPath("A", "C"))
  );
  console.log(
    "shortest distance from B to B is " +
      checkIsValid(rrGraph.getShortestPath("B", "B"))
  );
  console.log(
    "Number paths from C to C distance < 30 is " +
      checkIsValid(rrGraph.getNumTripsLimitByDistance("C", "C", 0, 29))
  );
};

begin();
