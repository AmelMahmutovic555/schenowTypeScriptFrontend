import React from "react";
import logo from "./logo.svg";
import "./App.css";

import Habits from "./components/Habits";
import Navbar from "./components/Navbar";
import AvailableDate from "./components/availableDate/AvailableDate";
import ScheduleDate from "./components/scheduleDate/ScheduleDate";
import { Outlet, Route, Routes } from "react-router-dom";
function AppLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
function App() {
  return (
    <>
      <AppLayout />
      <Routes>
        <Route path="/" element={<Habits />} />
        <Route path="/availableDate" element={<AvailableDate />} />
        <Route path="/book" element={<ScheduleDate />} />
      </Routes>
    </>
  );
}

export default App;
