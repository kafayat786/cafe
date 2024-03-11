import React, { useEffect, useState } from 'react';
import { Form as FormikForm, Formik } from 'formik';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Input from '../../components/Input/Input';
import * as Yup from 'yup';
import axiosWrapper from '@utils/api';
import Loading from '@components/Loading/Loading';
import { toast } from 'react-toastify';

const ProductsForm = ({ productModal, fetchData, resetModal }) => {
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(false);

    const initialValues = {
        name: product.name || '',
        price: product.price || ''
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('name is required'),
        price: Yup.number().required('price is required')
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
            const data = await axiosWrapper(method, `${import.meta.env.VITE_API_BASE_URL}${endpoint}`, values);
            toast.success(productModal.isEditable ? 'Item updated successfully' : 'Item created successfully', { autoClose: 1000 });
        } catch (error) {
            setSubmitting(false);
        } finally {
            resetModal();
            fetchData();
        }
    };

    const getRequestMeta = (isEditable) => {
        if (isEditable) {
            return { method: 'PUT', endpoint: `/products/${product?._id}` };
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
                                <Col sm={12}>
                                    <Input name="name" placeholder="Name" label="Product Name" type="text" />
                                </Col>

                                <Col sm={12}>
                                    <Input name="price" placeholder="100" label="price" type="number" />
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

export default ProductsForm;
