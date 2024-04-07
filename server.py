import eventlet
import socketio
from flask import Flask, send_from_directory, request, jsonify

# Creating a Flask app
app = Flask(__name__)

# Creating a Socket.IO server
sio = socketio.Server()


# Serve static files (index.html, script.js, and style.css)
@app.route("/")
def index():
    return send_from_directory(".", "index.html")


@app.route("/script.js")
def script():
    return send_from_directory(".", "script.js")


@app.route("/style.css")
def style():
    return send_from_directory(".", "style.css")


# Defining Socket.IO event handlers
@sio.event
def connect(sid, environ):
    print("connect ", sid)


@sio.event
def my_message(sid, data):
    print("message ", data)


@sio.event
def disconnect(sid):
    print("disconnect ", sid)


# Handle POST requests
@app.route("/update-score", methods=["POST"])
def update_score():
    data = request.json  # Assuming the data is sent as JSON
    # TODO: process Data
    print("Received score update:", data)
    sio.emit("update_score", data=data)
    # Success
    return jsonify({"message": "Score updated successfully"})


if __name__ == "__main__":
    # Wrapping the Socket.IO server with Flask
    app = socketio.WSGIApp(sio, app)

    # Starting the server
    eventlet.wsgi.server(eventlet.listen(("", 5000)), app)
