import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4F46E5", // Indigo
    },
    secondary: {
      main: "#06B6D4", // Teal
    },
    background: {
      default: "#F9FAFC", // Light background
      paper: "#FFFFFF",
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h6: { fontWeight: 700 },
    body1: { fontSize: "0.95rem" },
  },
});

export default theme;