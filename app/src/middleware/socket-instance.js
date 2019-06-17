import io from 'socket.io-client';

export default io('http://localhost:5000', { autoConnect: false,  query: {token: localStorage.getItem("token")}})
