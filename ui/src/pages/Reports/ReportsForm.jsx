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

const ReportsForm = ({ productModal, resetModal }) => {
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedCities, setSelectedCities] = useState(null);
    const cities = ['Development', 'QA', 'Social Media', 'HR', 'Designer', 'Support'];

    const initialValues = {
        id: product.id || '',
        name: product.name || '',
        department: product.department || '',
        total: product.total || ''
    };

    const validationSchema = Yup.object().shape({
        id: Yup.string().required('id is required'),
        name: Yup.string().required('Brief summary is required'),
        department: Yup.number().typeError('department must be a number').required('department is required')
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

                                <Col sm={12}>
                                    <Label label="Department" />

                                    <div className="card flex justify-content-center">
                                        <MultiSelect
                                            value={selectedCities}
                                            onChange={(e) => setSelectedCities(e.value)}
                                            options={cities}
                                            optionLabel=""
                                            filter
                                            placeholder="Select Cities"
                                            className="w-full md:w-20rem"
                                        />
                                    </div>
                                </Col>
                                <Col sm={12} md={6}>
                                    <Input name="total" placeholder="Total" label="Total" type="number" />
                                </Col>
                            </Row>
                            <Button className="my-3 d-block ml-auto" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Loading centered size="sm" /> : productModal.isEditable ? 'Update' : 'Create'}
                            </Button>
                        </FormikForm>
                    )}
                </Formik>
            )}
        </Container>
    );
};

export default ReportsForm;
