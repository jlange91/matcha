import io from 'socket.io-client';

export default io('http://localhost', { autoConnect: true,  query: { token: localStorage.getItem("token") } })
