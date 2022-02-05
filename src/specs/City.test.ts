import City from "../components/City";

var testCity = new City("tCity");

const getTrackCount = () => {
  return testCity.getTrackCount();
};

const addTrackToCity = (destinationCity: City, trackLength: number) => {
  testCity.addTrackToCity(destinationCity, trackLength);
};
describe("Test state of city object before and in response to track insertion attempts", () => {
  test("New city object must have 0 tracks", () => {
    expect(getTrackCount()).toBe(0);
  });

  test("City has one track after first track insertion attempt", () => {
    let destinationCity = new City("firstDest");
    let trackLength = 5;
    addTrackToCity(destinationCity, trackLength);
    expect(getTrackCount()).toBe(1);
  });

  test("Disallow multiple tracks from one city to another", () => {
    let destinationCity = new City("firstDest");
    let trackLength = 6;
    expect(() => {
      addTrackToCity(destinationCity, trackLength);
    }).toThrow();
  });

  test("Reject track insertion due to origin matching destination", () => {
    let trackLength = 5;
    expect(() => {
      addTrackToCity(testCity, trackLength);
    }).toThrow();
  });

  test("Reject track insertion due to non positive track length", () => {
    let destinationCity = new City("weirdTrackCity");
    let trackLength = 0;
    expect(() => {
      addTrackToCity(destinationCity, trackLength);
    }).toThrow();

    trackLength = -1;
    expect(() => {
      addTrackToCity(destinationCity, trackLength);
    }).toThrow();
  });
});
