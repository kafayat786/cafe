import React, { useEffect, useState } from 'react';
import { Form as FormikForm, Formik, ErrorMessage } from 'formik';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Input from '../../components/Input/Input';
import * as Yup from 'yup';
import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import deleteIcon from '@icons/delete.svg';
import moment from 'moment';
import axiosWrapper from '@utils/api';
import Loading from '@components/Loading/Loading';
import { toast } from 'react-toastify';
import { AutoComplete } from 'primereact/autocomplete';
import Label from '../../components/Input/Label';

const POSForm = ({ productModal, fetchData, resetModal }) => {
    const [loading, setLoading] = useState(false);
    const [purchaseCheck, setPurchaseCheck] = useState(false);
    const [selectEmployee, setselectEmployee] = useState('');
    const [filterEmployee, setfilterEmployee] = useState(null);
    const [employeesData, setEmplyees] = useState([]);
    const [productsData, setProducts] = useState([]);

    const [selectData, setSelectData] = useState(productModal.isEditable ? productsData.purchase?.map((val) => val) : []);
    const [initialValues, setInitialValues] = useState({
        posId: '',
        date: moment(productsData.date).format('YYYY-MM-DD') || moment(new Date()).format('YYYY-MM-DD'),
        price: productModal.isEditable ? productModal.rowData.price : ''
    });

    const validationSchema = Yup.object().shape({
        posId: Yup.number().required('posId is required'),
        price: Yup.number().typeError('Price must be a number').required('Price is required'),
        date: Yup.string().required('date is required')
    });

    const search = (event) => {
        // Timeout to emulate a network connection
        setTimeout(() => {
            let _filterEmployee;

            if (!event.query.trim().length) {
                _filterEmployee = [...countries];
            } else {
                _filterEmployee = employeesData.filter((country) => {
                    return country.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setfilterEmployee(_filterEmployee);
        }, 250);
    };

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const data = await axiosWrapper('get', `${import.meta.env.VITE_API_BASE_URL}/employees`);

            setEmplyees(data);
        } catch (error) {
            return;
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await axiosWrapper('get', `${import.meta.env.VITE_API_BASE_URL}/products`);
            const updatedData = data?.slice(0, 50)?.map((item) => {
                return { ...item, createdAt: new Date() };
            });
            setProducts(updatedData);
        } catch (error) {
            return;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setselectEmployee(productModal.rowData?.name);
        setInitialValues({
            posId: parseInt(productModal?.rowData.posId),
            date: moment(productModal.date).format('YYYY-MM-DD') || moment(new Date()).format('YYYY-MM-DD'),
            price: productModal.rowData.price || ''
        });
        setSelectData(productModal?.rowData?.purchase);

        console.log('scqqqqs');
    }, [productModal.rowData, productModal.isEditable, employeesData]);

    useEffect(() => {
        fetchEmployees();
        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectData?.length > 0) setPurchaseCheck(false);
        else setPurchaseCheck(false);
    }, [selectData]);

    useEffect(() => {
        setInitialValues({
            ...initialValues,
            posId: selectEmployee?.ropstamId || productModal?.rowData?.posId
        });
    }, [selectEmployee, productModal.isEditable]);

    useEffect(() => {
        setInitialValues({
            ...initialValues,
            price: selectData?.reduce((sum, item) => {
                const itemPrice = parseFloat(item.price);
                const itemQuantity = item?.quantity || 1; // Set a default quantity if needed

                if (!isNaN(itemPrice)) {
                    return sum + itemPrice * itemQuantity;
                } else {
                    return sum;
                }
            }, 0)
        });
    }, [selectData]);

    const handleSubmit = async (values, { setSubmitting }) => {
        const newValue = { ...values, purchase: selectData, name: selectEmployee?.name, employeeId: selectEmployee?._id };
        if (selectData?.length > 0 && selectEmployee !== '') {
            try {
                setSubmitting(true);
                const { method, endpoint } = getRequestMeta(productModal.isEditable);
                // submit request here
                await axiosWrapper(method, `${import.meta.env.VITE_API_BASE_URL}${endpoint}`, newValue);
                toast.success(productModal.isEditable ? 'Item updated successfully' : 'Item created successfully', { autoClose: 1000 });
            } catch (error) {
                setSubmitting(false);
            } finally {
                resetModal();
                fetchData();
            }
        } else {
            if (selectData?.length == 0) setPurchaseCheck(true);
            toast.info('Fill all fields', { autoClose: 1000 });
        }
    };

    function filterAndChangeQuantity(id, value) {
        const updatedArray = selectData?.map((obj) => {
            if (obj._id === id) {
                return { ...obj, quantity: value };
            }
            return obj;
        });
        setSelectData(updatedArray);
    }
    const removeProducts = (id) => {
        setSelectData(selectData?.filter((obj) => obj._id !== id));
    };
    const getRequestMeta = (isEditable) => {
        if (isEditable) {
            return { method: 'PUT', endpoint: `/pos/${productModal.rowData?._id}` };
        }
        return { method: 'POST', endpoint: '/pos' };
    };

    const statusBodyTemplate = (product) => {
        return (
            <>
                <InputNumber
                    value={product?.quantity}
                    min={1}
                    style={{ maxWidth: '80px' }}
                    onValueChange={(e) => {
                        filterAndChangeQuantity(product?._id, e.target.value);
                    }}
                    showButtons
                />
            </>
        );
    };
    const removeTemplate = (product) => {
        return (
            <button className="btn-light action-button delete-button pos-delete">
                <img src={deleteIcon} className="action-icon" alt="action-icon" onClick={() => removeProducts(product?._id)} />
            </button>
        );
    };
    return (
        <Container>
            {loading ? (
                <Loading />
            ) : (
                <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ isSubmitting, values }) => (
                        <FormikForm>
                            <Row className="entryForm">
                                <Col sm={12} md={6}>
                                    <Input name="posId" placeholder="0" label="Employee ID" type="number" min="0" />
                                </Col>
                                <Col sm={12} md={6} className="auto-field">
                                    <Label label="Employee name" />

                                    <AutoComplete
                                        field="name"
                                        value={selectEmployee}
                                        suggestions={filterEmployee}
                                        completeMethod={search}
                                        onChange={(e) => {
                                            setInitialValues({
                                                ...initialValues,
                                                posId: selectEmployee?.ropstamId
                                            });
                                            setselectEmployee(e.value);
                                        }}
                                    />
                                </Col>
                                <Col sm={12} md={6}>
                                    <Input name="price" placeholder="100" label="price" type="number" />
                                </Col>
                                <Col sm={12} md={6}>
                                    <Input name="date" placeholder="date" label="date" type="date" />
                                </Col>
                                <Col sm={12} className="my-1">
                                    <Label label="Purchase" />
                                    <div className="card flex justify-content-center position-relative">
                                        <MultiSelect
                                            value={selectData}
                                            onChange={(e) => {
                                                const isIdPresent = selectData?.some((obj) => obj?._id === e.selectedOption?._id);
                                                if (isIdPresent) {
                                                    setSelectData(selectData?.filter((obj) => obj?._id !== e.selectedOption?._id));
                                                } else {
                                                    setSelectData(e.value);
                                                }
                                            }}
                                            options={productsData}
                                            optionLabel="name"
                                            id="item"
                                            name="item"
                                            filter
                                            placeholder="Select Product"
                                            maxSelectedLabels={10}
                                            className="w-full md:w-20rem"
                                        />
                                    </div>
                                    {purchaseCheck && (
                                        <p component="span" className="validation-error formproduct">
                                            Products required
                                        </p>
                                    )}
                                </Col>
                            </Row>
                            {selectData?.length && !productModal.isEditable ? (
                                <DataTable value={selectData} className="pos-table">
                                    <Column field="name" header="Name"></Column>
                                    <Column field="price" header="Price"></Column>
                                    <Column field="quantity" header="Quantity" body={statusBodyTemplate}></Column>
                                    <Column header="Actions" body={removeTemplate}></Column>
                                </DataTable>
                            ) : (
                                ''
                            )}
                            <Button className="my-3 d-block ms-auto" type="submit" disabled={isSubmitting}>
                                {isSubmitting && selectData?.length > 0 ? <Loading centered size="sm" /> : productModal.isEditable ? 'Update' : 'Create'}
                            </Button>
                        </FormikForm>
                    )}
                </Formik>
            )}
        </Container>
    );
};

export default POSForm;
