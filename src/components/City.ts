import Track from "./Track";
export default class City {
  private name: string;
  private tracks: Map<string, Track>;

  constructor(name: string) {
    this.name = name;
    //mapped using destination city
    this.tracks = new Map<string, Track>();
  }

  getName = (): string => this.name;

  getTrackList = (): Array<Track> => {
    let list: Array<Track> = [];
    this.tracks.forEach((track, destCity) => {
      list.push(track);
    });
    return list;
  };

  getTrackByDestCityName = (destCityName: string): Track =>
    this.tracks.get(destCityName)! || null;

  addTrackToCity = (destCity: City, trackLength: number): void => {
    let destCityName = destCity.getName();
    if (destCityName === this.name) {
      throw Error("Track cannot route to origin");
    }
    if (this.tracks.has(destCityName)) {
      throw Error("A city cannot have multiple routes to a destination");
    }
    if (trackLength <= 0) {
      throw Error("A track length must be positive");
    }
    this.tracks.set(destCityName, new Track(this, destCity, trackLength));
  };

  getTrackCount = (): number => this.tracks.size;

  hasTrackTo = (destCity: string): boolean => this.tracks.has(destCity);
}
