import React from 'react';
import { useNavigate} from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import '../css/Registration.css';
import axios from 'axios';

function Registration() {
    let navigate = useNavigate();
    const initialValues = {
        username: "",
        password: "",
      };
    
      const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(15).required('username cannot be left blank'),
        password: Yup.string().min(4).max(20)
        .matches(/[0-9]/, 'Password requires a number')
        .matches(/[a-z]/, 'Password requires a lowercase letter')
        .matches(/[A-Z]/, 'Password requires an uppercase letter')
        .required('password cannot be left blank'),
      });


      const createAccount = (data) => {
        axios.post('http://localhost:4000/auth/signup', data).then(() => {
            navigate('/');
        });
      };

  return (
    <div className="createAccountPage">
        <Formik
        initialValues={initialValues}
        onSubmit={createAccount}
        validationSchema={validationSchema}>
        <Form className="formContainer">
          <label>Username: </label>
          <Field
            className="inputCreateUsername"
            name="username"
            autoComplete="off"/>
          <ErrorMessage name="username" component="span" className="errorMessage"  />

          <label>Password: </label>
          <Field
            type="password"
            className="inputCreateUsername"
            name="password"
            autoComplete="off"/>
          <ErrorMessage name="password" component="span" className="errorMessage" />


          <button type="submit" className="createAccountButton" > Create Account</button>
        </Form>
      </Formik>
    </div>
  )
}

export default Registration