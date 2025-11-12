import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Header } from './Header';
import { Home } from './Home';
import { SearchRecipe } from './Create';
import { AuthPage } from './AuthPage';
import { UserProvider } from './UserContext';
import { SingleRecipe } from './SingleRecipe';
import { FavoriteIngredients } from './FavoriteIngredients';

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path="/favorites" element={<FavoriteIngredients />} />
          <Route path="/create" element={<SearchRecipe />} />
          <Route path="/recipes/:idMeal" element={<SingleRecipe />} />
          <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
          <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}
