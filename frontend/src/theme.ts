import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#17635b",
    },
    secondary: {
      main: "#226a63",
    },
    background: {
      default: "#d7d6dd",
      paper: "#d7d6dd",
    },
    text: {
      primary: "#2e3d35",
    },
  },
  shape: {
    borderRadius: 28,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          border: "2px solid #222",
          boxShadow: "0px 1px 4px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            backgroundColor: "#d7d6dd",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "0.7rem 2.5rem",
          fontSize: "1.1rem",
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
