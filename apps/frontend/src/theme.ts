import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4A90E2", // calm blue
    },
    secondary: {
      main: "#50E3C2", // soft teal
    },
    background: {
      default: "#F9FAFB",
      paper: "#FFFFFF",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        },
      },
    },
  },
});

export default theme;