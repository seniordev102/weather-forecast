import React from "react";
import { LocationProvider } from "./utils/context";
import LandingPage from "./pages/LandingPage";

const App = () => {
  return (
    <LocationProvider>
      <LandingPage />
    </LocationProvider>
  );
};

export default App;
