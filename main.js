let files = []

async function savePhoto(inp)
{
    let formData = new FormData();
    let photo = inp.files[0];

    formData.append("file", photo);

    const ctrl = new AbortController()    // timeout
    setTimeout(() => ctrl.abort(), 5000);

    try {
        await fetch('http://localhost:8080/upload',
            {method: "POST", body: formData, signal: ctrl.signal});
        await addImage(photo)
        files.push(photo.name)
    } catch(e) {
        console.error(e);
    }

}

async function addImage(photo) {
    const fr = new FileReader();
    fr.onload = function () {
        let elem = document.createElement("img")
        elem.setAttribute("src", this.result);
        elem.setAttribute("height", "32px");
        elem.setAttribute("width", "32px");
        elem.setAttribute("alt", "collage-photo");
        elem.setAttribute("object-fit", "contain");
        elem.setAttribute("style", "margin-bottom: 1rem;")
        document.getElementById("images").appendChild(elem)
    };
    fr.readAsDataURL(photo);
}


window.onload = function () {
    document.getElementById("make-collage").onclick = function () {
        let data = {"files": files};
        data["direction"] = document.querySelector('input[name="direction"]:checked').value === 'horizontal' ? "H" : "V";
        data["border"] = parseInt(document.getElementById("border").value)
        data["color"] = document.getElementById("color").value
        try {
            fetch('http://localhost:8080/make-collage',
                {method: "POST", headers: {
                        'Content-Type': 'application/json'
                    }, body: JSON.stringify(data)}).then((response) => response.blob())
                .then((blob) => window.URL.createObjectURL(blob)).then((url) => {
                let elem = document.createElement("img")
                elem.setAttribute("src", url);
                elem.setAttribute("alt", "result-photo");
                elem.setAttribute("style", "margin-bottom: 1rem;")
                document.getElementById("result").appendChild(elem)
            })
        } catch(e) {
            console.error(e);
        }
    }

}