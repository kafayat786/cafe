import React, { useEffect, useState } from 'react';
import { Form as FormikForm, Formik } from 'formik';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Input from '../../components/Input/Input';
import * as Yup from 'yup';
import { MultiSelect } from 'primereact/multiselect';
import axiosWrapper from '@utils/api';
import Loading from '@components/Loading/Loading';
import { toast } from 'react-toastify';
import Label from '../../components/Input/Label';

const LedgerForm = ({ productModal, resetModal }) => {
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedCities, setSelectedCities] = useState(null);

    const initialValues = {
        id: product.id || '',
        name: product.name || '',
        date: product.date || new Date(),
        price: product.price || '',
        purchase: product.purchase || ''
    };

    const validationSchema = Yup.object().shape({
        id: Yup.string().required('id is required'),
        name: Yup.string().required('Brief summary is required'),
        price: Yup.number().typeError('Price must be a number').required('Price is required'),
        date: Yup.string().required('date is required')
    });

    useEffect(() => {
        if (productModal.isEditable) {
            setProduct(productModal.rowData);
            // console.log(productModal.rowData);
        }
    }, [productModal.rowData, productModal.isEditable]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            setSubmitting(true);
            const { method, endpoint } = getRequestMeta(productModal.isEditable);
            // submit request here
            // const data = await axiosWrapper(method, endpoint, values);
            toast.success(productModal.isEditable ? 'Item updated successfully' : 'Item created successfully');
        } catch (error) {
            setSubmitting(false);
        } finally {
            resetModal();
        }
    };

    const getRequestMeta = (isEditable) => {
        if (isEditable) {
            return { method: 'PUT', endpoint: '/products/some-id' };
        }
        return { method: 'POST', endpoint: '/products' };
    };

    const purchaseOptions = [
        { name: 'lays#30', id: 'lays#30' },
        { name: 'lays#50', id: 'lays#50' },
        { name: 'lays#100', id: 'lays#100' }
    ];

    return (
        <Container>
            {loading ? (
                <Loading />
            ) : (
                <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ isSubmitting }) => (
                        <FormikForm>
                            <Row className="entryForm">
                                <Col sm={12} md={6}>
                                    <Input name="id" placeholder="Id" label="Employee Id" type="number" />
                                </Col>
                                <Col sm={12} md={6}>
                                    <Input name="name" placeholder="Name" label="Employee Name" type="text" />
                                </Col>
                                <Col sm={12} md={6}>
                                    <Input name="price" placeholder="100" label="price" type="number" />
                                </Col>
                                <Col sm={12} md={6}>
                                    <Input name="date" placeholder="date" label="date" type="date" />
                                </Col>
                                <Col sm={12}>
                                    <Label label="Purchase" />
                                    <div className="card flex justify-content-center position-relative">
                                        <MultiSelect
                                            value={selectedCities}
                                            onChange={(e) => setSelectedCities(e.value)}
                                            options={purchaseOptions}
                                            optionLabel="name"
                                            filter
                                            placeholder="Select Product"
                                            maxSelectedLabels={3}
                                            className="w-full md:w-20rem"
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Button className="my-3 d-block ms-auto" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Loading centered size="sm" /> : productModal.isEditable ? 'Update' : 'Create'}
                            </Button>
                        </FormikForm>
                    )}
                </Formik>
            )}
        </Container>
    );
};

export default LedgerForm;
