from crypt import methods
from flask import Flask, request, render_template
from PIL import Image, ImageOps
import base64
from io import BytesIO
import json
from predictor import ImagePredictor

app = Flask(__name__)

model = ImagePredictor()

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        img_str = str(request.get_data()).split("'")[1]
        img = Image.open(BytesIO(base64.b64decode(img_str.split(',')[1])))
        img = img.resize((28, 28))
        img = ImageOps.grayscale(img)
        img_data = BytesIO()
        img.save(img_data, "JPEG")
        img_url = "data:image/jpeg;base64,"
        img_url += base64.b64encode(img_data.getvalue()).decode('utf-8')

        prediction = model.predict(img)

        res = {
            "image": img_url,
            "prediction": prediction
        }

        return json.dumps(res)
    else:
        return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
