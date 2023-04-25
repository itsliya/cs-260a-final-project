const url = "https://api.openai.com/v1/chat/completions";
const bearer = 'Bearer ' + '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'

function generate(elementList){
    console.log("pressed generate button!")

    var items = ""
    for (let i = 0; i < elementList.length; i++){
        items += elementList[i].textContent + ", "
    }
    const sentence = "Can you give me one best brand for " + items + "in United States? In one word and use comma to split"

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
            console.log(output)
            var rawAnswers = output.choices[0].message.content.split(",")
            for (let i = 0; i < elementList.length; i++){
                elementList[i].textContent = rawAnswers[i].trim().replace(".", "").replace(":", " - ")
            }
        })
        .catch(error => console.log(error));
}

function generateButtonHandler(){
    var elementList = document.getElementsByClassName("form-check-label")
    generate(elementList)
}

const generateButton = document.getElementById("generate-button")
generateButton.addEventListener("click", generateButtonHandler)