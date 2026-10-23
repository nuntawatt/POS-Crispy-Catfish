import { Routes, Route } from 'react-router-dom';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<div className="p-8 text-center"><h1 className="text-3xl font-bold">POS Crispy Catfish</h1><p className="mt-4 text-gray-600">🚧 Under Construction</p></div>} />
    </Routes>
  );
}
