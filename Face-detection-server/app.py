from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import cv2
import numpy as np
from keras.models import load_model

app = Flask(__name__)
cors = CORS(app, resources={r"/detect_face": {"origins": "http://localhost:5173"}})

# Load model
model = load_model('D:/FERAS/ml-server/best_model.h5')
labels = ['5022201219', '5022201133', '5022201125','5022201263','5022201264', '5022201043']

def preprocess_image(image):
    # konversi gambar ke citra grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    #deteksi wajah menggunakan haarcascade
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)
    
    # Jika wajah ditemukan, crop wajah dan resize ke 50x50 pixel
    if len(faces) > 0:
        x, y, w, h = faces[0]
        face_roi = gray[y:y+h, x:x+w]
        processed_image = cv2.resize(face_roi, (50, 50))
        processed_image = np.expand_dims(processed_image, axis=-1)
        return processed_image
    else:
        return None

@app.route('/detect_face', methods=['POST'])
@cross_origin(origin='http://localhost:5173', supports_credentials=True)
def detect_face():
    if 'image' not in request.files:
        return jsonify({'error': 'No image found'}), 400
    
    image_file = request.files['image']
    
    # membaca gambar
    image = cv2.imdecode(np.frombuffer(image_file.read(), np.uint8), cv2.IMREAD_COLOR)

    # pengecekan gambar apakah sudah masuk ke dalam server
    if image is None:
        return jsonify({'error': 'Invalid image'}), 400

    # pra-proses gambar yang masuk dengan memanggil fungsi preproses
    processed_img = preprocess_image(image)

    # Jika tidak ada wajah yang terdeteksi, kembalikan error
    if processed_img is None:
        return jsonify({'error': 'No face detected in the image'}), 400

    # prediksi gambar
    prediction = model.predict(np.array([processed_img]))

    # mengambil label dengan nilai probabilitas tertinggi
    predicted_index = np.argmax(prediction)
    predicted_label = labels[predicted_index]
    confidence = prediction[0][predicted_index] * 100

    # jika nilai probabilitas < 90, maka label = N/A
    if confidence < 90:
        predicted_label = "N/A"

    # memberi respon berupa label yang diprediksi
    response = jsonify({'label': predicted_label})
    return response, 200

if __name__ == '__main__':
    app.run(debug=True)
