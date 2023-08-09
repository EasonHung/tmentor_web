import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/home/Home";
import ClassroomPage from "../pages/classroom/Classroom";


const router = createBrowserRouter([
    {path: '/', element: <HomePage/>},
    {path: '/classroom', element: <ClassroomPage/>}
])

export default router