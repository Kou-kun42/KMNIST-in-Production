const canvas = document.getElementById("canvas");
canvas.height = 280;
canvas.width = 280;

const context = canvas.getContext("2d");
context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);

context.lineWidth = 20;
context.lineCap = "round";

let x1 = null;
let y1 = null;

let submitted = false;

let click = false;
window.addEventListener("mousedown", (e) => (click = true));
window.addEventListener("mouseup", (e) => (click = false));

window.addEventListener("mousemove", (e) => {
    let rect = canvas.getBoundingClientRect();

    if (
        submitted &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom &&
        click
    ) {
        document.getElementById("clear").click();
        submitted = false;
    }

    if (x1 == null || y1 == null || !click) {
        x1 = Math.round(
            ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width
        );
        y1 = Math.round(
            ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height
        );
        return;
    }

    let x2 = Math.round(
        ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width
    );
    let y2 = Math.round(
        ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height
    );

    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();

    x1 = x2;
    y1 = y2;
});

let clearBtn = document.querySelector(".clear");
clearBtn.addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
});

let isEmpty = () => {
    const blank = document.createElement("canvas");
    blank.height = canvas.height;
    blank.width = canvas.width;
    const blankCtx = blank.getContext("2d");
    blankCtx.fillStyle = "white";
    blankCtx.fillRect(0, 0, blank.width, blank.height);
    return canvas.toDataURL() === blank.toDataURL();
};

let predictBtn = document.querySelector(".predict");
predictBtn.addEventListener("click", () => {
    empty = isEmpty();
    if (!empty) {
        let img_data = canvas.toDataURL("image/jpeg");
        let pred = document.createElement("h1");
        pred.id = "pred";

        fetch("/", {
            method: "POST",
            redirect: "follow",
            body: img_data,
        })
            .then((response) => response.json())
            .then((result) => {
                pred.innerHTML = result.prediction;
                document.getElementById("pred").innerHTML = pred.innerHTML;
                submitted = true;
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }
});

document.addEventListener("keydown", function (event) {
    if (event.code == "Enter" || event.code == "Space") {
        event.preventDefault();
        document.getElementById("predict").click();
    }
});
