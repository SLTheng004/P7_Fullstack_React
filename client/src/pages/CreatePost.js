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

  //send to login if not auth
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
  }, []);

  //formik schema for requirements
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title cannot be left blank!"),
    postText: Yup.string().required('Post cannot be left blank!'),
  });

  //append and post new post
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
      { headers: { accessToken: localStorage.getItem('accessToken') } }
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
          <h1>Create A Post</h1>
          <label>Title: </label>
          <ErrorMessage name="title" component="span" className="postErrorMessage" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="title"
            placeholder="Title..."
            type="text"
          />

          <label>Post: </label>
          <ErrorMessage name="postText" component="span" className="postErrorMessage" />
          <Field
            as="textarea"
            style={{ flexDirection: "wrap" }}
            autoComplete="off"
            id="inputCreatePost"
            name="postText"
            placeholder="Post..."
            className="postBody"
          />

          <label>File:</label>
          <ErrorMessage name="imageUrl" component="span" className="postErrorMessage" />
          <Field
            id="inputCreatePost"
            type="file"
            name="imageUrl"
            accept="image/*"
            onChange={(e) => {
              setImage(e.target.files[0])
              setImageUrl(e.target.value) //file input updates on form
            }}
            value={imageUrl} //file input updates on form
          />

          <button type="submit" className="createPostButton"> Create Post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;