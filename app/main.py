from flask import Flask, request, render_template
from PIL import Image, ImageOps
import base64
from io import BytesIO
import os
import json
from predictor import ImagePredictor

# Silence tensorflow message
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '1'

app = Flask(__name__)

# Load model from ImagePredictor class
model = ImagePredictor()

# Index route that loads the page and processes image input
@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Receive image data from canvas.js and seperate headers
        img_str = str(request.get_data()).split("'")[1]
        
        # Decode image bytes data and open with PIL
        img = Image.open(BytesIO(base64.b64decode(img_str.split(',')[1])))
        
        # Resize image to what the model is expecting and reduce to 1 color
        img = img.resize((28, 28))
        img = ImageOps.grayscale(img)

        # Perform the prediction and retrieve the result
        prediction = model.predict(img)

        # Send the response back
        res = {
            "prediction": prediction
        }

        return json.dumps(res)
    else:
        return render_template('index.html')

if __name__ == '__main__':
    app.run()
