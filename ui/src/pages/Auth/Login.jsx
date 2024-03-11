import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Col, Row, Container, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import authBg from '@images/cafeshop.jpg';
import logoImg from '@images/logo.png';
import Input from '@components/Input/Input';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Form as FormikForm, Formik } from 'formik';
//import { loginUser } from '@redux/auth/auth_actions'; use this function for original login call
import { Helmet } from 'react-helmet';
import { loginUser } from '@redux/auth/auth_actions';
import './auth.scss';

const Login = () => {
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const { loading } = useSelector((state) => state?.auth);
    const [initialValues, setInitailValues] = useState({
        username: '',
        password: ''
    });

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Name is required'),
        // email: Yup.string().email('Please enter a valid email').required('Email is required'),
        password: Yup.string().required('Password is required')
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            dispatch(loginUser(values));
            setSubmitting(false);
        } catch (error) {
            setSubmitting(false);
        }
    };

    return (
        <React.Fragment>
            <Helmet>
                <title>Login | Template</title>
            </Helmet>
            <div className="auth-main-wrapper">
                <Container>
                    <Card className="auth-card-wrapper">
                        <Row className="justify-content-center g-0">
                            <Col xs={12} sm={12} md={12} lg={6}>
                                <img className="auth-bg" src={authBg} alt="auth-background" />
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={6}>
                                <div className="auth-form-wrapper">
                                    <img className="auth-logo" src={logoImg} alt="auth-logo" />
                                    <h3 className="auth-form-title">Sign in to you account</h3>
                                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                                        {({ isSubmitting }) => (
                                            <FormikForm>
                                                <Input name="username" placeholder="kafayat" label="Name" type="text" />

                                                {/* <Input name="email" placeholder="user@domain.com" label="Email" type="text" /> */}
                                                <div className="position-relative passwordField">
                                                    <Input name="password" placeholder="password" label="Password" type={!show ? 'password' : 'text'} />
                                                    <FontAwesomeIcon icon={!show ? faEye : faEyeSlash} onClick={() => setShow(!show)} />
                                                </div>
                                                <Button className="my-3" type="submit" disabled={loading}>
                                                    {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Login'}
                                                </Button>
                                            </FormikForm>
                                        )}
                                    </Formik>
                                    <Link className="auth-link" to="/forgot-password">
                                        Forgot password?
                                    </Link>
                                    <p className="auth-bottom-text">
                                        Don't have an account?{' '}
                                        <Link className="auth-link" to="/signup">
                                            Register here
                                        </Link>
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Login;
