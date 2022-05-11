// Creates canvas element
const canvas = document.getElementById("canvas");
canvas.height = 280;
canvas.width = 280;

// Sets background to white
const context = canvas.getContext("2d");
context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);

// Configures the drawing pixel size and shape
context.lineWidth = 20;
context.lineCap = "round";

// Placeholders for cursor location
let x1 = null;
let y1 = null;

// Boolean to check if the image has been submitted
let submitted = false;

// Monitors mouse clicks
let click = false;
window.addEventListener("mousedown", (e) => (click = true));
window.addEventListener("mouseup", (e) => (click = false));

// Monitors mouse movement
window.addEventListener("mousemove", (e) => {
    // Gets boundaries for canvas element
    let rect = canvas.getBoundingClientRect();

    // Clear canvas after submission and a click is registered in the box
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

    // Sets initial cursor coordinates with respect to the canvas box
    if (x1 == null || y1 == null || !click) {
        x1 = Math.round(
            ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width
        );
        y1 = Math.round(
            ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height
        );
        return;
    }

    // Updates cursor location while click is registered
    let x2 = Math.round(
        ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width
    );
    let y2 = Math.round(
        ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height
    );

    // Draws the line between points
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();

    // Update starting points
    x1 = x2;
    y1 = y2;
});

// Enabling touch control for mobile
canvas.addEventListener("touchstart", (e) => {
    click = true;
    x1 = null;
    y1 = null;
});
canvas.addEventListener("touchend", (e) => (click = false));
canvas.addEventListener(
    "touchmove",
    function (e) {
        // Prevents scrolling on mobile
        e.preventDefault();
        e.stopPropagation();
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY,
        });
        window.dispatchEvent(mouseEvent);
    },
    false
);

// Clears canvas element
let clearBtn = document.querySelector(".clear");
clearBtn.addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
});

// Checks if canvas is empty to prevent blank submissions
let isEmpty = () => {
    const blank = document.createElement("canvas");
    blank.height = canvas.height;
    blank.width = canvas.width;
    const blankCtx = blank.getContext("2d");
    blankCtx.fillStyle = "white";
    blankCtx.fillRect(0, 0, blank.width, blank.height);
    return canvas.toDataURL() === blank.toDataURL();
};

// Converts canvas into an image and makes a post request to the index route
let predictBtn = document.querySelector(".predict");
predictBtn.addEventListener("click", () => {
    // Only proceed if the canvas is not empty
    empty = isEmpty();
    if (!empty) {
        // Converts canvas to image URL
        let img_data = canvas.toDataURL("image/jpeg");
        // Creates h1 element to store prediction
        let pred = document.createElement("h1");
        pred.id = "pred";

        // Makes post request to transfer the image data to the app
        fetch("/", {
            method: "POST",
            body: img_data,
        })
            .then((response) => response.json())
            .then((result) => {
                // Update h1 element on page with prediction
                pred.innerHTML = result.prediction;
                document.getElementById("pred").innerHTML = pred.innerHTML;
                submitted = true;
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }
});

// Allows for pressing enter or space to classify image
document.addEventListener("keydown", function (event) {
    if (event.code == "Enter" || event.code == "Space") {
        event.preventDefault();
        document.getElementById("predict").click();
    }
});
