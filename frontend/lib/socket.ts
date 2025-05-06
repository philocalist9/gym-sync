import { io, ManagerOptions, SocketOptions, Socket } from 'socket.io-client';

// IMPORTANT: Set to false to completely disable sockets in case of issues
const ENABLE_SOCKETS = process.env.NEXT_PUBLIC_ENABLE_SOCKETS !== 'false';

// Define the socket URL with fallback
const getSocketUrl = (): string => {
  // Try different environment variables
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 
                process.env.NEXT_PUBLIC_SOCKET_URL || 
                process.env.NEXT_PUBLIC_BACKEND_URL;
  
  // Handle development mode
  if (process.env.NODE_ENV === 'development') {
    // Return the environment URL if available, otherwise fallback to localhost
    return envUrl || 'http://localhost:5001';
  }
  
  // In production, try to infer from window location if possible
  if (typeof window !== 'undefined') {
    // Create a URL based on the current hostname but with the backend port
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    return envUrl || `${protocol}//${window.location.hostname}:5001`;
  }
  
  // Final fallback
  return envUrl || 'http://localhost:5001';
};

// Improved socket dummy that doesn't throw errors
const createDummySocket = (): DummySocket => {
  const eventHandlers = new Map<string, Function[]>();
  
  const dummySocket: DummySocket = {
    connect: () => {
      console.warn('Using dummy socket (real-time updates disabled)');
      return dummySocket;
    },
    disconnect: () => console.warn('Dummy socket: disconnect called'),
    on: (event: string, handler: Function) => {
      if (!eventHandlers.has(event)) {
        eventHandlers.set(event, []);
      }
      eventHandlers.get(event)?.push(handler);
      console.warn(`Dummy socket: registered handler for "${event}" event`);
      return dummySocket;
    },
    off: (event: string, handler?: Function) => {
      if (eventHandlers.has(event)) {
        const handlers = eventHandlers.get(event);
        if (handlers) {
          const index = handler ? handlers.indexOf(handler) : -1;
          if (index !== -1) {
            handlers.splice(index, 1);
          } else {
            eventHandlers.delete(event);
          }
        }
      }
      return dummySocket;
    },
    emit: (event: string, ...args: any[]) => {
      console.warn(`Dummy socket: emit "${event}" called with args:`, args);
      return dummySocket;
    },
    io: {
      on: (event: string, handler: Function) => {
        console.warn(`Dummy socket: io.on("${event}") called`);
        return dummySocket;
      },
      opts: {
        transports: ['polling']
      },
      // Add additional required properties
      engine: {
        on: (...args: any[]) => console.warn('Dummy io.engine.on called with:', args)
      },
      reconnection: true,
      reconnect: true
    },
    // Properties
    connected: false,
    disconnected: true,
    id: 'dummy-socket-id',
    // Additional required properties to match Socket interface
    volatile: {
      emit: (...args: any[]) => {
        console.warn('Dummy volatile.emit called');
        return dummySocket;
      }
    },
    // Helpful method to simulate events (for testing)
    simulateEvent: (event: string, ...args: any[]) => {
      if (eventHandlers.has(event)) {
        eventHandlers.get(event)?.forEach(handler => {
          try {
            handler(...args);
          } catch (err) {
            console.error(`Error in dummy socket handler for "${event}":`, err);
          }
        });
      }
    }
  };
  
  return dummySocket;
};

// Socket configuration
const socketOptions: Partial<ManagerOptions & SocketOptions> = {
  autoConnect: false,
  transports: ['polling', 'websocket'], // Start with polling (more reliable), then try websocket
  reconnection: true,
  reconnectionAttempts: 3, // Limit reconnection attempts
  reconnectionDelay: 1000, 
  reconnectionDelayMax: 5000,
  timeout: 10000, // Reduce timeout
  forceNew: true,
  withCredentials: true,
  path: '/socket.io',
};

// Type for our dummy socket that matches Socket.io interface
type DummySocket = {
  connect: () => DummySocket;
  disconnect: () => void;
  on: (event: string, handler: Function) => DummySocket;
  off: (event: string, handler?: Function) => DummySocket;
  emit: (event: string, ...args: any[]) => DummySocket;
  io: {
    on: (event: string, handler: Function) => DummySocket;
    opts: {
      transports: string[];
    };
    engine: {
      on: (...args: any[]) => void;
    };
    reconnection: boolean;
    reconnect: boolean;
  };
  connected: boolean;
  disconnected: boolean;
  id: string;
  volatile: {
    emit: (...args: any[]) => DummySocket;
  };
  simulateEvent: (event: string, ...args: any[]) => void;
};

// Use union type for socket instance
let socketInstance: Socket | DummySocket;

// Determine if we should use a real socket or a dummy
const useDummySocket = () => {
  // Force dummy socket if disabled by env var
  if (!ENABLE_SOCKETS) return true;
  
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return true;
  
  // In development, we can allow failures without breaking the app
  // In production, we should be more careful about network errors
  return false;
};

try {
  // Use dummy socket if needed
  if (useDummySocket()) {
    console.info('Socket.io disabled or unavailable - using fallback polling for notifications');
    socketInstance = createDummySocket();
  } else {
    // Get the socket URL
    const socketUrl = getSocketUrl();
    
    // Create socket instance with more reliable configuration
    socketInstance = io(socketUrl, socketOptions);
    
    // Add connection tracking and debug info
    socketInstance.on('connect', () => {
      console.log('Socket connected to:', socketUrl);
      console.log('Socket ID:', socketInstance.id);
    });
    
    socketInstance.on('connect_error', (err) => {
      console.warn(`Socket connection error: ${err.message}`);
      
      // If we get connection errors, just stick with polling
      socketInstance.io.opts.transports = ['polling'];
    });
    
    socketInstance.on('error', (err) => {
      console.error('Socket error:', err);
    });
    
    socketInstance.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${reason}`);
    });
    
    // Basic reconnection handling
    socketInstance.io.on('reconnect_attempt', (attempt) => {
      console.log(`Socket reconnect attempt: ${attempt}`);
    });
    
    socketInstance.io.on('reconnect_failed', () => {
      console.warn('Socket reconnection failed, falling back to polling for updates');
    });
  }
} catch (error) {
  console.error('Socket initialization error:', error);
  // Always fall back to dummy socket on error
  socketInstance = createDummySocket();
}

// Export the socket instance
export default socketInstance; 