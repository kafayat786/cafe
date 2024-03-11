import React, { useEffect, useState } from 'react';
import { Row, Col, Tooltip } from 'react-bootstrap';
import Card from '@components/Card/Card';
import Table from '@components/Table/Table';
import editIcon from '@icons/edit.svg';
import deleteIcon from '@icons/delete.svg';
import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import { Helmet } from 'react-helmet';
import axiosWrapper, { getLoggedUser } from '../../utils/api';
import '../Listing/Listing.scss';
import { Dialog } from 'primereact/dialog';
import EmployeesForm from './EmployeesForm';

const Employees = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [employeesData, setEmplyees] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [loadingCRUD, setLoadingCRUD] = useState(false);

    const [productModal, setProductModal] = useState({
        show: false,
        title: '',
        isEditable: false,
        rowData: ''
    });

    const handleRowClick = (event) => {};
    const resetProductModal = () => {
        setProductModal({
            show: false,
            title: '',
            isEditable: false,
            rowData: ''
        });
    };

    const handleCreateClick = () => {
        // Handle create button click event here
        setProductModal({
            show: true,
            title: 'Add Employee',
            isEditable: false,
            rowData: ''
        });
    };

    const handleEditClick = (productId) => {
        //Handle edit action here
        setProductModal({
            show: true,
            title: 'Edit Employee',
            isEditable: true,
            rowData: productId
        });
    };

    const handleDeleteClick = (id) => {
        // Handle delete action here
        setSelectedRowId(id);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await axiosWrapper('get', `${import.meta.env.VITE_API_BASE_URL}/employees`);
            const updatedData = data?.slice(0, 50)?.map((item) => {
                return { ...item, createdAt: new Date() };
            });
            setEmplyees(updatedData);
        } catch (error) {
            return;
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSubmit = async () => {
        try {
            setLoadingCRUD(true);
            const data = await axiosWrapper('delete', `${import.meta.env.VITE_API_BASE_URL}/employees/${selectedRowId?._id}`);
        } catch (error) {
            return;
        } finally {
            setLoadingCRUD(false);
            setShowDeleteModal(false);
            setEmplyees(employeesData?.filter((item) => item._id !== selectedRowId?._id));
        }
    };

    useEffect(() => {
        // Fetch data from API here
        fetchData();
    }, []);

    const ActionsRenderer = (props) => (
        <React.Fragment>
            <Row style={{ width: '100%' }}>
                <Col lg={6} md={6} sm={6} className="d-flex justify-content-center align-items-center">
                    <button className="action-button edit-button" onClick={() => props.onEditClick(props.data)}>
                        <img src={editIcon} className="action-icon" alt="action-icon" />
                    </button>
                </Col>
                <Col lg={6} md={6} sm={6} className="d-flex justify-content-center align-items-center">
                    <button className="btn-light action-button delete-button" onClick={() => props.onDeleteClick(props.data)}>
                        <img src={deleteIcon} className="action-icon" alt="action-icon" />
                    </button>
                </Col>
            </Row>
        </React.Fragment>
    );

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
            headerName: 'Actions',
            cellRenderer: ActionsRenderer,
            cellRendererParams: {
                onEditClick: handleEditClick,
                onDeleteClick: handleDeleteClick
            },
            pinned: 'right',
            maxWidth: 150,
            sortable: false,
            filter: false,
            cellClass: ['d-flex', 'align-items-center']
        }
    ];

    const handleCloseModal = () => {
        resetProductModal();
    };

    return (
        <div className="listing-page">
            <React.Fragment>
                <Helmet>
                    <title>Dashboard | Employees</title>
                </Helmet>
                {productModal.show && (
                    <Dialog header={productModal?.isEditable ? 'Update Employee' : 'Add Employee'} visible={productModal} style={{ width: '50vw' }} onHide={handleCloseModal}>
                        <EmployeesForm fetchData={fetchData} productModal={productModal} resetModal={resetProductModal} />
                    </Dialog>
                )}
                {showDeleteModal && (
                    <ConfirmationBox
                        show={showDeleteModal}
                        onClose={handleCloseDeleteModal}
                        loading={loadingCRUD}
                        title="Delete Entry"
                        body="Are you sure you want to delete this entry?"
                        onConfirm={handleDeleteSubmit}
                    />
                )}

                <h3>Employees</h3>

                <Table columns={columns} tableData={employeesData} onRowClicked={handleRowClick} createEntry={handleCreateClick} showCreatebtn={true} showExportbtn={false} loading={loading} />
            </React.Fragment>
        </div>
    );
};

export default Employees;
