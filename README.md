# ChatApp

A real-time messaging application built with the MERN stack (MongoDB, Express, React, Node.js) and WebRTC for video and audio calling. This chat application allows users to chat, make audio/video calls, send messages, and share media in a secure and user-friendly environment.

## Features

- **Real-time Messaging**: Send and receive messages instantly using Socket.IO.
- **Audio & Video Calls**: Make and receive real-time audio/video calls using WebRTC.
- **User Authentication**: Secure user login/signup with email and JWT.
- **Contact Management**: Add, and manage contacts with custom names.
- **Avatar Upload**: Set and update your profile picture in the app.
- **Typing Indicators**: Shows when a user is typing a message.
- **Online Status**: Track the online status of contacts in real time.
- **Group Chats**: Create and manage group chats with multiple members.
- **Push Notifications**: Get notified for incoming calls.

## Technologies Used

- **Frontend**: React.js, Tailwind CSS, WebRTC, Socket.IO
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT (JSON Web Tokens).
- **Real-time Communication**: Socket.IO for message delivery, WebRTC for calls
- **Deployment**: Deployed on GitHub and can be hosted on platforms like Heroku or DigitalOcean.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/nurrahman2001/ChatApp.git
    cd ChatApp
    ```

2. Install dependencies:

    For the backend:
    ```bash
    cd server
    npm install
    ```

    For the frontend:
    ```bash
    cd client
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the `server` directory with the necessary environment variables, such as:

    ```env
    JWT_SECRET=your_jwt_secret
    ```
4. Run the application:

    For the backend:
    ```bash
    cd server
    npm start or node index.js
    ```

    For the frontend:
    ```bash
    cd client
    npm run dev
    ```

5. Open the app in your browser:
    Visit `http://localhost:5173` to see the chat application in action.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

