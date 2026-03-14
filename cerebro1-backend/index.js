const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const os = require('os');
require('dotenv').config();

// Helper to get local IP address
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

const app = express();

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.url} from ${req.ip}`);
  next();
});

// Explicit CORS to allow everything including preflight and credentials
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

// Serve uploaded files statically BEFORE fileUpload middleware to ensure direct access
app.use('/uploads', cors(), express.static(path.join(__dirname, 'uploads')));

app.use(fileUpload({
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
  useTempFiles: true,
  tempFileDir: path.join(__dirname, 'tmp'),
  debug: true,
  parseNested: true
}));

// Ensure directories exist
['tmp', 'uploads'].forEach(dir => {
  const p = path.join(__dirname, dir);
  if (!fs.existsSync(p)) fs.mkdirSync(p);
});

app.get('/', (req, res) => {
  res.send('Cerebro Sync Backend is online and awaiting transmission...');
});

// File upload endpoint
app.post('/upload', (req, res) => {
  console.log(">>> [UPLOAD] Request received from:", req.ip);
  
  if (!req.files || !req.files.video) {
    console.error(">>> [UPLOAD] No video file in request");
    return res.status(400).json({ error: 'No video file was uploaded.' });
  }

  const videoFile = req.files.video;
  console.log(`>>> [UPLOAD] File detected: ${videoFile.name} (${videoFile.size} bytes)`);

  const fileName = `${Date.now()}-${videoFile.name.replace(/\s+/g, '_')}`;
  const uploadPath = path.join(__dirname, 'uploads', fileName);

  videoFile.mv(uploadPath, (err) => {
    if (err) {
      console.error(">>> [UPLOAD] File move error:", err);
      return res.status(500).json({ error: "File system error during move" });
    }

    let host = req.get('host'); 
    // Handle Render's proxy by checking x-forwarded-proto
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;

    // In a cloud environment like Render, we want the external host, not the internal IP.
    // The previous localhost replacement was only for local network testing.
    if (process.env.NODE_ENV !== 'production' && (host.includes('localhost') || host.includes('127.0.0.1'))) {
      const lanIP = getLocalIP();
      host = host.replace(/localhost|127\.0\.0\.1/, lanIP);
      console.log(`>>> [UPLOAD] localhost detected in dev, swapping to LAN IP: ${host}`);
    }

    const fileUrl = `${protocol}://${host}/uploads/${fileName}`;
    
    console.log(`>>> [UPLOAD] Success! Generated Public URL: ${fileUrl}`);
    res.json({ url: fileUrl });
  });
});

const server = http.createServer(app);
server.timeout = 600000; // 10 minutes
server.keepAliveTimeout = 600000;
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Room state management
const rooms = new Map();

/**
 * Room Object Structure:
 * {
 *   broadcaster: { socketId, callsign },
 *   listeners: [{ socketId, callsign }],
 *   playbackState: {
 *     playing: false,
 *     currentTime: 0,
 *     lastUpdated: Date.now()
 *   }
 * }
 */

