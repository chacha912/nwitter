import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth, Home, Profile } from 'routes';
import { Navigation } from 'components';

const AppRouter = ({ isLoggedIn, userObj }) => {
  return (
    <Router>
      {isLoggedIn && <Navigation />}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path='/' element={<Home userObj={userObj} />} />
            <Route path='/profile' element={<Profile />} />
          </>
        ) : (
          <Route path='/' element={<Auth />} />
        )}
      </Routes>
    </Router>
  );
};

export default AppRouter;
