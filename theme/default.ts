import { ThemeConfig } from "types/ThemeConfig";
import { lightColors, darkColors } from "./colors";

const logoHeight = "50px";

export const lightTheme: ThemeConfig = {
  styles: { colors: lightColors, logoHeight },
  strings: {},
  brand: {logo: "https://gateway.pinata.cloud/ipfs/QmZRV77wAZw4FycJaYByhJ1AwNFX18ZCPBPcJnKMKuwrgr"},
  nav: {
    primary: [],
    secondary: [],
  },
};

export const darkTheme: ThemeConfig = {
  styles: { colors: darkColors, logoHeight },
  strings: {},
  brand: {},
  nav: {
    primary: [],
    secondary: [],
  },
};
