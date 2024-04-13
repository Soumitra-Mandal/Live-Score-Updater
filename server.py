import eventlet
import socketio
from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS  # Import CORS from flask_cors

cache = {}


def getDataFromCache(key):
    return cache[key]


def setDataToCache(key, value):
    cache[key] = value


setDataToCache("score", {"runs": 0, "wickets": 0, "overs": 0, "players": []})

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
    return send_from_directory(".", "static/js/main.e25705e4.js")


@app.route("/style.css")
def style():
    return send_from_directory(".", "static/css/main.b1e2d545.css")


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
@app.route("/update_score", methods=["POST", "GET"])
def update_score():
    if request.method == "GET":
        return getDataFromCache("score")
    if request.is_json:
        data = request.json  # Assuming the data is sent as JSON
        # TODO: process Data
        if data:
            print("Received score update:", data)

            # Store Data in cache
            setDataToCache("score", data)
            # Emit an event to update the score
            sio.emit("update_score", data=data)
            # Success
            return jsonify({"message": "Score updated successfully"})
        else:
            return jsonify({"message": "Score is null"})
    else:
        return jsonify({"message": "Score is not in JSON Format"})


@app.route("/live_feed", methods=["POST", "GET"])
def update_feed():
    if request.method == "GET":
        return getDataFromCache("feed")
    if request.is_json:
        feed = request.json
        if feed:
            print("Received score update:", feed)
            # Store Data in cache
            setDataToCache("feed", feed)
            # Emit an event to update the feed
            sio.emit("update_feed", data=feed)
            # Success
            return jsonify({"message": "Feed updated successfully"})
        else:
            return jsonify({"message": "Feed is null"})
    else:
        return jsonify({"message": "Feed is not in JSON Format"})


if __name__ == "__main__":
    # Wrapping the Socket.IO server with Flask
    app = socketio.WSGIApp(sio, app)

    # Starting the server
    eventlet.wsgi.server(eventlet.listen(("", 5000)), app)
