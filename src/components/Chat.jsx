import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import io from "socket.io-client"
import Messages from "./Messages"
import EmojiPicker from 'emoji-picker-react'
import icon from '../images/emoji.svg'
import styles from '../styles/Chat.module.css'

const socket = io.connect("http://localhost:5000")

const Chat = () => {
    const { search } = useLocation()
    const navigate = useNavigate();
    const [state, setState] = useState([])
    const [params, setParams] = useState({room: "", user: ""})
    const [message, setMessage] = useState("")
    const [isOpen, setOpen] = useState(false)
    const [users, setUsers] = useState(0);

    const messagesContainerRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [state]);

    useEffect(() => {
        const searchParams = Object.fromEntries(new URLSearchParams(search))
        setParams(searchParams)
        socket.emit("join", searchParams)
    }, [search])

    useEffect(() => {
        socket.on("getMessage", (data) => {
            setState((_prevState) => [..._prevState, data])
        })

    }, [])

    useEffect(() => {
        socket.on("room", ({ data: { users } }) => {
            setUsers(users.length);
        });
    }, []);

    console.log(state)

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };
    const leftRoom = () => {
        socket.emit("leftRoom", { params });
        navigate("/");
    };
    const handleChange = ({ target: { value } }) => setMessage(value);
    const onEmojiClick = ({ emoji }) => setMessage(`${message} ${emoji}`)
    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (!message) return;
        if (isOpen) setOpen(!isOpen)
    
        socket.emit("sendMessage", { message, params });
    
        setMessage("");
    };
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSubmit(event);
        }
    };

    return <div className={styles.wrap}>
        <div className={styles.header}>
            <div className={styles.title}>{params && params.room}</div>
            <div className={styles.users}>{users} пользователя в комнате</div>
            <button className={styles.left} onClick={leftRoom}>Покинуть комнату</button>
        </div>
        <div className={styles.messages} ref={messagesContainerRef}>
            <Messages messages={state} name={params.name} />
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.input}>
                <input 
                    type="text"
                    name="name"
                    placeholder="Написать сообщение..."
                    autoComplete="off"
                    value={message}
                    onChange={handleChange}
                    onKeyDown={handleKeyPress}
                    required
                />
            </div>
            <div className={styles.emoji}>
                <img src={icon} alt="" onClick={() => setOpen(!isOpen)} />

                {isOpen &&
                    <div className={styles.emojies}>
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>
                }
            </div>
            <div className={styles.button}>
                <input type="submit" onSubmit={handleSubmit} value="Отправить" />
            </div>
        </form>
    </div>
}

export default Chat