import { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth, Home } from '../routes';

const AppRouter = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
      <Routes>{isLoggedIn ? <Route path='/' element={<Home />} /> : <Route path='/' element={<Auth />} />}</Routes>
    </Router>
  );
};

export default AppRouter;
