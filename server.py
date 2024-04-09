import eventlet
import socketio
from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS  # Import CORS from flask_cors

# Creating a Flask app
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS)

# Creating a Socket.IO server
sio = socketio.Server(cors_allowed_origins="*")


# Serve static files (index.html, script.js, and style.css)
@app.route("/")
def index():
    return send_from_directory(".", "index.html")


@app.route("/script.js")
def script():
    return send_from_directory(".", "static/js/main.09369b4a.js")


@app.route("/style.css")
def style():
    return send_from_directory(".", "static/css/main.a9ad82dd.css")


@app.route("/manifest.json")
def manifest():
    return send_from_directory(".", "manifest.json")


# Defining Socket.IO event handlers
@sio.event
def connect(sid, environ):
    print("connect ", sid)


@sio.event
def disconnect(sid):
    print("disconnect ", sid)


# Handle POST requests
@app.route("/update-score", methods=["POST", "GET"])
def update_score():
    if request.method == "GET":
        return {"name": "soumitra"}
    if request.is_json:
        data = request.json  # Assuming the data is sent as JSON
        # TODO: process Data
        if data:
            print("Received score update:", data)
            # Emit an event to update the score
            sio.emit("update_score", data=data)
            # Success
            return jsonify({"message": "Score updated successfully"})
        else:
            return jsonify({"message": "Score is null"})
    else:
        return jsonify({"message": "Score is not in JSON Format"})


if __name__ == "__main__":
    # Wrapping the Socket.IO server with Flask
    app = socketio.WSGIApp(sio, app)

    # Starting the server
    eventlet.wsgi.server(eventlet.listen(("", 5000)), app)
