import { Routes, Route, Link } from "react-router-dom"
import Layout from "../components/layout/Layout";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import SearchPage from "../pages/SearchPage";
import NotifPage from "../pages/NofitPage";
import MessagePage from "../pages/MessagePage";

import FixerDashPage from "../pages/FixerDashPage";
import IsVerifiedPage from "../pages/IsVerifiedPage";
import EmailSent from "../components/ui/EmailSent";

function AppRoutes() {
    return (
        <div>
            <Routes>
                
                <Route element={<Layout/> } >
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/home" element={<HomePage/> } />
                    <Route path="/profile" element={<ProfilePage/>} />
                    <Route path="/search" element={<SearchPage/>} />
                    <Route path="/notifications" element={<NotifPage/>} />
                    <Route path="/messages" element={<MessagePage/>} />
                    <Route path="/fixer-dashboard" element={<FixerDashPage/>} />
                    <Route path="/verify/:token" element={<IsVerifiedPage/>}/>
                    <Route path="email-sent" element={<EmailSent/>}/>
                </Route>

                <Route path="/login" element={<LoginPage/> } />
                <Route path="/register" element={<RegisterPage/>}/>
                

                {/*Ruta 404 */}
                {/* <Route path="*" element={<HomePage />} /> */}
            </Routes>
        </div>
        
    )
}

export default AppRoutes