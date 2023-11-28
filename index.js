import bag from './lang.js';
const selectBag = document.querySelectorAll("select");

for(let k in bag){

    let select;

    if(bag[k] === "Hindi"){
        select = "selected";
        const option = `<option value=${k} ${select}>${bag[k]}</option>`;
        selectBag[1].insertAdjacentHTML("beforeend" , option);
        const option2 = `<option value=${k}>${bag[k]}</option>`;
        selectBag[0].insertAdjacentHTML("beforeend" , option2);
    }else{
        const option = `<option value=${k}>${bag[k]}</option>`;
        selectBag[0].insertAdjacentHTML("beforeend" , option);
        selectBag[1].insertAdjacentHTML("beforeend" , option);
    }
    
    
    
}


const from = document.querySelector(".text-box-from textarea");
const to = document.querySelector(".text-box-to textarea");
const btn = document.querySelector("button");

btn.addEventListener("click" , ()=>{
    
    const dataFrom = from.value;
    const fromCode = selectBag[0].value;
    const toCode = selectBag[1].value;
    if(!dataFrom){
        alert("Kindly add data first");
        return;
    }
    to.setAttribute("placeholder" , "wait , I am translating ......");
    fetch(`https://api.mymemory.translated.net/get?q=${dataFrom}&langpair=${fromCode}|${toCode}`)
        .then(promiseObj=>{
            if(promiseObj.ok){
                return promiseObj.json();
            }else{
                throw new Error("Either API or network issue .....");
            }
        })
        .then(obj=>{
            // console.log(obj);
            const toText = obj.responseData.translatedText;
            to.value=toText;
            to.setAttribute("placeholder" , "Translate");
        })
        .catch(e=>{
            console.log(e);
            alert("Something went wrong ....");
        })
    
})

const arrow = document.querySelector(".arrow");
arrow.addEventListener("click" , ()=>{
    // exchanging the screen data
    let temp = from.value;
    from.value = to.value;
    to.value = temp;

    // exchanging the select value
    let tempValue = selectBag[0].value;
    selectBag[0].value = selectBag[1].value;
    selectBag[1].value = tempValue;

    
});

let iconsBag = document.querySelectorAll("i");
iconsBag = Array.from(iconsBag);
// console.log(iconsBag);
iconsBag.forEach(ele=>{
    ele.addEventListener("click" , ({target})=>{
        if(target.classList.contains("speaker")){
            let utterVoice;
            if(target.id == "from"){
                utterVoice = new SpeechSynthesisUtterance(from.value);
                // utterVoice.lang = selectBag[0].value;
                const index = selectBag[0].options.selectedIndex;
                utterVoice.lang = selectBag[0].options[index].value;
                // console.log(selectBag[0].options[index].value);

            }else{
                utterVoice = new SpeechSynthesisUtterance(to.value);
                // utterVoice.lang = selectBag[1].value;
                const index = selectBag[1].options.selectedIndex;
                utterVoice.lang = selectBag[1].options[index].value;
            }
            speechSynthesis.speak(utterVoice);
        }else if(target.classList.contains("copy")){
            if(target.id === "from"){
                navigator.clipboard.writeText(from.value);
            }else{
                navigator.clipboard.writeText(to.value);
            }
        }
    })
})
