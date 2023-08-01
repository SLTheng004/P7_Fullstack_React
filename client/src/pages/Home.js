import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import '../css/Home.css';


function Home() {
    const [listOfPosts, setListOfPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [read, setRead] = useState([]);

    let navigate = useNavigate();

    //if not logged in go to home page, else display home page
    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate('/login');
        } else {
            axios.get('http://localhost:4000/posts',
                { headers: { accessToken: localStorage.getItem('accessToken') } }).then((response) => {
                    setListOfPosts(response.data.listOfPosts.reverse());
                    setLikedPosts(response.data.likedPosts.map((like) => {
                        return like.PostId;
                    }));
                });
            axios.get('http://localhost:4000/postsread', { headers: { accessToken: localStorage.getItem('accessToken') } }).then((response) => {
                setRead(response.data.map((read) => {
                    return read.PostId;
                }))
            })
        }
    }, []);

    // updates like when a user interacts
    const likePost = (postId) => {
        axios.post('http://localhost:4000/likes',
            { PostId: postId },
            { headers: { accessToken: localStorage.getItem('accessToken') } }
        ).then((response) => {
            //toggle like or unlike
            setListOfPosts(listOfPosts.map((post) => {
                if (post.id === postId) {
                    if (response.data.liked) {
                        return { ...post, Likes: [...post.Likes, 0] };
                    } else {
                        const likesArray = post.Likes;
                        likesArray.pop();
                        return { ...post, Likes: likesArray };
                    }
                } else {
                    return post;
                }
            }));
            if (likedPosts.includes(postId)) {
                setLikedPosts(likedPosts.filter((id) => {
                    return id != postId;
                }))
            } else {
                setLikedPosts([...likedPosts, postId])
            }
        });
    };

    // updates to api if read 
    const readPost = async (postId) => {
        await axios.post('http://localhost:4000/postsread',
            { PostId: postId },
            { headers: { accessToken: localStorage.getItem('accessToken') } }
        ).then(() => {
            if (read.includes(postId)) {
                setRead(read.filter((id) => {
                    return id != postId;
                }))
            } else {
                setRead([...read, postId])
            }

        })
    };


    return (
        <div className="App"> {listOfPosts.map((value, key) => {
            return (
                <div className="post" key={key} >
                    <div className='titleContainer'
                        onClick={() => {
                            readPost(value.id)
                            navigate(`/post/${value.id}`)
                        }} >
                        <div className='title'>
                            {value.title}</div>
                        <div
                            className={
                                read.includes(value.id) && "read"}
                            onClick={() => {
                                readPost(value.id)
                            }}>
                            <FiberNewIcon
                                id='fiberNewIcon'
                                style={{ fontSize: '2rem', height: '30px' }}>
                            </FiberNewIcon>
                        </div>
                    </div>
                    <div className='postText'
                        onClick={() => {
                            readPost(value.id)
                            navigate(`/post/${value.id}`)
                        }}>
                        {value.postText}
                        {value.imageUrl && <img src={value.imageUrl} alt="Post Image" id="imageUrl" />}
                    </div>
                    <div className="userContainer">
                        <div className='username'
                            onClick={() => {
                                readPost(value.id)
                                navigate(`/post/${value.id}`)
                            }}>
                            Posted by {value.username}
                        </div>
                        <div className="likeContainer">
                            <ThumbUpIcon
                                className={likedPosts.includes(value.id) ? "unlikeBtn" : "likeBtn"}
                                style={{ fontSize: '1.5rem', height: '27px' }}
                                onClick={() => { likePost(value.id) }}>
                                {" "}
                                Like
                            </ThumbUpIcon>
                            <label> {value.Likes.length} </label>
                        </div>
                    </div>
                </div>
            );
        })} </div>
    )
}
export default Home