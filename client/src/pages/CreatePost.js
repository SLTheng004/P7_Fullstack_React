import React, { useEffect } from "react";
import '../css/CreatePost.css';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function CreatePost() {

  let navigate = useNavigate();
  const initialValues = {
    title: "",
    postText: "",
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
  }, []);
  
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title cannot be left blank"),
    postText: Yup.string().required("Post cannot be left blank"),
  });

  const onSubmit = (data) => {
    axios.post("http://localhost:4000/posts", 
    data, 
    {headers: { accessToken: localStorage.getItem('accessToken') },
    }).then(() => {
        navigate('/');
      });
  };

  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Title: </label>
          <ErrorMessage name="title" component="span" className="postErrorMessage"/>
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="title"
            placeholder="Title..."
          />


          <label>Post: </label>
          <ErrorMessage name="postText" component="span" className="postErrorMessage"/>
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="postText"
            placeholder="Post..."
          />

          <Field
          id="inputCreatePost"
          name="imageUrl"
          type="file"
          />

          <button type="submit" className="createPostButton"> Create Post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;