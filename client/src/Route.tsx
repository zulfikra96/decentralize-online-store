import {
    createBrowserRouter,
} from "react-router-dom";
import Index from "./pages";
import Register from "./pages/register";
// import AuthGuard from "./AuthGuard";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Index/>,
    },
    {
        path:"/register",
        element:<Register/>
    }
]);
export default router;