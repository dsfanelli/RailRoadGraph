import Track from "./Track";
import City from "./City";
export default class RailRoadGraph {
  //maps city name to City
  private cities: Map<string, City> = new Map<string, City>();

  private hasCity = (cityName: string): boolean => this.cities.has(cityName);

  private getCity = (cityName: string): City => {
    if (!this.cities.has(cityName)) {
      throw Error("City " + cityName + "does not exist");
    }
    return this.cities.get(cityName)!;
  };

  private shortestPathHelper = (
    curCity: City,
    targetCity: City,
    visited: Map<string, boolean>
  ): number => {
    if (curCity === targetCity) {
      return 0;
    }
    let curCityName = curCity.getName();
    let tracks = curCity.getTrackList();
    let shortestDist = -1;
    visited.set(curCityName, true);
    tracks.forEach((track: Track) => {
      let destCity = track.getDestCity();
      let distanceToDestCity = track.getLength();
      if (!visited.has(destCity.getName())) {
        let found = this.shortestPathHelper(destCity, targetCity, visited);
        if (found !== -1) {
          shortestDist =
            shortestDist === -1
              ? distanceToDestCity + found
              : Math.min(shortestDist, distanceToDestCity + found);
        }
      }
    });
    visited.delete(curCityName);
    return shortestDist;
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
    let source = null;
    let dest = null;
    try {
      source = this.getCity(sourceCityName);
      dest = this.getCity(destCityName);
    } catch (e) {
      console.error(e);
    }
    if (source && dest) {
      source.addTrackToCity(dest, trackLength);
    }
  };

  getPathLength = (cities: Array<City>): number => {
    if (cities.length === 1) {
      return 0;
    }
    let curCity = cities[0];
    let pathLength = 0;
    for (let x = 1; x < cities.length; x++) {
      let nextCity = cities[x];
      let nextCityName = nextCity.getName();
      if (!curCity.hasTrackTo(nextCityName)) {
        pathLength = -1;
        break;
      }
      let curTrackLength = curCity
        .getTrackByDestCityName(nextCityName)
        .getLength();
      pathLength += curTrackLength;
    }
    return pathLength;
  };

  getShortestPath = (startCityName: string, targetCityName: string): number => {
    let startCity = null;
    let targetCity = null;
    try {
      startCity = this.getCity(startCityName);
      targetCity = this.getCity(targetCityName);
    } catch (e) {
      console.error(e);
    }
    if (startCity && targetCity) {
      return this.shortestPathHelper(
        startCity,
        targetCity,
        new Map<string, boolean>()
      );
    }
  };
}
