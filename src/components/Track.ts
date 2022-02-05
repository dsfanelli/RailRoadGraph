import City from "./City";
export default class Track {
  private sourceCity: City;
  private destCity: City;
  private length: number;

  /*
    City objects are private and read only by design 
    as to prevent non RailRoadGraph, City objects from 
    modifying them. They are still used as instance fields
    to accurately reflect changes made to them by the RailRoadGraph
    or themselves. The source city is the city where the track
    begins and the destination city is the city where the track
    ends, and the source city is included for context as to where
    the track is coming from.
  */
  constructor(sourceCity: City, destCity: City, length: number) {
    this.sourceCity = sourceCity;
    this.destCity = destCity;
    this.length = length;
  }

  getSourceCityName = (): string => this.sourceCity.getName();

  getDestCityName = (): string => this.destCity.getName();

  getLength = (): number => this.length;
}
