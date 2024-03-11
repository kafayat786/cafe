import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Table from '@components/Table/Table';
import { Tooltip } from 'primereact/tooltip';
import editIcon from '@icons/edit.svg';
import deleteIcon from '@icons/delete.svg';

import ConfirmationBox from '@components/ConfirmationBox/ConfirmationBox';
import { Helmet } from 'react-helmet';
// import stat images
import { useLocation, useNavigate } from 'react-router-dom';
import axiosWrapper, { getLoggedUser } from '../../utils/api';
import '../Listing/Listing.scss';
import { formatDate } from '../../utils/common';
import POSForm from './POSForm';
import { Dialog } from 'primereact/dialog';
import { useSelector } from 'react-redux';

const Home = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const userProfile = getLoggedUser();
    const [posData, setPosData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [loadingCRUD, setLoadingCRUD] = useState(false);
    const { isLoggedIn } = useSelector((state) => state?.auth);

    const [productModal, setProductModal] = useState({
        show: false,
        title: '',
        isEditable: false,
        rowData: ''
    });

    const handleRowClick = () => {};
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
            title: 'Create POS',
            isEditable: false,
            rowData: ''
        });
    };

    const handleEditClick = (productId) => {
        //Handle edit action here
        setProductModal({
            show: true,
            title: 'Edit POS',
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
            const data = await axiosWrapper('get', `${import.meta.env.VITE_API_BASE_URL}/pos`);
            const updatedData = data?.slice(0, 50)?.map((item) => {
                return { ...item, createdAt: new Date() };
            });
            setPosData(updatedData?.reverse());
        } catch (error) {
            return;
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSubmit = async () => {
        try {
            setLoadingCRUD(true);
            await axiosWrapper('delete', `${import.meta.env.VITE_API_BASE_URL}/pos/${selectedRowId?._id}`);
        } catch (error) {
            return;
        } finally {
            setLoadingCRUD(false);
            setShowDeleteModal(false);
            fetchData();
        }
    };

    useEffect(() => {
        // Fetch data from API here
        if (isLoggedIn) fetchData();
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
    const PurchaseBlock = (props) => (
        <React.Fragment>
            <>
                {props?.data?.purchase?.map((val, index) => (
                    <p>
                        {val?.name}
                        {index !== props?.data?.purchase.length - 1 && ' / '}
                    </p>
                ))}
            </>
            <Tooltip target=".custom-target-icon" />
        </React.Fragment>
    );

    const columns = [
        { headerName: 'ID', field: 'posId', sortable: true, unSortIcon: true, maxWidth: 80 },
        {
            headerName: 'Name',
            field: 'name',
            filter: 'agSetColumnFilter',
            sortable: true,
            maxWidth: 150,
            unSortIcon: true
        },

        {
            headerName: 'Purchase',
            cellRenderer: PurchaseBlock,

            maxWidth: 180,
            sortable: false,
            filter: false,
            width: 220,
            cellClass: ['d-flex', 'align-items-center']
        },
        {
            headerName: 'Price',
            field: 'price',
            maxWidth: 100,
            filter: 'agSetColumnFilter'
        },
        {
            headerName: 'Created at',
            field: 'createdAt',
            maxWidth: 150,
            filter: 'agSetColumnFilter',
            sortable: true,
            unSortIcon: true,
            cellRenderer: (params) => formatDate(params.value)
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
                    <title>Dashboard | Template</title>
                </Helmet>
                {productModal.show && (
                    <Dialog header={productModal?.isEditable ? productModal.title : 'Add POS'} visible={productModal.show} style={{ width: '50vw' }} onHide={handleCloseModal}>
                        <POSForm setPosData={setPosData} fetchData={fetchData} productModal={productModal} resetModal={resetProductModal} />
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

                <h3>POS</h3>

                <Table columns={columns} tableData={posData} onRowClicked={handleRowClick} createEntry={handleCreateClick} showCreatebtn={true} showExportbtn={false} loading={loading} />
            </React.Fragment>
        </div>
    );
};

export default Home;
