const canvas = document.getElementById("canvas");
canvas.height = 280;
canvas.width = 280;

const context = canvas.getContext(
    "2d",
    ((preserveDrawingBuffer = true),
    (desynchronized = true),
    (antialias = true),
    (powerPreference = "high-performance"))
);
context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);

context.lineWidth = 20;

let x1 = null;
let y1 = null;

let click = false;
window.addEventListener("mousedown", (e) => (click = true));
window.addEventListener("mouseup", (e) => (click = false));

window.addEventListener("mousemove", (e) => {
    if (x1 == null || y1 == null || !click) {
        x1 = e.clientX;
        y1 = e.clientY;
        return;
    }

    let x2 = e.clientX;
    let y2 = e.clientY;

    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();

    x1 = x2;
    y1 = y2;
});

let resetBtn = document.querySelector(".reset");
resetBtn.addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
});

let predictBtn = document.querySelector(".predict");
predictBtn.addEventListener("click", () => {
    data = [];
    let img_data = canvas.toDataURL("image/jpeg");
    let img = document.createElement("img");
    img.id = "img_file";

    fetch("/", {
        method: "POST",
        redirect: "follow",
        body: img_data,
    })
        .then((response) => response.json())
        .then((result) => {
            img.src = result.image;
            document.getElementById("body").appendChild(img);
            console.log(result.prediction);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
});
