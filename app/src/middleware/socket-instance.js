import io from 'socket.io-client';

export default io('http://localhost', { autoConnect: false,  query: { token: localStorage.getItem("token") } })
