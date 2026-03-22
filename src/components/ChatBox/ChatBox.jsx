import React from 'react';
import './ChatBox.css';
import assets from '../../assets/assets';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useState } from 'react';
import { useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const ChatBox = () => {

    const { userData, messagesId, chatUser, messages, setMessages } = useContext(AppContext);

    const [input, setinput] = useState("");

    const sendMessage = async () => {
        try {
            if(input && messagesId){
                await updateDoc(doc(db, 'messages', messagesId),{
                    messages: arrayUnion({
                        sId: userData.id,
                        text:input,
                        createAt: new Date()
                    })
                })
            }
        } catch (error) {
            
        }
    }

    useEffect(() => {
        if(messagesId) {
            const unSub = onSnapshot(doc(db, 'messages', messagesId), (res) => {
                setMessages(res.data().messages.reverse());
                console.log(res.data().messages.reverse());
                
            })
            return () => {
                unSub();
            }
        }
    }, [messagesId])


    return chatUser ? (
        <div className='chat-box'>
            <div className="chat-user">
                <img src={chatUser.userData.avatar} alt="" />
                <p>{chatUser.userData.name} <img className='dot' src={assets.green_dot} alt="" /></p>
                <img src={assets.help_icon} className='help' alt="" />
            </div>


            <div className="chat-msg">
                <div className="s-msg">
                    <p className="msg">Lorem ipsum is placeholder text commonly used in ..</p>
                    <div>
                        <img src={assets.profile_img} alt="" />
                        <p>2:30 PM</p>
                    </div>
                </div>
                <div className="s-msg">
                    <img src={assets.pic1} className="msg-img" alt="" />
                    <div>
                        <img src={assets.profile_img} alt="" />
                        <p>2:30 PM</p>
                    </div>
                </div>
                <div className="r-msg">
                    <p className="msg">Lorem ipsum is placeholder text commonly used in ..</p>
                    <div>
                        <img src={assets.profile_img} alt="" />
                        <p>2:30 PM</p>
                    </div>
                </div>
            </div>

            <div className="chat-input">
                <input onChange={(e)=>setinput(e.target.value)} value={input} type="text" placeholder='Send a message' />
                <input type="file" id='image' accept='image/png, image/jpeg' hidden />
                <label htmlFor="image">
                    <img src={assets.gallery_icon} alt="" />
                </label>
                <img src={assets.send_button} alt="" />
            </div>
        </div>
    )
    : <div className="chat-welcome">
        <img src={assets.logo_icon} alt="" />
        <p>Chat anytime, anywhere</p>
      </div>
}

export default ChatBox;
