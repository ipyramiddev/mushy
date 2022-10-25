interface Theme {
    name: string,
    backgroundPrimary: string,
    backgroundSecondary: string,
    textPrimary: string,
    textSecondary: string,
    border: string,
    icons: string,
}

type ThemeCollection = { [key: string]: Theme };

export default<ThemeCollection> {
    'default': {
      name: "Digital Eyes",
      backgroundPrimary: "#000000",
      backgroundSecondary: "#1f1f1f",
      textPrimary: "#ffffff",
      textSecondary: "#838383",
      border: "#000000",
      icons: "#ffffff",
    },
    'light': {
      name: "Light",
      backgroundPrimary: "#fffff1",
      backgroundSecondary: "rgb(230, 230, 230)",
      textPrimary: "#000",
      textSecondary: "#333",
      border: "#fffff1",
      icons: "#ff8906",
    }
  };