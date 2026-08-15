import { Routes, Route } from "react-router-dom";
import { AuthenticationLayout, GuestLayout } from "./pages/Layout.jsx";
import AuthenticationPage from "./pages/AuthenticationPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import BuilderPage from "./pages/BuilderPage.jsx";
import PreviewPage from "./pages/PreviewPage.jsx";

const App = () => {
  
    return (
        <Routes>

            { /* Authentications Pages Routes */ }
            <Route element = { <GuestLayout /> } >
                <Route path = 'register' element = { <AuthenticationPage mode = "register" />} />
                <Route path = 'login' element = { <AuthenticationPage mode = "login" />} />
            </Route>    

            { /* Protected Routes For Main Important Pages Like Home, Builder, Preview Pages */ }
            <Route element = { <AuthenticationLayout /> } >
                <Route path = '/' element = { <HomePage />} />
                <Route path = '/builder/:id' element = { <BuilderPage />} />
                <Route path = '/preview/:id' element = { <PreviewPage />} />
            </Route>    
        </Routes>
    );
};

export default App;
