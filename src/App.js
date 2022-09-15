import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./styles/App.css"

import MainPage from "./components/pages/MainPage";
import ItemPage from "./components/pages/ItemPage";
import LoginPage from "./components/pages/LoginPage";

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/item' element={<ItemPage />} />
        <Route path='/item/:id' element={<ItemPage />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;