import React, { useEffect, useState } from 'react';

const SocketDebug = ({ socket }) => {
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!socket?.current) return;

    const addEvent = (eventName, data) => {
      setEvents(prev => [...prev.slice(-9), {
        timestamp: new Date().toLocaleTimeString(),
        event: eventName,
        data: data
      }]);
    };

    socket.current.on('connect', () => {
      setConnectionStatus('Connected');
      addEvent('connect', 'Socket connected');
    });

    socket.current.on('disconnect', () => {
      setConnectionStatus('Disconnected');
      addEvent('disconnect', 'Socket disconnected');
    });

    socket.current.on('connect_error', (error) => {
      setConnectionStatus('Error');
      addEvent('connect_error', error.message);
    });

    socket.current.on('online-users', (users) => {
      addEvent('online-users', `${users.length} users online`);
    });

    socket.current.on('msg-recieve', (msg) => {
      addEvent('msg-recieve', `Message from ${msg.from}`);
    });

    return () => {
      if (socket.current) {
        socket.current.off('connect');
        socket.current.off('disconnect');
        socket.current.off('connect_error');
        socket.current.off('online-users');
        socket.current.off('msg-recieve');
      }
    };
  }, [socket]);

  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <div className="mb-2">
        <strong>Socket Status:</strong> 
        <span className={`ml-2 ${connectionStatus === 'Connected' ? 'text-green-400' : 'text-red-400'}`}>
          {connectionStatus}
        </span>
      </div>
      <div className="mb-2">
        <strong>Recent Events:</strong>
      </div>
      <div className="max-h-32 overflow-y-auto">
        {events.map((event, index) => (
          <div key={index} className="text-xs mb-1">
            <span className="text-gray-400">{event.timestamp}</span> - 
            <span className="text-yellow-400 ml-1">{event.event}</span>
            {event.data && <span className="ml-1">: {event.data}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocketDebug;