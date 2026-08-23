import{Navigate} from "react-router-dom";
import {useState,useEffect} from "react";
import {supabase} from "../supabaseClient";
function ProtectedRoute({children}){
    const [loading,setLoading]=useState(true);
    const [user,setUser]=useState(null);
    useEffect(()=>{
        const checkUser=async()=>{
            const {
                data:{user},
            }=await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        checkUser();
            },[]);
            if (loading){
                return <div>Loading...</div>;
            } 
            if(!user){
                return <Navigate to="/login" replace />;
            }
            return children;
    }
    export default ProtectedRoute;