io.on('connection', (socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on('join_room', ({ roomId, role, callsign }) => {
    socket.join(roomId);
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        broadcaster: null,
        listeners: [],
        videoSource: null, // Track the video URL/source
        playbackState: {
          playing: false,
          currentTime: 0,
          lastUpdated: Date.now()
        }
      });
    }

    const room = rooms.get(roomId);

    if (role === 'broadcaster') {
      // If there's already a broadcaster, we might want to handle that.
      // For simplicity, the new broadcaster takes over.
      room.broadcaster = { socketId: socket.id, callsign };
      console.log(`Broadcaster ${callsign} joined room ${roomId}`);
    } else {
      room.listeners.push({ socketId: socket.id, callsign });
      console.log(`Listener ${callsign} joined room ${roomId}`);
      
      // Send current state and video source to the new listener
      socket.emit('initial_state', {
        ...room.playbackState,
        videoSource: room.videoSource
      });
    }

    // Broadcast updated listener count and list
    io.to(roomId).emit('room_info', {
      broadcaster: room.broadcaster,
      listenerCount: room.listeners.length,
      listeners: room.listeners.map(l => l.callsign),
      videoSource: room.videoSource // Also include current video source
    });
  });

  // Video Source Event (Broadcaster Only)
  socket.on('set_video_source', ({ roomId, videoSource }) => {
    const room = rooms.get(roomId);
    if (room && room.broadcaster?.socketId === socket.id) {
      room.videoSource = videoSource;
      socket.to(roomId).emit('video_source_event', { videoSource });
      console.log(`Room ${roomId}: Video source set to ${videoSource} for ${room.listeners.length} listeners`);
    } else {
      console.warn(`Room ${roomId}: Unauthorized set_video_source attempt by ${socket.id}`);
    }
  });

  // Playback Control Events (Broadcaster Only)
  socket.on('broadcast_play', ({ roomId, currentTime }) => {
    const room = rooms.get(roomId);
    if (room && room.broadcaster?.socketId === socket.id) {
      room.playbackState = {
        playing: true,
        currentTime,
        lastUpdated: Date.now()
      };
      socket.to(roomId).emit('play_event', { currentTime });
      console.log(`Room ${roomId}: Play at ${currentTime}`);
    }
  });

  socket.on('broadcast_pause', ({ roomId, currentTime }) => {
    const room = rooms.get(roomId);
    if (room && room.broadcaster?.socketId === socket.id) {
      room.playbackState = {
        playing: false,
        currentTime,
        lastUpdated: Date.now()
      };
      socket.to(roomId).emit('pause_event', { currentTime });
      console.log(`Room ${roomId}: Pause at ${currentTime}`);
    }
  });

  socket.on('broadcast_seek', ({ roomId, currentTime }) => {
    const room = rooms.get(roomId);
    if (room && room.broadcaster?.socketId === socket.id) {
      room.playbackState.currentTime = currentTime;
      room.playbackState.lastUpdated = Date.now();
      socket.to(roomId).emit('seek_event', { currentTime });
      console.log(`Room ${roomId}: Seek to ${currentTime}`);
    }
  });

  socket.on('broadcast_rate', ({ roomId, playbackRate }) => {
    const room = rooms.get(roomId);
    if (room && room.broadcaster?.socketId === socket.id) {
      room.playbackState.playbackRate = playbackRate;
      socket.to(roomId).emit('rate_event', { playbackRate });
      console.log(`Room ${roomId}: Rate set to ${playbackRate}`);
    }
  });

  socket.on('broadcast_sync_pulse', ({ roomId, currentTime, playing, playbackRate }) => {
    const room = rooms.get(roomId);
    if (room && room.broadcaster?.socketId === socket.id) {
      room.playbackState = {
        playing,
        currentTime,
        playbackRate: playbackRate || room.playbackState.playbackRate || 1,
        lastUpdated: Date.now()
      };
      socket.to(roomId).emit('sync_pulse', room.playbackState);
      console.log(`Room ${roomId}: Sync pulse - playing: ${playing}, time: ${currentTime}, rate: ${playbackRate}`);
    }
  });

  // Listener Request Sync
  socket.on('request_sync', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (room) {
      console.log(`Room ${roomId}: Manual sync requested by ${socket.id}`);
      // 1. Send currently stored state immediately
      socket.emit('initial_state', {
        ...room.playbackState,
        videoSource: room.videoSource
      });
      // 2. Ask broadcaster for a fresh pulse to align everyone
      if (room.broadcaster) {
        socket.to(room.broadcaster.socketId).emit('request_sync_from_listener');
      }
    }
  });

  // WebRTC Signaling (Optional)
  socket.on('signal', ({ roomId, targetSocketId, signalData }) => {
    // If targetSocketId is provided, send to specific socket
    if (targetSocketId) {
      io.to(targetSocketId).emit('signal', {
        from: socket.id,
        signalData
      });
    } else {
      // Otherwise, broadcast to the room (e.g. for initial discovery)
      socket.to(roomId).emit('signal', {
        from: socket.id,
        signalData
      });
    }
  });

  // Network Debug Info
  socket.on('report_metrics', ({ roomId, latency, offset }) => {
    // Collect metrics for debugging/monitoring
    // For now, we just broadcast them to the broadcaster for their dashboard
    const room = rooms.get(roomId);
    if (room && room.broadcaster) {
      io.to(room.broadcaster.socketId).emit('listener_metrics', {
        socketId: socket.id,
        callsign: room.listeners.find(l => l.socketId === socket.id)?.callsign,
        latency,
        offset
      });
    }
  });

  socket.on('disconnecting', () => {
    for (const roomId of socket.rooms) {
      if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        if (room.broadcaster?.socketId === socket.id) {
          room.broadcaster = null;
          io.to(roomId).emit('broadcaster_left');
          console.log(`Broadcaster left room ${roomId}`);
        } else {
          room.listeners = room.listeners.filter(l => l.socketId !== socket.id);
          console.log(`Listener ${socket.id} left room ${roomId}`);
        }
        
        // Broadcast updated info
        io.to(roomId).emit('room_info', {
          broadcaster: room.broadcaster,
          listenerCount: room.listeners.length,
          listeners: room.listeners.map(l => l.callsign)
        });

        // Cleanup empty rooms
        if (!room.broadcaster && room.listeners.length === 0) {
          rooms.delete(roomId);
          console.log(`Room ${roomId} deleted (empty)`);
        }
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Cerebro Sync Backend running on port ${PORT}`);
  console.log(`Accessible at: http://localhost:${PORT}`);
});
