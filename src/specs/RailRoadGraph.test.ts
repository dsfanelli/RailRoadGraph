import RailRoadGraph from "../components/RailRoadGraph";
import City from "../components/City";

var rrTestGraph = new RailRoadGraph();
//flag for attempting to traverse paths that don't exist
const badPathFlag = -1;

describe("Test state of RailRoad graph before and in response to city insertion attempts", () => {
  test("Graph has no cities", () => {
    expect(getCityCount().toBe(0));
  });

  test("Graph has one more city after insertion", () => {
    let cityCountBeforeInsert = getCityCount();
    addCityToGraph("firstCity");
    expect(getCityCount().toBe(cityCountBeforeInsert + 1));
  });

  test("Disallow duplicate city insertion", () => {
    expect(() => {
      addCityToGraph("firstCity");
    }).toThrow();
  });
});

describe("Test state of graph's city nodes after track insertion attempts", () => {
  addCityToGraph("trackInsertionTestCity");
  test("Reject track insertion due to non existing destination city", () => {
    let fakeDestCityName = "8888";
    let originCityName = "trackInsertionTestCity";
    let trackLength = 5;
    expect(() => {
      addTrackToCity(originCityName, fakeDestCityName, trackLength);
    }).toThrow();
  });

  test("Reject track insertion due to non existing origin city", () => {
    let fakeOriginName = "8888";
    let destName = "trackInsertionTestCity";
    let trackLength = 5;
    expect(() => {
      addTrackToCity(fakeOriginName, destName, trackLength);
    }).toThrow();
  });
});

describe("Test path length function", () => {
  ["A", "B"].forEach((cityName) => {
    addCityToGraph(cityName);
  });

  test("Flag for nonexistant path", () => {
    let res = getPathLength(["A", "B"]);
    expect(res.toBe(badPathFlag));
  });

  test("Path length of city A without a track must be 0", () => {
    let pathLength = getPathLength(["A"]);
    expect(pathLength.toBe(0));
  });

  // A is origin, B is destination, 5 is length
  addTrackToCity("A", "B", 5);
  test("After adding track from city A to city B, path length from A to B is 5", () => {
    let pathLength = getPathLength(["A", "B"]);
    expect(pathLength.toBe(5));
  });
});

describe("Test shortest path function", () => {
  ["spCity1", "spCity2", "spCity3"].forEach((cityName) => {
    addCityToGraph(cityName);
  });
  addTrackToCity("spCity1", "spCity2", 1000);
  addTrackToCity("spCity2", "spCity3", 10);
  addTrackToCity("spCity2", "spCity1", 10);
  addTrackToCity("spCity1", "spCity3", 10);
  test("Find shortest path between spCity1 and spCity2", () => {
    expect(getShortestPath(["spCity1", "spCity3"]).toBe(10));
  });

  test("Flag nonexistant path between spCity3 and spCity1", () => {
    expect(getShortestPath(["spCity3", "spCity1"]).toBe(badPathFlag));
  });
});

describe("Test number of trips function", () => {
  ["t1", "t2", "t3", "t4"].forEach((cityName) => {
    addCityToGraph(cityName);
  });

  addTrackToCity("t1", "t2", 5);
  addTrackToCity("t2", "t3", 5);
  addTrackToCity("t3", "t2", 5);
  addTrackToCity("t3", "t1", 5);

  test("Number of trips from t1 to t1 where distance <= 15", () => {
    expect(getNumTripsUpToDistance(["t1", "t1"], 15).toBe(1));
  });

  test("Number of trips from t1 to t1 where numStops <= 4", () => {
    expect(getNumTripsUpToStops(["t1", "t1"], 4).toBe(2));
  });

  test("Flag nonexistant path between t2 and t1", () => {
    expect(getNumTripsUpToStops(["t2", "t1"], 1).toBe(badPathFlag));
  });
});

const getCityCount = () => {
  return rrTestGraph.getCityCount();
};

const addCityToGraph = (cityName: string) => {
  rrTestGraph.addCity(cityName);
};

const addTrackToCity = (
  originName: string,
  destinationName: string,
  trackLength: number
) => {
  rrTestGraph.addTrackToCity(originName, destinationName, trackLength);
};

const getPathLength = (cities: Array<City>) => {
  return rrTestGraph.getPathLength(cities);
};

const getShortestPath = (cities: Array<City>) => {
  return rrTestGraph.getShortestPath(cities);
};

const getNumTripsUpToDistance = (cities: Array<City>, limitValue: number) => {
  return rrTestGraph.getNumTripsUpToDistance(cities, limitValue);
};

const getNumTripsUpToStops = (cities: Array<City>, limitValue: number) => {
  return rrTestGraph.getNumTripsUpToStops(cities, limitValue);
};
