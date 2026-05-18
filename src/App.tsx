import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Routes>
        <Route path="/" element={<h1 className="text-center text-3xl font-bold text-primary p-8">UniMentor</h1>} />
      </Routes>
    </div>
  );
}

export default App;
