import Track from "./Track";
import City from "./City";

/*
  This is the main control object that works with the city objects
  to modify their data, compute travel related data such as distances
  and stops, and sets the rules for inclusion of cities as well as 
  tracks for those cities. Client objects can indirectly manipulate 
  data by calling its functions using strings and it will check to see
  if those requests are valid (i.e. are the clients attemtping to 
  add a duplicate city, are they attempting to add a track to a city
  that doesnt exist in the graph) and error throw if they aren't. Its
  data is private as to protect from outside clients manipulating it 
  directly (i.e. adding duplicate cities).
*/
export default class RailRoadGraph {
  //maps city name to City
  private cities: Map<string, City> = new Map<string, City>();

  private hasCity = (cityName: string): boolean => this.cities.has(cityName);

  private getCity = (cityName: string): City => this.cities.get(cityName)!;

  private getTracksByCityName = (cityName: string): Array<Track> =>
    this.getCity(cityName)!.getTrackList();

  private shortestPathHelper = (
    curCityName: string,
    targetCityName: string,
    visited: Map<string, boolean>
  ): number => {
    let tracks = this.getTracksByCityName(curCityName);
    let shortestDist = -1;
    visited.set(curCityName, true);
    tracks.forEach((track: Track) => {
      let destCityName = track.getDestCityName();
      let distanceToDestCity = track.getLength();
      let candidateDistance = -1;
      if (destCityName === targetCityName) {
        candidateDistance = distanceToDestCity;
      } else if (!visited.has(destCityName)) {
        let found = this.shortestPathHelper(
          destCityName,
          targetCityName,
          visited
        );
        candidateDistance = found > -1 ? distanceToDestCity + found : -1;
      }
      if (candidateDistance > -1) {
        shortestDist =
          shortestDist === -1
            ? candidateDistance
            : Math.min(candidateDistance, shortestDist);
      }
    });
    visited.delete(curCityName);
    return shortestDist;
  };
  /*
    Slow and inefficient, but simpler than faster options 
    like BFS. Can be changed when data grows large, but 
    lets KISS ('keep it simple, stupid')for now. Takes 
    and object to avoid blowing up the stack. 
  */
  private getNumTripsHelper = (numTripsParams: {
    curCityName: string;
    targetCityName: string;
    limitBy: string; //{"stops","distance"} limit searching by number of stops or distance
    min: number; //min distance or stops depending on value of limitBy
    max: number; //max distance or stops depending on value of limitBy
    travel: number; //current stop count or distance
    numTrips: number;
  }): void => {
    let {
      curCityName,
      targetCityName,
      limitBy,
      min,
      max,
      travel,
      numTrips
    } = numTripsParams;
    //console.log(numTripsParams);
    let tracks = this.getTracksByCityName(curCityName);
    tracks.forEach((track) => {
      let travelIfPathTaken =
        travel + (limitBy === "distance" ? track.getLength() : 1);
      if (travelIfPathTaken <= max) {
        numTripsParams.numTrips +=
          track.getDestCityName() === targetCityName && travelIfPathTaken >= min
            ? 1
            : 0;
        //console.log(travelIfPathTaken);
        numTripsParams.curCityName = track.getDestCityName();
        numTripsParams.travel = travelIfPathTaken;
        this.getNumTripsHelper(numTripsParams);
      }
    });
  };

  addCityToGraph = (cityName: string): void => {
    if (this.hasCity(cityName)) {
      throw Error("Duplicate cities not allowed");
    }
    this.cities.set(cityName, new City(cityName));
  };

  addTrackToCity = (
    sourceCityName: string,
    destCityName: string,
    trackLength: number
  ): void => {
    if (!this.hasCity(sourceCityName) || !this.hasCity(destCityName)) {
      throw Error("Source or destination city does not exist");
    } else {
      let sourceCity = this.getCity(sourceCityName);
      let destCity = this.getCity(destCityName);
      sourceCity.addTrackToCity(destCity, trackLength);
    }
  };

  getPathLength = (cityNames: Array<string>): number => {
    if (!this.hasCity(cityNames[0])) {
      return -1;
    }
    let pathLength = 0;
    let curCity = this.getCity(cityNames[0]);
    for (let x = 1; x < cityNames.length; x++) {
      let nextCityName = cityNames[x];
      if (!curCity.hasTrackTo(nextCityName)) {
        pathLength = -1;
        break;
      }
      let curTrackLength = curCity
        .getTrackByDestCityName(nextCityName)
        .getLength();
      pathLength += curTrackLength;
      curCity = this.getCity(nextCityName);
    }
    return pathLength;
  };

  getShortestPath = (startCityName: string, targetCityName: string): number => {
    let pathLength = -1;
    if (!this.hasCity(startCityName) || !this.hasCity(targetCityName)) {
      throw Error("Source or destination city does not exist");
    } else {
      pathLength = this.shortestPathHelper(
        startCityName,
        targetCityName,
        new Map<string, boolean>()
      );
    }
    return pathLength;
  };
  /* 
    These two functions call the main helper algorithm for
    computing the number of different paths and exist
    for an easier client experience (only a few parameters 
    need to be passed) and to reuse the main helper 
    function to avoid repeating the algorithm twice 
    bc its slow and prone to change
  */

  getNumTripsLimitByDistance = (
    startCityName: string,
    targetCityName: string,
    minDistance: number,
    maxDistance: number
  ): number => {
    var numTripsParams = {
      curCityName: startCityName,
      targetCityName,
      limitBy: "distance",
      min: minDistance,
      max: maxDistance,
      travel: 0,
      numTrips: 0
    };
    this.getNumTripsHelper(numTripsParams);
    return numTripsParams.numTrips;
  };

  getNumTripsLimitByStops = (
    startCityName: string,
    targetCityName: string,
    minDistance: number,
    maxDistance: number
  ): number => {
    var numTripsParams = {
      curCityName: startCityName,
      targetCityName,
      limitBy: "stops",
      min: minDistance,
      max: maxDistance,
      travel: 0,
      numTrips: 0
    };
    this.getNumTripsHelper(numTripsParams);
    return numTripsParams.numTrips;
  };

  getCityCount = (): number => this.cities.size;
}
