import { NavigationItem } from "./NavigationItem";
import { ThemeColors } from "./ThemeColors";
import { ThemeFonts } from "./ThemeFonts";

export type ThemeConfig = {
  styles: {
    colors?: ThemeColors;
    fonts?: ThemeFonts;
    logoHeight?: string;
  };
  strings: {
    currentBid?: string;
    auctionEndsIn?: string;
    placeBid?: string;
    highestBidder?: string;
    connectWallet?: string;
    wrongNetwork?: string;
  };
  brand: {
    logo?: string | null;
    title?: string | null;
  };
  nav: {
    primary: NavigationItem[];
    secondary: NavigationItem[];
  };
};
