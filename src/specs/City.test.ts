import City from "../components/City";

var testCity = new City("tCity");

describe("Test state of city object before and in response to track insertion attempts", () => {
  test("New city object must have 0 tracks", () => {
    expect(getTrackCount().toBe(0));
  });

  test("City has one track after first track insertion attempt", () => {
    let destinationCityName = "firstDest";
    let trackLength = 5;
    addTrackToCity(destinationCityName, trackLength);
    expect(getTrackCount().toBe(1));
  });

  test("Disallow multiple tracks from one city to another", () => {
    let destinationCityName = "firstDest";
    let trackLength = 6;
    expect(() => {
      addTrackToCity(destinationCityName, trackLength);
    }).toThrow();
  });

  test("Reject track insertion due to origin matching destination", () => {
    let destName = "tCity";
    let trackLength = 5;
    expect(() => {
      addTrackToCity(destName, trackLength);
    }).toThrow();
  });

  test("Reject track insertion due to non positive track length", () => {
    let destName = "weirdTrackCity";
    let trackLength = 0;
    expect(() => {
      addTrackToCity(destName, trackLength);
    }).toThrow();

    trackLength = -1;
    expect(() => {
      addTrackToCity(destName, trackLength);
    }).toThrow();
  });
});

const getTrackCount = () => {
  return testCity.getTrackCount();
};

const addTrackToCity = (destinationCityName: string, trackLength: number) => {
  testCity.addTrack(destinationCityName, trackLength);
};
