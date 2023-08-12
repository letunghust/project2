import { Route, Routes } from "react-router";
import { publicRoutes } from "../routes/index";
import { Fragment } from "react";

export const AppRoutes = () => {
    return (
        <Routes>
            {publicRoutes.map((route, index) => {
                const path = route.path;
                const Page = route.component;
                const Layout = route.layout === null ? Fragment : route.layout;
                return (
                    <Route
                        key={index}
                        path={path}
                        element={
                            <Layout>
                                <Page />
                            </Layout>
                        }
                    />
                );
            })}
        </Routes>
    );
};
