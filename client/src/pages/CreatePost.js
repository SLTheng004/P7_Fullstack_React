import React, { useEffect, useState } from "react";
import '../css/CreatePost.css';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  let navigate = useNavigate();
  const initialValues = {
    title: "",
    postText: "",
    imageUrl: ""
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("title cannot be left blank"),
    postText: Yup.string().required('post cannot be left blank'),
  });


  const onSubmit = ((values) => {
    const formData = new FormData();
    for (let value in values) {
      if (value !== 'imageUrl') {
        formData.append(value, values[value]);       
      } else {
        formData.append(value, image);
      }
    }
    axios.post('http://localhost:4000/posts', formData,          
    {  headers: { accessToken: localStorage.getItem('accessToken') }}
    ).then((response) => {
      console.log(response);
      navigate('/');
    });
  })

  return (
    <div className="createPostPage">
      <Formik
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        initialValues={initialValues}
      > 
        <Form className="formContainer" encType="multipart/form-data">
          <label>Title: </label>
          <ErrorMessage name="title" component="span" className="postErrorMessage"/>
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="title"
            placeholder="Title..."
            type = "text"
            />

          <label>Post: </label>
          <ErrorMessage name="postText" component="span" className="postErrorMessage"/>
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="postText"
            placeholder="Post..."
            type = "text"
          />

          <Field
          id="inputCreatePost"
          type="file"
          name="imageUrl"
          accept="image/*"
          onChange = {(e) => {
            setImage(e.target.files[0])
            setImageUrl(e.target.value)
          }}
          value = {imageUrl}
          />

          <button type="submit" className="createPostButton"> Create Post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;