import { Routes, Route } from "react-router-dom";
import Principal from "./pages/principal";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Principal />} />
    </Routes>
  );
}