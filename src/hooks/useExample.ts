import { useContext } from "react";
import { ExampleContext } from "../contexts/ExampleContext";

export const useExample = () => {
  return useContext(ExampleContext);
};
