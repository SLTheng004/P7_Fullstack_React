import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../helpers/AuthContext';
import '../css/Post.css';



function Post() {
  let navigate = useNavigate();
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`http://localhost:4000/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);

    });

    axios.get(`http://localhost:4000/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, []);

  const addComment = () => {
    axios.post("http://localhost:4000/comments", {
        commentBody: newComment,
        PostId: id,
      },
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error)
        } else {
          const commentToAdd = { commentBody: newComment, username: response.data.username };
          setComments([...comments, commentToAdd]);
          setNewComment(""); // clear input after submit
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:4000/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      }).then(() => {
        setComments(
          comments.filter((val) => {
            return val.id != id;
          })
        );
      });
  };


  const deletePost = (id) => {
    axios
      .delete(`http://localhost:4000/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        navigate("/");
      });
  };

  return (
    <div className="postPage"> 
        <div className="postContainer">
        <div className="title"> {postObject.title} </div>
        <div className="postText">{ postObject.postText }</div>
          <div className="username">
            {postObject.username}
            <button
                onClick={() => {
                  deletePost(postObject.id);
                }}
              >
                {" "}
                Delete Post
              </button></div>
        </div>
        <div className="commentContainer">
            <div className="addComment">
              <input
              autoComplete="off"
              id="commentInput"
              type="text"  
              placeholder="What are your thoughts?"
              value={newComment}
              onChange={(event) => {
                setNewComment(event.target.value);
              }} 
              />
              <button className="addCommentButton" onClick={addComment}> Comment </button>
            </div>
            <div className="listOfComments">
                {comments.map((comment, key) => {
                  return <div key={key} className="comment"> 
                    <label id="userComment"> {comment.username} commented: </label>
                    <div className="commentBody">
                      { comment.commentBody }
                      {authState.username === comment.username && (
                      <button onClick={() => {deleteComment(comment.id)}}>Delete Comment</button>
                      )}
                    </div>               
                </div>
                })}
            </div>
        </div>
    </div>

  )
}

export default Post;