import React from 'react';
import './ChatBox.css';
import assets from '../../assets/assets';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useState } from 'react';
import { useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { arrayUnion, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const ChatBox = () => {

    const { userData, messagesId, chatUser, messages, setMessages } = useContext(AppContext);

    const [input, setinput] = useState("");

    const sendMessage = async () => {
        try {
            if (input && messagesId) {
                await updateDoc(doc(db, 'messages', messagesId), {
                    messages: arrayUnion({
                        sId: userData.id,
                        text: input,
                        createAt: new Date()
                    })
                })

                const userIDs = [chatUser.rId, userData.id];

                userIDs.forEach(async (id) => {
                    const userChatRef = doc(db, 'chats', id);
                    const userChatSnap = await getDoc(userChatRef);

                    if (userChatSnapshots.exists()) {
                        const userChatData = userChatSnapshots.data();
                        const chatIndex = userChatData.chatsData.findIndex((c) => c.messageId === messagesId);
                        userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30);
                        userChatData.chatsData[chatIndex].updatedAt = Date.now();
                        if (userChatData.chatsData[chatIndex].rId === userData.id) {
                            userChatData.chatsData[chatIndex].messageSeen = false;
                        }
                        await updateDoc(userChatRef, {
                            chatsData: userChatData.chatsData
                        })
                    }
                })
            }
        } catch (error) {
            toast.error(error.message);
        }
        setinput("");
    }

    const sendImage = async (e) => {
        try {

            const fileUrl = await upload(e.target.files[0]);

            if (fileUrl && messagesId) {
                await updateDoc(doc(db, 'messages', messagesId), {
                    messages: arrayUnion({
                        sId: userData.id,
                        image: fileUrl,
                        createAt: new Date()
                    })
                })

                const userIDs = [chatUser.rId, userData.id];

                userIDs.forEach(async (id) => {
                    const userChatRef = doc(db, 'chats', id);
                    const userChatSnap = await getDoc(userChatRef);

                    if (userChatSnapshots.exists()) {
                        const userChatData = userChatSnapshots.data();
                        const chatIndex = userChatData.chatsData.findIndex((c) => c.messageId === messagesId);
                        userChatData.chatsData[chatIndex].lastMessage = "Image";
                        userChatData.chatsData[chatIndex].updatedAt = Date.now();
                        if (userChatData.chatsData[chatIndex].rId === userData.id) {
                            userChatData.chatsData[chatIndex].messageSeen = false;
                        }
                        await updateDoc(userChatRef, {
                            chatsData: userChatData.chatsData
                        })
                    }
                })



            }

        } catch (error) {
            toast.error(error.message);
        }
    }


    const convertTimestamp = (timestamp) => {
        let date = timestamp.toDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        if (hours > 12) {
            return hours - 12 + ":" + minutes + " PM";
        }
        else {
            return hours + ":" + minutes + " AM";
        }
    }


    useEffect(() => {
        if (messagesId) {
            const unSub = onSnapshot(doc(db, 'messages', messagesId), (res) => {
                setMessages(res.data().messages.reverse());


            })
            return () => {
                unSub();
            }
        }
    }, [messagesId])


    return chatUser ? (
        <div className={`chat-box ${chatVisible ? "" : "hidden"}`}>
            <div className="chat-user">
                <img src={chatUser.userData.avatar} alt="" />
                <p>{chatUser.userData.name} {Date.now()-chatUser.userData.lastSeen <= 70000 ?<img className='dot' src={assets.green_dot} alt="" /> : null}</p>
                <img src={assets.help_icon} className='help' alt="" />
                <img onClick={()=>setChatVisible(false)} src={assets.arrow_icon} className='arrow' alt="" />
            </div>


            <div className="chat-msg">

                {messages.map((msg, index) => (
                    <div className={msg.sId === userData.id ? "s-msg" : "r-msg"} key={index}>
                        {msg[image]
                            ? <img className='msg-image' src={msg.image} alt="" />
                            : <p className="msg">{msg.text}</p>
                        }
                        <div>
                            <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" />
                            <p>{convertTimestamp(msg.createAt)}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="chat-input">
                <input onChange={(e) => setinput(e.target.value)} value={input} type="text" placeholder='Send a message' />
                <input onChange={sendImage} type="file" id='image' accept='image/png, image/jpeg' hidden />
                <label htmlFor="image">
                    <img src={assets.gallery_icon} alt="" />
                </label>
                <img onClick={sendMessage} src={assets.send_button} alt="" />
            </div>
        </div>
    )
        : <div className={`chat-welcome ${chatVisible ? "" : "hidden"}`}>
            <img src={assets.logo_icon} alt="" />
            <p>Chat anytime, anywhere</p>
        </div>
}

export default ChatBox;
