import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import theme from "../theme";
import TabTasks from "../tabs/TabTasks";

// Mock fetch globally
const mockTasks = [
  { task_id: 1, task_name: "Overdue Task", due_date: "2023-01-01", status: "todo" },
  { task_id: 2, task_name: "Today Task", due_date: new Date().toISOString(), status: "in_progress" },
  { task_id: 3, task_name: "Suggested Urgent", status: "todo", urgency_score: 10 },
  { task_id: 4, task_name: "Suggested Low", status: "todo", urgency_score: 2 },
];

beforeAll(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockTasks),
    }) as any
  );
});

describe("TabTasks", () => {
  it("renders task groups without crashing", async () => {
    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TabTasks />
        </LocalizationProvider>
      </ThemeProvider>
    );

    // Wait for tasks to load and check group heading
    await waitFor(() => expect(screen.getByRole("heading", { name: "Today" })).toBeInTheDocument());

    // Check that suggested tasks appear
    expect(screen.getByText("Suggested Urgent")).toBeInTheDocument();
    expect(screen.getByText("Suggested Low")).toBeInTheDocument();
  });
});