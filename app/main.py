from crypt import methods
from flask import Flask, request, render_template
from PIL import Image
import base64
import io
from predictor import ImagePredictor

app = Flask(__name__)

model = ImagePredictor()

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        img_file = Image.open(request.files.get("img_file"))
        data = io.BytesIO()
        img_file.save(data, "JPEG")
        img_data = base64.b64encode(data.getvalue()).decode('utf-8')

        # print(model.predict_from_array(data.getvalue()))

        arr = model.predict_from_array(data.getvalue())
        imgasd = Image.fromarray(arr)
        dater = io.BytesIO()
        imgasd.save(dater, "JPEG")
        img_data = base64.b64encode(dater.getvalue()).decode('utf-8')

        return render_template('index.html', img_data=img_data)
    else:
        return render_template('index.html', img_data=None)

if __name__ == '__main__':
    app.run(debug=True)
