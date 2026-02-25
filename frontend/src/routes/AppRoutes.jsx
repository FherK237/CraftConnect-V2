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
import FixerProfileEditor from "../pages/fixer/FixerProfileEditor";
import DashboardLayout from "../components/layout/DashboardLayout";
import FixerPublicProfile from "../pages/public/FixerPublicProfile";
import FixerList from "../pages/public/FixerList";
import Sidebar from "../components/layout/Sidebar";
import ProtectedRoute from "../components/ProtectedRoute";
import NotFound from "../pages/NotFound";

function AppRoutes() {
    return (
        <div>
            <Routes>
                <Route element={<Layout/> } >
                {/*RUTAS PUBLICAS */}
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/home" element={<HomePage/> } />
                    <Route path="/prof" element={<ProfilePage/>} />
                    <Route path="/notifications" element={<NotifPage/>} />
                    <Route path="/verify/:token" element={<IsVerifiedPage/>}/>
                    <Route path="email-sent" element={<EmailSent/>}/>
                    <Route path="/fixers/:id" element={<FixerPublicProfile/>}/>
                    <Route path="/search" element={<FixerList/>} />
                    
                    {/* Ruta 404  */}
                <Route path="*" element={<NotFound/>} />
                </Route>

                <Route element={<DashboardLayout/>}>
                    <Route element={<ProtectedRoute allowedRoles={['fixer']}/>} >
                        <Route path="/fixer-dashboard" element={<FixerDashPage/>} />
                    </Route>
                    <Route path="/profile" element={<FixerProfileEditor/>}/>
                    <Route path="/messages" element={<MessagePage/>} />
                    
                </Route>    
                
                <Route path="/login" element={<LoginPage/> } />
                <Route path="/register" element={<RegisterPage/>}/>
            </Routes>
        </div>
        
    )
}

export default AppRoutes