import React, { createContext } from "react";
import useStorage from "../utils/useStorage";
import { LocationCoords } from "./types";

type LocationContextType = {
  location: LocationCoords | null;
  setLocation: (location: LocationCoords) => void;
};

type Props = {
  children: React.ReactNode;
};

export const LocationContext = createContext<LocationContextType>({
  location: null,
  setLocation: () => {},
});

export const LocationProvider = (props: Props) => {
  const [location, setLocation] = useStorage("__location");

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {props.children}
    </LocationContext.Provider>
  );
};
