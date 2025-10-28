import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Header } from './Header';
import { Home } from './Home';
import { SearchRecipe } from './Create';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Header />}>
        <Route index element={<Home />} />
        <Route path="/create" element={<SearchRecipe />} />
      </Route>
    </Routes>
  );
}
