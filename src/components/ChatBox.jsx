import React, { useState, useEffect, useRef } from 'react';
import './css/Chatbox.css';
import socketIOClient from 'socket.io-client';

const ChatBox = ({ setIsChatBox }) => {
    //EndPoint del servidor WebSocket
    const ENDPOINTCHAT = import.meta.env.VITE_API_URL_CHAT;

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [userId, setUserId] = useState(null)


    // Ref para acceder al contenedor de mensajes
    const messagesEndRef = useRef(null);


    //Funcion que nos permite escuchar el servidor WebSocket
    useEffect(() => {        
        scrollToBottom();
        // Conectar al servidor de WebSocket en el puerto 3001
        const socket = socketIOClient(ENDPOINTCHAT);
        // Escuchar mensajes entrantes del servidor
        socket.on('chat message', (message) => {
            setMessages([...messages, message]);
        });
        // Devuelve una función de limpieza para desconectar el socket al desmontar el componente
        return () => {
            socket.disconnect();
        };
    }, [messages]);

    // UseEffect permite extraer del localStorage el id del usuario
    useEffect(() => {
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
        setUserId(user.id)
    }, [])

    // Funcion para extraer mensajes del  campo input
    const handleInputChange = (event) => {
        setMessage(event.target.value);
    };

    //Funcion para enviar mensajes al servidor
    const handleSendMessage = () => {
        const socket = socketIOClient(ENDPOINTCHAT);
        socket.emit('chat message', { text: message, origin: 'client' }); // Enviar el mensaje al servidor como respuesta al mensaje seleccionado
        setMessage(''); // Limpiar el input de mensaje

    };

    // Establecer el mensaje seleccionado como el mensaje al que se responderá
    const handleSelectMessage = (msg) => {
        setSelectedMessage(msg);
    };    

    //Funcion para mensajes para escroll al ultimo mensaje
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleChatModal = (e) => {        
        setIsChatBox(false)
    }

    return (
        <div className="chatbox_container_fixed" onClick={handleChatModal}>
            <div className='chatbox_container' onClick={(e) => e.stopPropagation()}>
                <div className="chatbox_header_container">
                    <div className="chatbox_avatar_container">
                        <img className="chatbox_avatar_header" src="/avatar_chatbox.png" alt="" />
                    </div>
                    <div className="chatbox_state_user_container">
                        <div className="chatbox_title_container">
                            <span className='chatbox_title'>Chat Everchic</span>
                        </div>
                        <div className="chatbox_state_container">
                            <div className="chatbox_circle_state"></div>
                            <span className='chatbox_state'>Online</span>
                        </div>
                    </div>
                    <i className='bx bx-x bx_chatbox'onClick={() => setIsChatBox(false)}></i>
                </div>
                <div className="chatbox_body_container">
                    {messages.map((msg, index) => (
                        <div key={index} className={`${msg.origin === 'client' ? 'chatbox_text_container_client' : 'chatbox_text_container_admin'}`}>
                            <div className={`${msg.origin === 'client' ? 'chatbox_msj_client' : 'chatbox_msj_admin'}`}>{msg.text}</div>
                        </div>
                    ))}
                    {/* Ref para scroll automático al final del contenedor del chat */}
                    <div ref={messagesEndRef} />
                </div>
                <div className="chatbox_messaje_write_container">
                    <div className="chatbox_messaje_input_user_container">
                        <input
                            className="chatbox_messaje_input_user_messaje"
                            type="text"
                            placeholder="Escribe tu mensaje..."
                            value={message}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="chatbox_icon_send_container">
                        <i className='bx bxs-send button_send_messaje' onClick={handleSendMessage}></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
