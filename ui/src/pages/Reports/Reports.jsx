import React, { useEffect, useState } from 'react';
import Table from '@components/Table/Table';
import { Helmet } from 'react-helmet';
import axiosWrapper from '../../utils/api';
import '../Listing/Listing.scss';
import { formatDate } from '../../utils/common';

const Reports = () => {
    const [posData, setPosData] = useState(null);
    const [loading, setLoading] = useState(false);

    const currentDate = new Date();
    const firstDateOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 2);

    const formattedFirstDate = firstDateOfMonth.toISOString().split('T')[0];
    const formattedtodayDate = currentDate.toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(formattedFirstDate);
    const [endDate, setEndDate] = useState(formattedtodayDate);

    const fetchData = async (startDate, endDate) => {
        try {
            setLoading(true);
            if (startDate || endDate) {
                const data = await axiosWrapper('get', `${import.meta.env.VITE_API_BASE_URL}/reports?startDate=${startDate}&endDate=${endDate}`);

                const updatedData = data.map((obj) => {
                    if (obj.date) {
                        const dateFormate = formatDate(obj.date);
                        return { ...obj, date: dateFormate };
                    }
                    return obj;
                });

                setPosData(updatedData?.reverse());
            } else {
                const data = await axiosWrapper('get', `${import.meta.env.VITE_API_BASE_URL}/reports`);
                const updatedData = data.map((obj) => {
                    if (obj.date) {
                        const dateFormate = formatDate(obj.date);
                        return { ...obj, date: dateFormate };
                    }
                    return obj;
                });
                setPosData(updatedData?.reverse());
            }
        } catch (error) {
            return;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const startDateCheck = new Date(startDate);
        if (startDateCheck.getTime() !== currentDate.getTime()) {
            fetchData(startDate, endDate);
        } else fetchData();
    }, [startDate, endDate]);

    const columns = [
        { headerName: 'ID', field: 'ropstamId', sortable: true, unSortIcon: true, maxWidth: 80 },
        {
            headerName: 'Name',
            field: 'name',
            filter: 'agSetColumnFilter',
            sortable: true,
            maxWidth: 200,
            unSortIcon: true
        },

        {
            headerName: 'Department',
            field: 'department',
            maxWidth: 180,
            filter: 'agSetColumnFilter'
        },

        {
            headerName: 'Total',
            field: 'totalPurchasePrice',
            maxWidth: 180,
            filter: 'agSetColumnFilter'
        },
        {
            headerName: 'Date',
            field: 'date',
            maxWidth: 180,
            filter: 'agSetColumnFilter',
            cellRenderer: (params) => formatDate(params.value)
        }
    ];

    return (
        <div className="listing-page">
            <React.Fragment>
                <Helmet>
                    <title>Dashboard | Reports</title>
                </Helmet>

                <h3>Reports</h3>

                <Table
                    columns={columns}
                    tableData={posData}
                    setPosData={setPosData}
                    onRowClicked={''}
                    createEntry={''}
                    showCreatebtn={false}
                    showExportbtn={true}
                    loading={loading}
                    reports={true}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    endDate={endDate}
                    startDate={startDate}
                />
            </React.Fragment>
        </div>
    );
};

export default Reports;
