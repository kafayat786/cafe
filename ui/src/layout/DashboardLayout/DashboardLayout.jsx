import React, { Suspense } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar, MainPanel } from '@components/Dashboard';
import { Container } from 'react-bootstrap';
import Loading from '../../components/Loading/Loading';
import { useSelector } from 'react-redux';
const DashboardLayout = () => {
    const { isLoggedIn } = useSelector((state) => state?.auth);
    const navigate = useNavigate();
    if (!isLoggedIn) navigate('/login');

    return (
        <Container fluid className="p-0">
            {/* Collapsible Sidebar */}
            {/* Main Content */}
            <Sidebar />
            <MainPanel>
                <Outlet />
            </MainPanel>
        </Container>
    );
};

export default DashboardLayout;
