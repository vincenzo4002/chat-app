
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAQuvmV18hF6n-em6sdHZrNKaEXklfRXeE",
  authDomain: "chat-app-gs-de7bc.firebaseapp.com",
  projectId: "chat-app-gs-de7bc",
  storageBucket: "chat-app-gs-de7bc.firebasestorage.app",
  messagingSenderId: "501500005079",
  appId: "1:501500005079:web:d24f838ffa92ba2a6cfe92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async(username,email,password) => {
    try{
        const res = await createUserWithEmailAndPassword(auth,email,password);
        const user = res.user;
        await setDoc(doc(db,"users",user.uid),{
            id: user.uid,
            username: username.toLowerCase(),
            email,
            name: "",
            avatar: "",
            bio: "Hey, There i am using Chat App",
            lastSeen: Date.now()
        })
        await setDoc(doc(db,"chats",user.uid),{
            chatsData: []
        })
    }catch(error){
        console.error(error);
        toast.error(error.code);
    }
}

const login = async(email,password) => {
        try{
            await signInWithEmailAndPassword(auth,email,password);
        }catch(error){
            console.error(error);
            toast.error(error.code.split('/')[1].split('-').join(" "));
        }
}

const logout=async()=>{
    try{
        signOut(auth);
    }catch(error){
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}
export { signup, login, logout, auth, db };
