import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '@layout/DashboardLayout/DashboardLayout';
import PublicLayout from '@layout/PublicLayout/PublicLayout';

const Home = lazy(() => import('@pages/Home/Home'));
const Employees = lazy(() => import('@pages/Employees/Employees'));
const Products = lazy(() => import('@pages/Products/Products'));
const Ledger = lazy(() => import('@pages/Ledger/Ledger'));
const Reports = lazy(() => import('@pages/Reports/Reports'));
const Login = lazy(() => import('@pages/Auth/Login'));
const SignUp = lazy(() => import('@pages/Auth/SignUp'));
const Listing = lazy(() => import('@pages/Listing/Listing'));
const ListingDetails = lazy(() => import('@pages/ListingDetails/ListingDetails'));
const NotFound = lazy(() => import('@pages/NotFound/NotFound'));

const MainRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<PublicLayout />}>
                <Route path="login" exact element={<Login />} />
                <Route path="signup" exact element={<SignUp />} />
            </Route>
            {/* protected layout */}
            <Route path="/" element={<DashboardLayout />}>
                <Route index exact element={<Home />} />
                <Route path="pos" exact element={<Listing />} />
                <Route path="employees" exact element={<Employees />} />
                <Route path="products" exact element={<Products />} />
                <Route path="ledgers" exact element={<Ledger />} />
                <Route path="reports" exact element={<Reports />} />
                <Route path="product/:id" exact element={<ListingDetails />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default MainRoutes;
