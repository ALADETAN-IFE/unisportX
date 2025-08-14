import React, { createContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Comment {
  _id: string;
  user: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  content: string;
  createdAt: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinPost: (postId: string) => void;
  leavePost: (postId: string) => void;
  emitNewComment: (postId: string, comment: Comment) => void;
  emitCommentDeleted: (postId: string, commentId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Create socket connection
    const serverUrl = import.meta.env.VITE_SERVER_URL2 || 'http://localhost:5000';
    console.log('Connecting to Socket.IO server:', serverUrl);
    
    const newSocket = io(serverUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      console.error('Error message:', error.message);
      setIsConnected(false);
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Socket.IO reconnection attempt ${attemptNumber}`);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('Socket.IO reconnection failed');
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  const joinPost = (postId: string) => {
    if (socket && isConnected) {
      socket.emit('join-post', postId);
    }
  };

  const leavePost = (postId: string) => {
    if (socket && isConnected) {
      socket.emit('leave-post', postId);
    }
  };

  const emitNewComment = (postId: string, comment: Comment) => {
    if (socket && isConnected) {
      socket.emit('new-comment', { postId, comment });
    }
  };

  const emitCommentDeleted = (postId: string, commentId: string) => {
    if (socket && isConnected) {
      socket.emit('comment-deleted', { postId, commentId });
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    joinPost,
    leavePost,
    emitNewComment,
    emitCommentDeleted
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext };

