import {   Routes, Route,Navigate } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import AICareerAdvisor from "./pages/AICareerAdvisor.jsx";
import ResumBuilder from "./pages/ResumeBuilder.jsx"
import JobMatches from "./pages/JobMatches.jsx";
import LearningRoadmap from "./pages/LearningRoadmap.jsx";
import InterviewPrep from "./pages/InterviewPre.jsx";
import Settings from "./pages/Settings.jsx";

function App(){
    return(
        
        
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Navigate to ="/login" replace/>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                        } />
                        <Route path="/MyProfile" element={
                        <ProtectedRoute>
                            <MyProfile />
                        </ProtectedRoute>
                        } />
                        <Route path="/AICareerAdvisor" element={
                        <ProtectedRoute>
                            <AICareerAdvisor />
                        </ProtectedRoute>
                        } />
                        <Route path ="/resume-builder" element={
                            <ProtectedRoute>
                                <ResumBuilder/>
                            </ProtectedRoute>}
                         />
                         <Route path ="/job-matches" element={
                            <ProtectedRoute>
                                <JobMatches/>
                            </ProtectedRoute>}
                         />
                          <Route path ="/learning-roadmap" element={
                            <ProtectedRoute>
                                <LearningRoadmap/>
                            </ProtectedRoute>}
                         />
                         <Route path ="/Interview-pre" element={
                            <ProtectedRoute>
                                <InterviewPrep/>
                            </ProtectedRoute>}
                         />
                         <Route path ="/settings" element={
                            
                                <Settings/>
                            }
                         />
                </Routes>
    
        
    );
}
export default App;