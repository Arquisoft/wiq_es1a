import { extendTheme } from "@chakra-ui/react";

const lightTheme = {
  colors: {
    background: "white",
    text: "black",
  },
};

const darkTheme = {
  colors: {
    background: "black",
    text: "white",
  },
};

export const themes = {
  light: extendTheme(lightTheme),
  dark: extendTheme(darkTheme),
};
