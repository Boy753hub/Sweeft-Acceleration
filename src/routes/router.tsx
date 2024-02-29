import { Outlet, RouteObject } from "react-router-dom";
import Header from "../components/Header";
import MainPage from "../pages/MainPage";
import HistoryPage from "../pages/HistoryPage";

export const router: RouteObject[] = [
    {
        element: (
            <div>
                <Header />
                <Outlet />
            </div>
        ),
        path: '/',
        children: [
            {
                element: <MainPage/>,
                index: true
            },
            {
                element: <HistoryPage/>,
                path: 'history'
            }
        ]
    }
]