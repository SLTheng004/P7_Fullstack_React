import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import '../css/Home.css';


function Home() {
    // const [newPostNotif, setNewPostNotif] = useState([]);
    const [listOfPosts, setListOfPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
        //check if auth
        if (!localStorage.getItem("accessToken")) {
            navigate('/login');
        } else {
            axios.get('http://localhost:4000/posts',
            {  headers: { accessToken: localStorage.getItem('accessToken') }}).then((response) => {
                setListOfPosts(response.data.listOfPosts.reverse());
                // setNewPostNotif(response.data.newPostNotif)
                setLikedPosts(response.data.likedPosts.map((like) => {
                    return like.PostId;
                }));
            });
        }
    }, []);

    const likePost = (postId) => {
        axios.post('http://localhost:4000/likes',
         {  PostId: postId }, 
         {  headers: { accessToken: localStorage.getItem('accessToken') }}
        ).then((response) => {
            //update likes automatically
            setListOfPosts(listOfPosts.map((post) => {
                if (post.id === postId) {
                    if (response.data.liked) {
                        return {...post, Likes: [...post.Likes, 0] };
                    } else {
                        const likesArray = post.Likes;
                        likesArray.pop();
                        return {...post, Likes: likesArray };
                    }
                } else {
                    return post;
                }
            }));
            //change color when liked/unliked
            if (likedPosts.includes(postId)) {
                setLikedPosts(likedPosts.filter((id) => {
                    return id != postId; 
                }))
            } else {
                setLikedPosts([...likedPosts, postId])
            }
        });
    };

    // const readPost = (postId) => {
    //     axios.post('http://localhost:4000/read',
    //      {  PostId: postId }, 
    //      {  headers: { accessToken: localStorage.getItem('accessToken') }}
    //     ).then((response) => {
    //         //update if read automatically
    //         setListOfPosts(newPostNotif.map((post) => {
    //             if (post.id === postId) {
    //                 if (response.data.read) {
    //                     return {...post, NewPostNotif: [...post.NewPostNotif, 0] };
    //                 } else {
    //                     const readArray = post.NewPostNotif;
    //                     readArray.pop();
    //                     return {...post, NewPostNotif: readArray };
    //                 }
    //             } else {
    //                 setNewPostNotif([...newPostNotif, postId])
    //                 return post;
    //             }
    //         }));
    //     });
    // }  

    return (
        <div className="App"> {listOfPosts.map((value, key) => {
            return (
            // <div 
            // className={newPostNotif.includes(value.id) ? "unReadBtn" : "readBtn" }
            // onClick={() => {
            //     navigate(`/post/${value.id}`)
            //     readPost(value.id);
            // }}
            // >
                <div className="post" key={key}> 
                    <div className='titleContainer'> 
                    <div className='title'
                    onClick={() => {navigate(`/post/${value.id}`)}}>{value.title}</div>
                        <div className='read'>
                            <FiberNewIcon 
                            id='fiberNewIcon'
                            style={{ fontSize: '2rem', height: '30px' }}>
                            </FiberNewIcon>
                            <p><strong>POST!</strong></p>
                        </div>
                    </div>
                    <div className='postText'
                    onClick={() => {navigate(`/post/${value.id}`)}}> {value.postText} </div>
                    <div className='imageUrl'> { value.imageUrl } </div>
                    <div className="userContainer">
                        <div className='username'
                        onClick={() =>{navigate(`/post/${value.id}`)}}> Posted by {value.username}
                        </div>
                        <div className="likeContainer">
                        <ThumbUpIcon
                        className={likedPosts.includes(value.id) ? "unlikeBtn" : "likeBtn" }
                        style={{ fontSize: '1.5rem', height: '27px' }}
                        onClick={() =>
                        {likePost(value.id)}}>
                            {" "}
                            Like
                        </ThumbUpIcon>
                        <label> {value.Likes.length} </label>
                        </div>
                    </div>
                </div> 
            // </div>
            );
        })}
        </div>  
  )
}

export default Home