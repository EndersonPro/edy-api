from flask import Flask, jsonify, request
from flask_cors import CORS
import pafy
import json

app = Flask(__name__)
CORS(app)


@app.route("/api/<string:url>", methods=['GET'])
def apiedy(url):
    video = pafy.new(url)
    data = {'data':
            {
                'titulo': video.title,
                'imagen': video.thumb,
                'duracion': video.duration,
                'videostream': [],
                'audiostream': [],
            }
            }

    for stream in video.streams:
        data['data']['videostream'].append(
            {
                'resolucion': str(stream.resolution),
                'extencion': str(stream.extension),
                'tamano': str(stream.get_filesize()),
                'url': str(stream.url),
            })

    for audiostream in video.audiostreams:
        data['data']['audiostream'].append(
            {
                'bitrate': str(audiostream.bitrate),
                'extencion': str(audiostream.extension),
                'tamano': str(audiostream.get_filesize()),
                'url': str(audiostream.url)
            })

    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
