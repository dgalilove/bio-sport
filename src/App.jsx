import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PersonalInfo from "./components/PersonalInfo";
import Main from "./components/Main";

export default function App() {
  return (
    <>
      {/* ✅ Navbar always visible */}
      <Navbar />

      {/* ✅ Content area below navbar */}
      <main className="pt-[100px]">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/info" element={<PersonalInfo />} />
          <Route path="/main" element={<Main />} />
        </Routes>
      </main>
    </>
  );
}
