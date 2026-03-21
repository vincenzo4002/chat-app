import React from 'react';
import './LeftSidebar.css';
import assets from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useState } from 'react';
import { arrayUnion, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const LeftSidebar = () => {

    const navigate = useNavigate();
    const { userData,chatData } = useContext(AppContext);
    const [user, setUser] = useState(null);
    const [showSearch, setShowSearch] = useState(false);

    const inputHandler = async (e) => {
        try {
            const input = e.target.value;
            if (input) {
                setShowSearch(true);
                const userRef = collection(db, 'users');
                const q = query(userRef, where("username", "==", input.toLowerCase()));
                const querySnap = await getDocs(q);
                if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
                    let userExit = false;
                    chatData.map((user)=>{
                        if(user.rId === querySnap.docs[0].data().id){
                            userExit = true;
                        }
                    })
                    if(!userExit){
                    setUser(querySnap.docs[0].data());
                    }
                }
                else{
                    setUser(null);
                }
            }
            else{
                setShowSearch(false);
            }
        } catch (error) {

        }
    }

    const addChat= async()=>{
        const messagesRef = collection(db, "messages");
        const charsRef = collection(db, "chats");
        try {
            const newMessagesRef = doc(messagesRef);
            await setDoc(newMessagesRef, {
                createAt:serverTimestamp(),
                messages:[]
            })

            await updateDoc(doc(charsRef, userData.id), {
                chatsData: arrayUnion({
                    messageId: newMessagesRef.id,
                    lastMessage: "",
                    rId: userData.id,
                    updatedAt: Date.now(),
                    messageSeen: true
                })
            })

            await updateDoc(doc(charsRef, userData.id), {
                chatsData: arrayUnion({
                    messageId: newMessagesRef.id,
                    lastMessage: "",
                    rId: user.id,
                    updatedAt: Date.now(),
                    messageSeen: true
                })
            })
        } catch (error) {
            toast.error(error.message);
            console.error(error);
            
        }
    }

    const setChat = async(item) => {
        console.log(item);
        
    }

    return (
        <div>
            <div className="ls">
                <div className="ls-top">
                    <div className="ls">
                        <img src={assets.logo} className='logo' alt="" />
                        <div className="menu">
                            <img src={assets.menu_icon} alt="" />
                            <div className="sub-menu">
                                <p onClick={() => navigate('/profile')}>Edit Profile</p>
                                <hr />
                                <p>Logout</p>
                            </div>
                        </div>
                    </div>
                    <div className="ls-search">
                        <img src={assets.search_icon} alt="" />
                        <input onChange={inputHandler} type="text" placeholder='Search here..' />
                    </div>
                </div>
                <div className="ls-list">
                    {showSearch && user 
                    ? <div onClick={addChat} className='friends add-user'>
                        <img src={user.avatar} alt=""/>
                        <p>{user.name}</p>
                    </div>
                    :chatsData?.map((item, index) => (
                        <div onClick={()=>setChat(item)} key={index} className="friends">
                            <img src={item.userData.avatar} alt="" />
                            <div>
                                <p>{item.userData.name}</p>
                                <span>{item.lastMessage}</span>
                            </div>
                        </div>
                    ))
                    }
                </div>
            </div>
        </div>
    )
}

export default LeftSidebar;
