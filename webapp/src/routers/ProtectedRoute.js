import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedRoute = ({children, redirectTo= "/login"}) => {
    const token = localStorage.getItem('token');
    if(token == null || token == undefined){
        return <Navigate to={redirectTo}/>
    }
    return children ? children : <Outlet />
}