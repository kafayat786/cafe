import React, { useEffect, useState } from 'react';
import { Form as FormikForm, Formik, Field, ErrorMessage } from 'formik';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import Input from '../../components/Input/Input';
import * as Yup from 'yup';
import { MultiSelect } from 'primereact/multiselect';
import axiosWrapper from '@utils/api';
import Loading from '@components/Loading/Loading';
import { toast } from 'react-toastify';
import Label from '../../components/Input/Label';

const EmployeesForm = ({ productModal, resetModal, fetchData }) => {
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(false);
    const dept = ['Development', 'QA', 'Social Media', 'HR', 'Designer', 'Support'];

    const initialValues = {
        ropstamId: product.ropstamId || '',
        name: product.name || '',
        department: product.department || 'Development'
    };

    const validationSchema = Yup.object().shape({
        ropstamId: Yup.string().required('id is required'),
        name: Yup.string().required('Brief summary is required'),
        department: Yup.string().required('department is required')
    });

    useEffect(() => {
        if (productModal.isEditable) {
            setProduct(productModal.rowData);
        }
    }, [productModal.rowData, productModal.isEditable]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            setSubmitting(true);
            const { method, endpoint } = getRequestMeta(productModal.isEditable);
            // submit request here
            await axiosWrapper(method, `${import.meta.env.VITE_API_BASE_URL}${endpoint}`, values);
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
            return { method: 'PUT', endpoint: `/employees/${product?._id}` };
        }
        return { method: 'POST', endpoint: '/employees' };
    };

    return (
        <Container>
            {loading ? (
                <Loading />
            ) : (
                <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ isSubmitting, values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                        <FormikForm>
                            <Row className="entryForm">
                                <Col sm={12} md={6}>
                                    <Input name="ropstamId" placeholder="Id" label="Employee Id" type="number" />
                                </Col>
                                <Col sm={12} md={6}>
                                    <Input name="name" placeholder="Name" label="Employee Name" type="text" />
                                </Col>
                                <Col sm={12} className="formgroup">
                                    <Field as="select" name="department" className="custom_select__control">
                                        {dept?.map((val) => (
                                            <>
                                                <option value={val}>{val}</option>
                                            </>
                                        ))}
                                    </Field>
                                    {errors.department && <ErrorMessage name="department" component="span" className="validation-error" />}
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

export default EmployeesForm;
