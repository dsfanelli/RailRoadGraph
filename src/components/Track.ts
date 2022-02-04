import City from "./City";
export default class Track {
  private sourceCity: City;
  private destCity: City;
  private length: number;

  constructor(sourceCity: City, destCity: City, length: number) {
    this.sourceCity = sourceCity;
    this.destCity = destCity;
    this.length = length;
  }

  getSourceCity = (): City => this.sourceCity;

  getDestCity = (): City => this.destCity;

  getLength = (): number => this.length;
}
