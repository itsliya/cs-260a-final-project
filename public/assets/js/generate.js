const url = "https://api.openai.com/v1/chat/completions";
const bearer = 'Bearer ' + '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'

const indexList = [0, 1, 2, 3]
const shopList = ["Safeway", "Wholefoods", "Traderjoes", "BerkeleyBowl"]
const shopImgList = ["./assets/img/safeway_logo.png", "./assets/img/whole_foods_logo.png", "./assets/img/trader_joes_logo.png", "./assets/img/berkeley_bowl_logo.png"]

const sampleSize = ([...arr], n = 1) => {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr.slice(0, n);
};

function generate(elementList){
    console.log("pressed generate button!")

    var items = ""
    for (let i = 0; i < elementList.length; i++){
        var eleName = elementList[i].id.split("-")[0].trim()
        items += eleName + ", "
    }
    const sentence = "Can you give me one popular brand for " + items + "in United States? Use comma to split."

    console.log(sentence)
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': bearer
        },
        body: JSON.stringify({
            'model': "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": sentence}],
            'temperature': 0.7
        })
    })
        .then(response => response.json())
        .then(output => {
            console.log(output.choices[0].message.content)
            var rawAnswers = output.choices[0].message.content.split('\n').join(', ').split(';').join(', ').split(', ')
            changeComponent(elementList, rawAnswers)
        })
        .then(() => {
                document.getElementById("co2").innerHTML = "Total CO2: 1.6 kg"
                document.getElementById("price").innerHTML = "Total Price: $341.56"   
            }     
        )
        .catch(error => console.log(error));
}

function changeComponent(elementList, rawAnswers){
    for (let i = 0; i < elementList.length; i++){
        var eleName = elementList[i].id.split("-")[0].trim()
        var quantity = parseInt(document.getElementById(eleName+"-quantity").value)
        var shopIndex = sampleSize(indexList, 1)[0]
        var shopName = shopList[shopIndex]
        var shopImg = shopImgList[shopIndex]
        // generate answer
        var answer = eleName
        try {
            answer = rawAnswers[i].trim().replace(".", "").replace(":", " - ").replace(",", "")
            if(answer.length > 40){
                answer = eleName + " - " + shopName
            }
        } catch(e) {
            answer = eleName + " - " + shopName
        }
        // first get the element
        var element = document.querySelector(`#listContainer #${eleName}-item`)
        // Then modify the element
        element.id = eleName+"-item"
        element.className = "item"
        element.style.width = "100%"
        element.innerHTML = `<div class="product-card">\
                                <span>\
                                    <img class="product-card-img" src="assets/img/eggs.jpg" width="100px" height="100px" alt="Card image cap">\
                                </span>\
                                <span class="product-card-content">\
                                    <div class="product-card-title form-check-label">${answer}</div>\
                                    <div class="product-card-info">\
                                        <img src=${shopImg} width="30px" height="30px"/>\
                                        <img style="margin-left: 10px" src="./assets/img/featured-product-logos.png" height="20px"/>\
                                    </div>\
                                    <div class="product-card-quant">\
                                        <div style="width: 100px; margin-left: 85px">\
                                            <input type="button" value="-" id="${eleName}-minus" onclick="minusItem(this)" class="button-minus border rounded-circle  icon-shape icon-sm mx-1 " data-field="quantity">\
                                            <input type="number" style="width: 20px" id="${eleName}-quantity" step="1" max="10" value="${quantity}" name="quantity" class="border-0 text-center">\
                                            <input type="button" value="+" id="${eleName}-minus" onclick="plusItem(this)" class="button-plus border rounded-circle icon-shape icon-sm " data-field="quantity">\
                                        </div>\
                                    </div>\
                                </span>\
                            </div>`
    }
}

function generateButtonHandler(){
    var elementList = document.getElementsByClassName("item");
    generate(elementList)
}

const generateButton = document.getElementById("generate-button")
generateButton.addEventListener("click", generateButtonHandler)