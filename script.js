const menuPage = document.getElementById("menu");
const uploadPage = document.getElementById("upload");
const fileLooker = document.getElementById("fileLooker");
const questPage = document.getElementById("questionPage");

const output = document.getElementById("output");

const fileInput = document.getElementById("fileInput");
const textInput = document.getElementById("textInput");
const fileOverLay = document.getElementById("fileOverlay");

const getBackFile = document.getElementById("getBackFileLooker");
const getBackUpload = document.getElementById("getBackUpload");
const addButton = document.getElementById("addNewIcon");
const checkButton = document.getElementById("check");
const getBackOnQuest = document.getElementById("getBackToAll");
const testingName = document.getElementById("TestingName");
const questionHead = document.getElementById("questionHead");
const answersHead = document.getElementById("answersTable")
const questNext = document.getElementById("goToNextQu");
const questLast = document.getElementById("goToLastQu");
const showcase = document.getElementById("showcase");
const imageFrame = document.getElementById("imageFrame");
const hablahabla = document.getElementById("hablahabla");
const lkthrall = document.getElementById("lookTroughAll");
const deleteTopicus = document.getElementById("deleteTopicus");
const deleteProgress123 = document.getElementById("deleteProgress");
const exportProgressFile = document.getElementById("exportProgressFile");
const importProgressFile = document.getElementById("importProgressFile");
const importProgressInput = document.getElementById("importProgressInput");
const confirmationOverlay = document.getElementById("confirmationOverlay");
const confirmationBox = document.getElementById("confirmationBox");
const showcaseBar = document.getElementById("showcaseBar");
const darkModeButton = document.getElementById("darkMode");
const WithStar = document.getElementById("WithStar");
const numberShowcase = document.getElementById("numberShowcase");
const slider = document.getElementById("topicsSlider");
const sliderContainer = document.querySelector(".sliderContainer")

const topics = {};
const createdIds = {};
const answerButRef = {};

const dataTable = [];
const imageTable = {};
const subTpcsOfTpcs = [];
let currentId;
let progress;
let staring;
let createdFile;

let tablesCreated = false;

let curName;

let curTopicName;
let onIndex = 0;
let currentMax = 0;
const isCorrect = {};
const curRandom = {};

let darkModeSet = false;

const curQPC = {};
let curOQT;

function calculateQueryState(query) {
	topics[curTopicName].progressData = topics[curTopicName].progressData || {};
	topics[curTopicName].progressData[query] = topics[curTopicName].progressData[query] || [];

	const rep = topics[curTopicName].progressData[query];

	let currentWeight = 0;

	let hasOne = false;
	let countOfTrue = 0;

	for (let i = 0; i < rep.length; i++) {
		hasOne = true;
		const boolen = rep[i];

		if (boolen == "true") {
			currentWeight = currentWeight + 1;
			countOfTrue += 1;
		} else if (boolen == "false") {
			currentWeight = currentWeight - 2;
		}
	}

	return [currentWeight, (countOfTrue/rep.length)];
}

function createQuestionClasses(){
	const QuestionsData = topics[curTopicName].allQuestions;
	const DatabaseData = topics[curTopicName].progressData || [];
	const StarsDataBABA = topics[curTopicName].starsData || [];

	Object.keys(curQPC).forEach(value => delete curQPC[value]);

	curQPC["all"] = QuestionsData;
	curQPC["unknown"] = [];
	curQPC["wrong"] = [];
	curQPC["stars"] = [];

	const invalidValues = ["all", "unknown", "wrong", "stars"];

	if (DatabaseData) {
		for(let i = 0; i < QuestionsData.length; i++) {
			const qData = QuestionsData[i]
			const gotThis = qData["question"];

			const cst = qData["topic"];

			if (cst && cst !== "" && !invalidValues.includes(cst)) {
				curQPC[cst] = curQPC[cst] || [];
				curQPC[cst].push(qData);
			}

			const currentQuery = DatabaseData[gotThis];
			const currentQuery2 = StarsDataBABA[gotThis];

			if (!currentQuery) {
				curQPC["unknown"].push(qData);
			} else {
				const [weight] = calculateQueryState(gotThis);

				if (weight < 0) {
					curQPC["wrong"].push(qData);
				}
			}

			if (currentQuery2) {
				curQPC["stars"].push(qData);
			}
		}
	}

	if (curQPC["unknown"].length == curQPC["all"].length) {
		curQPC["unknown"].length = 0;
	}

	const newStrng = [];
	const buttonIds123 = [];

	const renamer = {
		all: "Všechny otázky",
		unknown: "Neznáme otázky",
		wrong: "Potížisti",
		stars: "S hvězdičkou",
	};

	const newArray = [];

	newArray.push(curQPC["all"]);
	newArray.push(curQPC["unknown"]);
	newArray.push(curQPC["wrong"]);
	newArray.push(curQPC["stars"])

	const order = ["all", "unknown", "wrong", "stars"]

	const icons = {
		all: "",
		unknown: `<img src="icons/question-solid-full.svg" class="icon adaptSizeSecond" alt=""></img>`,
		wrong: `<img src="icons/triangle-exclamation-solid-full.svg" class="icon adaptSizeSecond" alt=""></img>`,
		stars: `<img src="icons/star-solid-full.svg" class="icon adaptSizeSecond" alt=""></img>`,
	};

	const isPastZero = false;

	for (let i = 0; i < newArray.length; i++) {
		if (i > 0) {
			isPastZero = true;
		}
		const key = order[i];
		const data = curQPC[key];
		if (data !== undefined && data.length > 0) {
			newStrng.push(`<button type="button" data-qtp="${key}" id="${key}(FLIDF)" class="button01">
				${icons[key]}
				<div class="textInsideLookin">${renamer[key]}</div>
			</button>`);
			buttonIds123.push(`${key}(FLIDF)`);
		}	
	}

	let done = false;
	Object.keys(curQPC).forEach(value => {
		const data = curQPC[value]
		if (!newArray.includes(data) && data !== undefined && data.length > 0) {
			if (!done) {
				newStrng.push(
					`<div class="subtopicAbove">Podle tématu</div>`
				);
				done = true;
			}
			newStrng.push(`<button type="button" data-qtp="${value}" id="${value}(FLIDF)" class="button01">
				${value}
			</button>`);
			buttonIds123.push(`${value}(FLIDF)`);
		}
	});


	if (newStrng.length > 0) {
		const newString = newStrng.join("");
		lkthrall.innerHTML = newString;

		requestAnimationFrame(() => {
    		window.dispatchEvent(new Event("resize"));
		});

		for (let i = 0; i < buttonIds123.length; i++) {
			const rn123 = buttonIds123[i];

			const newObject = document.getElementById(rn123);
			if (i == 1 && isPastZero) {
				newObject.style.marginTop = "4vh";
			}

			newObject.onclick = function(){
				const QTP = newObject.dataset.qtp;
				curOQT = QTP;
				openAUkNsWR();
			};
		}
	}
}

const observer = new MutationObserver(() => {
    if (fileLooker.style.display === "block") {
        createQuestionClasses();
        createStatBar()
        let fileIdifc;
        for (const vkez in createdIds) {
        	if (createdIds[vkez] == curTopicName) {
        		fileIdifc = vkez;
        		break;
        	}
        }

        saveProgress(fileIdifc, topics[curTopicName].progressData);
        saveStars(fileIdifc, topics[curTopicName].starsData)
    }
});

observer.observe(fileLooker, {
    attributes: true,
    attributeFilter: ["style"]
});

const obs2 = new MutationObserver(() => {
	if (menuPage.style.display === "block") {
		updateTopicsInMenu()
		requestAnimationFrame(() => {
    		window.dispatchEvent(new Event("resize"));
		});
	}
});

obs2.observe(menuPage, {
	attributes: true,
    attributeFilter: ["style"]
});

function createStatBar() {
	const perTopicData = topics[curTopicName].allQuestions;
	const perTopicBasic = topics[curTopicName].progressData;

	const answerObject = {};
	let all = 0;
	let unanswered = 0;
	
	if (perTopicBasic) {
		let right = 0;
		let wrong = 0;
		let unsure = 0;

		for (let i = 0; i < perTopicData.length; i++) {
			const qData = perTopicData[i]
			const gotThis = qData["question"];

			const currentQuery = perTopicBasic[gotThis];

			if (!currentQuery) {
				unanswered += 1;
			} else {
				const [weight, decimal] = calculateQueryState(gotThis);
				if (weight < 0) {
					if (decimal >= 0.5) {
						unsure += 1;
					} else {
						wrong += 1;
					}
				} else {
					right += 1;
				}
			}
		}

		all = right + wrong + unsure + unanswered;

		answerObject["right"] = (right/all) * 100;
		answerObject["wrong"] = (wrong/all) * 100;
		answerObject["unsure"] = (unsure/all) * 100;
		answerObject["unanswered"] = (unanswered/all) * 100;
	} else {
		all = perTopicData.length;
		unanswered = perTopicData.length;
		answerObject["unanswered"] = 100;
	}

	const format = `<div id="" style="
		background-color:;
		position: absolute;
		top:;
		left:;
		width:;
		height:;
		transform: translateY(-50%);">
	</div>`;

	const array = [];
	array.push(answerObject["right"]);
	array.push(answerObject["unsure"]);
	array.push(answerObject["wrong"]);
	array.push(answerObject["unanswered"]);
	
	const order = ["right", "unsure", "wrong", "unanswered"];
	const coloring = {
		right: "green",
		unsure: "orange",
		wrong: "red",
		unanswered: "lightgray"
	}

	const newStringTable = [];
	let lastPos = 0;

	for (let i = 0; i < array.length; i++) {
		const key = order[i];
		const data = answerObject[key] || 0;
		const newFormat = `<div id="" style="
			background-color: ${coloring[key]};
			position: absolute;
			top: 50%;
			left: ${lastPos}%;
			width: ${data}%;
			height: 95%;
			transform: translateY(-50%);">
		</div>`;

		newStringTable.push(newFormat);
		lastPos += data-0.02;
	}

	const newString = newStringTable.join("");
	showcaseBar.innerHTML = newString;

	console.log(all)
	numberShowcase.innerHTML = `${all - unanswered}/${all} zodpovězených otázek`;
}

function openTopic(event){
	const topicName = event.target.dataset.topic;
	testingName.innerText = topicName;
	curTopicName = topicName;
	menuPage.style.display = "none";
	fileLooker.style.display = "block";
}

const transfer = {
	[true]: "green",
	[false]: "red",
}

function assignAnswer(event, everyBut){
	const currentQ = event.target.dataset.question;
	const currentCorrect = event.target.dataset.anscor;
	const rn = event.target.id

	isCorrect[curTopicName] = isCorrect[curTopicName] || {};

	if (isCorrect[curTopicName][currentQ] !== undefined) {
		console.log("This question has already been answered.");
		return; // Stop execution
	}

	isCorrect[curTopicName][currentQ] = currentCorrect;

	answerButRef[curTopicName] = answerButRef[curTopicName] || {};
	answerButRef[curTopicName][currentQ] = answerButRef[curTopicName][currentQ] || {};

	for (let i = 0; i < everyBut.length; i++){
		const cur = everyBut[i];
		const rn2 = cur.id

		const table2 = rn2.split("(Letter_localtor)")
		const curAns2 = table2[0];

		const isThisCor = cur.dataset.anscor;
		if (isThisCor == "true"){
			cur.style.backgroundColor = "green";
			answerButRef[curTopicName][currentQ][curAns2] = "green";
		} else if  (isThisCor == "false") {
			cur.style.backgroundColor = "";
			answerButRef[curTopicName][currentQ][curAns2] = "";
		}
		
	}

	const table = rn.split("(Letter_localtor)");
	const curAns = table[0];

	event.target.style.backgroundColor = transfer[currentCorrect];
	answerButRef[curTopicName][currentQ][curAns] = transfer[currentCorrect];

	topics[curTopicName].progressData = topics[curTopicName].progressData || {};
	topics[curTopicName].progressData[currentQ] = topics[curTopicName].progressData[currentQ] || [];
	topics[curTopicName].progressData[currentQ].push(currentCorrect);
	/*console.log(isCorrect);*/
}

function openAUkNsWR() {
	questPage.style.display = "block";
	fileLooker.style.display = "none";
	curRandom[curOQT] = randomise(curQPC[curOQT]);
	currentMax = curRandom[curOQT].length;
	onIndex = 0;
	isCorrect[curTopicName] = {};
	answerButRef[curTopicName] = {};
	const on = curRandom[curOQT][onIndex];
	createQuestionButtons(on);
	updateSlider();
	questLast.style.opacity = 0.2;
	questNext.style.opacity = 1;

	if (currentMax == 1) {
		questLast.style.opacity = 0.2;
		questNext.style.opacity = 0.2;
	}
}

function updatePageAll(count){
	const on = curRandom[curOQT][onIndex + count];

	const onPlus = curRandom[curOQT][onIndex + count + 1];
	const onMinus = curRandom[curOQT][onIndex + count - 1];
	if (on) {
		questNext.style.opacity = 1;
		questLast.style.opacity = 1;
		onIndex = onIndex + count;
		createQuestionButtons(on);
		updateSlider();

		if (!onPlus) {
			questNext.style.opacity = 0.2;
		}
		if (!onMinus) {
			questLast.style.opacity = 0.2;
		}
	}

	
}

function updatePageByIndex(Index){
	const on = curRandom[curOQT][Index];

	const onPlus = curRandom[curOQT][Index + 1];
	const onMinus = curRandom[curOQT][Index - 1];
	if (on) {
		questNext.style.opacity = 1;
		questLast.style.opacity = 1;
		onIndex = Index;
		createQuestionButtons(on);
		updateSlider();

		if (!onPlus) {
			questNext.style.opacity = 0.2;
		}
		if (!onMinus) {
			questLast.style.opacity = 0.2;
		}
	}

	
}

function updateSlider() {
	if (currentMax !== 1) {
		slider.min = 0;
		slider.max = Math.max(0, currentMax - 1);
		slider.value = onIndex;
		sliderContainer.style.display = "flex";
	} else {
		sliderContainer.style.display = "none";
	}
}

function numberToLetter(num) {
  return String.fromCharCode(num + 64);
}

function createStar() {
	topics[curTopicName].starsData = topics[curTopicName].starsData || {};
	const on = curRandom[curOQT][onIndex]["question"];

	if (topics[curTopicName].starsData[on] == true) {
		WithStar.innerHTML = `<img src="icons/star-solid-full.svg" class="icon sizethree" alt=""></img>`;
	} else {
		WithStar.innerHTML = `<img src="icons/star-regular-full.svg" class="icon sizethree" alt=""></img>`;
	}
}

function createQuestionButtons(on){
	createStar();
	const questionImage = on["question"];

	const withoutMulti = questionImage.split("(multi)")[0];

	const qS = withoutMulti.split("(imgsep)");

	questionHead.innerText = qS[0];

	const hasImage = qS[1]

	if (hasImage) {
		/*console.log(hasImage)*/
		const curURL = topics[curTopicName].images[hasImage];
		/*console.log(curURL)*/
		if (curURL) {
    		imageFrame.innerHTML = `<img src="${curURL}" alt="">`;
    		questionFrame.classList.remove("no-image");
		} else {
    		imageFrame.innerHTML = "";
   		 	questionFrame.classList.add("no-image");
		}
	} else {
		imageFrame.innerHTML = "";
    	questionFrame.classList.add("no-image");
	}

	const curQuestion = on["question"];
	const rightAnswer = Number(on["answer"]);

	const addTable = [];
	const answerNameTable = [];
	for (const key in on){
		const curNumber = Number(key);
		if (Number.isNaN(curNumber)){
			continue;
		} else {
			const letter = numberToLetter(curNumber);
			const answer = on[key];

			const correct = curNumber == rightAnswer;

			answerButRef[curTopicName] = answerButRef[curTopicName] || {};
			answerButRef[curTopicName][curQuestion] = answerButRef[curTopicName][curQuestion] || {};
			const alreadyColor = answerButRef[curTopicName][curQuestion][answer];

			let format;

			if (alreadyColor !== undefined) {
				format = `<button data-anscor="${correct}"
				data-question="${curQuestion}"
				id ="${answer}(Letter_localtor)"
				type="button"
				style="background-color: ${alreadyColor};"
				>${letter}: ${answer}</button>`;

				answerNameTable.push(`${answer}(Letter_localtor)`);
			}

			if (!format) {
				format = `<button data-anscor="${correct}"
				data-question="${curQuestion}"
				id ="${answer}(Letter_localtor)"
				type="button"
				>${letter}: ${answer}</button>`;

				answerNameTable.push(`${answer}(Letter_localtor)`);
			}

			addTable.push(format);
		}
	}
	if (addTable.length > 0){
		const newString = addTable.join("");
		answersHead.innerHTML = newString;

		const buttons = [];
		for (let i = 0; i < answerNameTable.length; i++){
			const rn = answerNameTable[i]
			buttons.push(document.getElementById(rn));
		}
		/*console.log(buttons)*/
		for (let i = 0; i < buttons.length; i ++){
			const current = buttons[i];

			const height = 50/(buttons.length);

			current.style.fontSize = `${height * 0.2}vh`;

			const everyBut = buttons.toSpliced(i, 1);

			const currentQ = current.dataset.question;

			current.onclick = function(event){
				assignAnswer(event, everyBut);
			}
		}
	}
}

function updateTopicsInMenu(){
	const stringsTable = [];
	const nameTable = [];
	console.log(topics);
	for (const variable in topics){
		stringsTable.push(`<button data-topic="${variable}"
			class="button01";
			style = "width: 35vh;
			height: 10vh;
			font-size: 5vh;"
			id = "${variable}(%ID_locator%)">${variable}</button>`);
		nameTable.push(`${variable}(%ID_locator%)`);
	}

	const newString = stringsTable.join("");

	output.innerHTML = newString;

	for (let i = 0; i < nameTable.length; i++){
		const rn = nameTable[i];

		document.getElementById(rn).addEventListener("click", openTopic);
	}
}

let checkIsGreen = false;

function addNewTopic(create) {
	fileInput.value = "";

    topics[curName] = {
        allQuestions: structuredClone(dataTable),
        images: structuredClone(imageTable),
        progressData: structuredClone(progress),
        starsData: structuredClone(staring),
        subtopics: structuredClone(subTpcsOfTpcs)
    };
    createdIds[currentId] = curName;

	dataTable.length = 0;
	subTpcsOfTpcs.length = 0;
	Object.keys(imageTable).forEach(kez => delete imageTable[kez]);

	tablesCreated = false;
	checkIsGreen = false;

	checkButton.innerHTML = `<img src="icons/circle-check-regular-full.svg" id="hablahabla" class="icon sizeseven invert"></img>`

	if (!create) {
		console.log(createdFile, currentId);
		saveZipFile(createdFile, currentId);
	}

	uploadPage.style.display = "none";
	menuPage.style.display = "block";
}

checkButton.addEventListener("click", function(){
	if (checkIsGreen) {
		addNewTopic()
	}
});

function isCheckAvailable(){
	if ((tablesCreated) && (curName) && (!topics[curName]) && (curName !== "")) {
		checkIsGreen = true;

		checkButton.innerHTML = `<img src="icons/circle-check-regular-full.svg" id="hablahabla" class="icon sizeseven"></img>`
	} else {
		checkIsGreen = false;

		checkButton.innerHTML = `<img src="icons/circle-check-regular-full.svg" id="hablahabla" class="icon sizeseven invert"></img>`
	}
}

deleteTopicus.addEventListener("click", function() {
	confirmationOverlay.style.display = "flex";

	confirmationBox.innerHTML = `
		<p style="font-size: 5vh;">Odstranit téma?</p>
		<button type="button" id="confirmOne" class="buttonYes">Ano</button>
		<button type="button" id="cancelOne" class="buttonNo">Ne</button>
	`;

	document.getElementById("confirmOne").onclick = function() {
		delete topics[curTopicName]

		for (const kez in createdIds) {
			if (createdIds[kez] == curTopicName) {
				deleteZip(kez);
				delete createdIds[kez];
			}
		}

		curTopicName = undefined;

		fileLooker.style.display = "none";
		menuPage.style.display = "block";

		confirmationOverlay.style.display = "none";

		console.log(topics, createdIds)

	}
	document.getElementById("cancelOne").onclick = function() {
		confirmationOverlay.style.display = "none";
	}
});

deleteProgress123.addEventListener("click", function() {
	confirmationOverlay.style.display = "flex";

	confirmationBox.innerHTML = `
		<p style="font-size: 5vh;">Odstranit statistiky?</p>
		<button type="button" id="confirmTwo" class="buttonYes">Ano</button>
		<button type="button" id="cancelTwo" class="buttonNo">Ne</button>
	`;

	document.getElementById("confirmTwo").onclick = function() {
		const idsdsfew = getCreatedIdFromName();

		deleteProgress(idsdsfew)
		delete topics[curTopicName].progressData

		fileLooker.style.display = "none";
		fileLooker.style.display = "block";
		confirmationOverlay.style.display = "none";
	}
	document.getElementById("cancelTwo").onclick = function() {
		confirmationOverlay.style.display = "none";
	}
});

exportProgressFile.addEventListener("click", function() {
	const currentBasicData = topics[curTopicName].progressData;
	const currentStarData = topics[curTopicName].starsData;
	const gameId = getCreatedIdFromName();

	const newObject = {
		fileId: gameId,
		progress: currentBasicData,
		stars: currentStarData
	};

	const jsonString = JSON.stringify(newObject, null, 2);

	const blob = new Blob([jsonString], {
		type: "application/json"
	})

	const url = URL.createObjectURL(blob);

	const link = document.createElement("a");
    link.href = url;
    link.download = `progress_${curTopicName}.json`;

    link.click();

    URL.revokeObjectURL(url);
});

WithStar.addEventListener("click", function() {
	topics[curTopicName].starsData = topics[curTopicName].starsData || {};
	const on = curRandom[curOQT][onIndex]["question"];

	if (topics[curTopicName].starsData[on] == true) {
		topics[curTopicName].starsData[on] = false;
		WithStar.innerHTML = `<img src="icons/star-regular-full.svg" class="icon sizethree" alt=""></img>`;
	} else {
		topics[curTopicName].starsData[on] = true;
		WithStar.innerHTML = `<img src="icons/star-solid-full.svg" class="icon sizethree" alt=""></img>`;
	}
});

importProgressFile.addEventListener("click", function() {
	importProgressInput.click();
});

importProgressInput.addEventListener("change", async function() {
	const file = importProgressInput.files[0];

	if (!file) {
		return;
	}

	const fileName = file.name.toLowerCase();
  	if (!fileName.endsWith('.json')) {
    	alert("Chyba: Vybraný soubor nemá příponu .json!");
    	event.target.value = "";
   		return;
  	}

  	const text = await file.text();
  	const obj = JSON.parse(text);

  	const gameId = getCreatedIdFromName();

  	if (gameId !== obj.fileId) {
  		alert("Chyba: Vybraný soubor nepatří k tomuto tématu!");
  		return;
  	};

  	topics[curTopicName].progressData = obj.progress;
	topics[curTopicName].starsData = obj.stars;
  	fileLooker.style.display = "none";
  	fileLooker.style.display = "block";
});

getBackFile.addEventListener("click", function() {
	menuPage.style.display = "block";
	fileLooker.style.display = "none";
});

getBackUpload.addEventListener("click", function() {
	menuPage.style.display = "block";
	uploadPage.style.display = "none";
});

getBackOnQuest.addEventListener("click", function(){
	confirmationOverlay.style.display = "flex";

	confirmationBox.innerHTML = `
		<p style="font-size: 5vh;">Ukončit test?</p>
		<button type="button" id="confirm3" class="buttonYes">Ano</button>
		<button type="button" id="cancel3" class="buttonNo">Ne</button>
	`;

	document.getElementById("confirm3").onclick = function() {
		questPage.style.display = "none";
		fileLooker.style.display = "block";
		confirmationOverlay.style.display = "none";
	}
	document.getElementById("cancel3").onclick = function() {
		confirmationOverlay.style.display = "none";
	}
	
});

addButton.addEventListener("click", function(){
	menuPage.style.display = "none";
	uploadPage.style.display = "block";
});

textInput.addEventListener("input", function(event) {
	curName = event.target.value;
	isCheckAvailable();
});

questNext.addEventListener("click", function(){
	updatePageAll(+1);
});

questLast.addEventListener("click", function(){
	updatePageAll(-1);
});

slider.addEventListener("input", () => {
    updatePageByIndex(Number(slider.value));
});

fileOverLay.addEventListener("click", function(){
	fileInput.click();
});

darkMode.addEventListener("click", function() {
	darkModeSet = !darkModeSet;
	setDarkMode();
});

async function getFileKey(file) {
    const buffer = await file.arrayBuffer();
    const hash = await crypto.subtle.digest("SHA-256", buffer);

    return [...new Uint8Array(hash)]
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

async function loadAZipFile(file, create) {
    try {
        const zip = await JSZip.loadAsync(file);
			/*console.log("Zip loaded successfully")*/

			const promises = [];

		if (tablesCreated) {
			dataTable.length = 0;
			Object.keys(imageTable).forEach(kez => delete imageTable[kez]);
		}

		const idFile = zip.file("FileId.txt");

		if (!idFile) {
			alert("Soubor neobsahuje identifikátor ve formátu FileId.txt!");
			return;
		}

		const gameId = (await idFile.async("text")).trim();

		if (createdIds[gameId]) {
			alert("Soubor již nahrán!");
			return;
		}

		console.log("game id;", gameId);

		const savedProgress = await loadProgress(gameId);

		if (savedProgress) {
			if (!create) {
				alert("Byly nalezeny stávající statistiky!");
			}
    		delete savedProgress.gameId;
    		progress = savedProgress;

		} else {
   			console.log("No previous progress.");
   			progress = undefined;
   		}

   		const savedStars = await loadStars(gameId);

   		if (savedStars) {
   			staring = savedStars.stars
   		} else {
   			staring = undefined;
   		}

		zip.forEach(function (relativePath, zipEntry) {
        	/*console.log("File:", relativePath);*/
        	if (!zipEntry.dir) {
        		if ((relativePath.toLowerCase().endsWith('.csv')) && (relativePath.toLowerCase() == "questions.csv")) {
        			promises.push(createDataTable(zipEntry))
        		} else if (relativePath.startsWith("pictures/")) {
        			if (relativePath.toLowerCase().endsWith(".jpg")) {
        				promises.push(createUrl(zipEntry))
        			} else if (relativePath.toLowerCase().endsWith(".png")) {
        				promises.push(createUrl(zipEntry))
        			}
        			
        			async function createUrl(zipEntry){
        				const blob = await zipEntry.async("blob");

        				const imgURL = URL.createObjectURL(blob);

        				const name = relativePath.replace("pictures/", "");
        					/*showcase.innerHTML =
        					`<img src="${imgURL}">`;*/

        				imageTable[name] = imgURL;
        			}
        		}
        	}
     	});

     	await Promise.all(promises);

     	if (dataTable.length > 0) {
     		console.log("ALL PROMISES FINISHED");
			tablesCreated = true;
			currentId = gameId;
			createdFile = file;
			isCheckAvailable();
			if (create) {
				isCheckAvailable();
				addNewTopic(create);
			}
     	} else {
     		alert("Otázky nebyly nalezeny, nebo jsou ve špatném formátu");
     	}

	} catch (err) {
    	console.error("Error reading zip:", err);
		dataTable.length = 0;
		Object.keys(imageTable).forEach(kez => delete imageTable[kez]);
    }
}

fileInput.addEventListener("change",function () {
	const file = fileInput.files[0];

	if (!file) {
		return;
	}

	const fileName = file.name.toLowerCase();
  	if (!fileName.endsWith('.zip')) {
    	alert("Chyba: Vybraný soubor nemá příponu .zip!");
    	event.target.value = "";
   		return;
  	}

  	loadAZipFile(file)
});

async function createDataTable(zipEntry) {
	const csvFile = await zipEntry.async("string");

	if (!csvFile) {
		return;
	}

	Papa.parse(csvFile, {
		/*encoding: "UTF-8"*/
		complete: function (result) {
			const csvTable = result.data;

			let currentTopic = "";
			const oneCreated = [];

			for (let i = 0; i < csvTable.length; i++) {
				const rn = csvTable[i];

				if (!rn) {
					continue;
				} else if (rn[0].includes("(topic)")) {
					currentTopic = rn[0].split("(topic)")[1];
					continue;
				}
				const arrayLength = rn.length;
				
				const current = {};
				let skip = false;
				for (let k = 0; k < arrayLength; k++) {
					if (rn[k] === ""){
						skip = true;
						break;
					}
					if (k == 0){
						current["question"] = rn[k];
					} else if ( k === arrayLength - 1){
						const curRn = Number(rn[k]);

						if (Number.isNaN(curRn)){
							skip = true;
							break
						} else {
							if ((curRn <= 0) || (curRn >= arrayLength - 1)){
								skip = true;
								break
							} else {
								current["answer"] = rn[k];
							}
						}
					} else {
						current[k] = rn[k];
					}
				}

				if (!skip && currentTopic !== "" && currentTopic !== undefined && currentTopic !== null)  {
					current["topic"] = currentTopic;
					if (!oneCreated.includes(currentTopic)) {
						oneCreated.push(currentTopic);
						subTpcsOfTpcs.push(currentTopic);
					}
					
				}

				if (!skip) {
					dataTable.push(current);
				}
			}
			/*console.log(dataTable);*/
		}
	});
}

function randomise(questions){
	const randomised = randomiseQuestions(questions);
	const fullyRand = shuffleAnswersInsideQuestions(randomised);

	return fullyRand;
}

function randomiseQuestions(questions){ 
    const copy = structuredClone(questions);
    for (let i = copy.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 

        const temp = copy[i];
        copy[i] = copy[j]; 
        copy[j] = temp;
    } 
    
    return copy;
}

function shuffleAnswersInsideQuestions(questions) {
    const copy = structuredClone(questions);

    for (let q of copy) {
        const correctText = q[q.answer];

        const answerKeys = Object.keys(q).filter(key => !isNaN(key));
        const answers = answerKeys.map(key => q[key]);

        for (let i = answers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = answers[i];
            answers[i] = answers[j];
            answers[j] = temp;
        }

        for (let i = 0; i < answers.length; i++) {
            const newKey = String(i + 1); 
            q[newKey] = answers[i];
            
            if (answers[i] === correctText) {
                q.answer = newKey;
            }
        }
    }
    
    return copy;
}

const dbPromise = new Promise((resolve, reject) => {

	const request = indexedDB.open("QuizApp", 4);

	request.onupgradeneeded = (event) => {
		const db = event.target.result;

		if (!db.objectStoreNames.contains("progress")) {
			db.createObjectStore("progress", {
                keyPath: "gameId"
            });
		}

		if (!db.objectStoreNames.contains("StarS")) {
			db.createObjectStore("StarS", {
				keyPath:"fileId"
			});
		}

		if (!db.objectStoreNames.contains("Mode")) {
			db.createObjectStore("DarkMode", {
				keyPath: "darkModeKey"
			});
		}

		if (!db.objectStoreNames.contains("ZipFiles")) {
			db.createObjectStore("ZipFiles", {
				keyPath: "zipId"
			})
		}
	};

	request.onsuccess = (event) => {
		const db = event.target.result;

		/*console.log("IndexedDB ready");*/

		resolve(db);
	};
    request.onerror = (event) => {
        console.error(
            "Could not open IndexedDB:",
            event.target.error
        );

        reject(event.target.error);
    };
});

async function saveDarkMode() {
	const db = await dbPromise;

	return new Promise((resolve, reject) => {
		const transaction = db.transaction("DarkMode", "readwrite");
		const store = transaction.objectStore("DarkMode");

		store.put({
			darkModeKey: "DMK",
			darkModeSet
		});
        transaction.oncomplete = () => {
            resolve();
        };
        transaction.onerror = () => {
            console.error(
                "Could not save current dark mode:",
                transaction.error
            );

            reject(transaction.error);
        };

	}) 

}

async function saveProgress(gameId, progress) {
	const db = await dbPromise;

	return new Promise((resolve, reject) => {
        const transaction = db.transaction("progress","readwrite");
        const store = transaction.objectStore("progress");

        store.put({
            gameId: gameId,
            ...progress
        });

        transaction.oncomplete = () => {
            console.log("Progress saved:", gameId);
            resolve();
        };

        transaction.onerror = () => {
            console.error(
                "Could not save progress:",
                transaction.error
            );

            reject(transaction.error);
        };
	});
}

async function saveStars(fileId, stars) {
	const db = await dbPromise;

	return new Promise((resolve, reject) => {
        const transaction = db.transaction("StarS","readwrite");
        const store = transaction.objectStore("StarS");

        store.put({
        	fileId: fileId,
        	stars
        })

        transaction.oncomplete = () => {
            console.log("starts saved:", fileId);
            resolve();
        };

        transaction.onerror = () => {
            console.error(
                "Could not save starts:",
                transaction.error
            );

            reject(transaction.error);
        };	
	});
}

async function saveZipFile(file, zipId) {
	const db = await dbPromise;

	return new Promise((resolve, reject) => {
        const transaction = db.transaction("ZipFiles","readwrite");
        const store = transaction.objectStore("ZipFiles");

        store.put({
        	zipId: zipId,
        	file: file,
        	curName,
        })

        transaction.oncomplete = () => {
            console.log(".zip saved:", zipId);
            resolve();
        };

        transaction.onerror = () => {
            console.error(
                "Could not save .zip:",
                transaction.error
            );

            reject(transaction.error);
        };	
	});
}

async function loadDarkMode() {
	const db = await dbPromise;
	/*console.log(db)*/

	return new Promise((resolve, reject) => {
		const transaction = db.transaction("DarkMode", "readonly");
		const store = transaction.objectStore("DarkMode");

		const req = store.get("DMK");

		req.onsuccess = () => {
			if (!req.result) {
				resolve(null);
				return;
			}

			resolve(req.result);
		};

		req.onerror = () => {
			reject(req.error);
		}
	});
}

async function loadProgress(gameId) {
	const db = await dbPromise;

	return new Promise((resolve, reject) => {
  		const transaction = db.transaction("progress", "readonly");
  		const store = transaction.objectStore("progress");

  		const request = store.get(gameId);

        request.onsuccess = () => {

            // No progress yet
            if (!request.result) {
                resolve(null);
                return;
            }

            // Existing progress
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
	});
}

async function loadStars(fileId) {
	const db = await dbPromise;

	return new Promise((resolve, reject) => {
  		const transaction = db.transaction("StarS", "readonly");
  		const store = transaction.objectStore("StarS");

  		const request = store.get(fileId);

        request.onsuccess = () => {

            // No progress yet
            if (!request.result) {
                resolve(null);
                return;
            }

            // Existing progress
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
	});
}

async function loadZipFiles() {
	const db = await dbPromise;

	return new Promise((resolve, reject) => {
        const transaction = db.transaction("ZipFiles","readonly");
        const store = transaction.objectStore("ZipFiles");

        const request = store.getAll();

        request.onsuccess = () => {
        	resolve(request.result);
        }
        request.onerror = () => {
        	reject(request.error);
        }
	});
}

async function deleteStars(fileId) {

    const db = await dbPromise;

    return new Promise((resolve, reject) => {

        const transaction = db.transaction("StarS", "readwrite");

        const store = transaction.objectStore("StarS");

        store.delete(fileId);

        transaction.oncomplete = () => {
            console.log("Progress deleted:", fileId);
            resolve();
        };

        transaction.onerror = () => {
        	alert("Odstranění selhalo!");
            reject(transaction.error);
        };
    });

}

async function deleteProgress(gameId) {

    const db = await dbPromise;

    return new Promise((resolve, reject) => {

        const transaction = db.transaction("progress", "readwrite");

        const store = transaction.objectStore("progress");

        store.delete(gameId);

        transaction.oncomplete = () => {
            console.log("Progress deleted:", gameId);
            deleteStars(gameId);
            resolve();
        };

        transaction.onerror = () => {
        	alert("Odstranění selhalo!");
            reject(transaction.error);
        };
    });
}

async function deleteZip(zipId) {
    const db = await dbPromise;

    return new Promise((resolve, reject) => {
        const transaction = db.transaction("ZipFiles", "readwrite");
        const store = transaction.objectStore("ZipFiles");

        const request = store.delete(zipId);

        request.onsuccess = () => {
        	console.log("zip file deleted:", zipId);
        	resolve();
        }
        request.onerror = () => reject(request.error);
    });
}

function getCreatedIdFromName(){
	let ewocafimo;

	for (const kez in createdIds) {
		if (createdIds[kez] == curTopicName) {
			ewocafimo = kez;
			break;
		}
	}
	return ewocafimo;
}

async function loadZipInside(fileName) {
	const response = await fetch(fileName);

	if (!response.ok) {
		throw new Error(`Couldn't load ${fileName}`)
	}

	const blob = await response.blob()

	const file = new File([blob], "math.zip", {
    	type: "application/zip"
	});

	loadAZipFile(file, true);
}

/*curName = "Test1";
loadZipInside("Test1.zip")*/

async function loadDarkModeFromDB() {
	const haveIt = await loadDarkMode();

	if(haveIt) {
		darkModeSet = haveIt.darkModeSet
		setDarkMode();
		console.log("dark mode loaded", darkModeSet)
	} else {
		darkModeSet = false;
		setDarkMode();
	}
}

async function loadAllZipsAtStart() {
	const zips = await loadZipFiles();

    for (const zip of zips) {
        console.log("START ZIP:", zip.zipId);
		menuPage.style.display = "none";

        curName = zip.curName;

        await loadAZipFile(zip.file, true);

        console.log("FINISHED ZIP:", zip.zipId);
    }
}

function setDarkMode() {
	if (darkModeSet) {
		document.documentElement.classList.toggle("dark");
		darkModeButton.innerHTML = `<img src="icons/sun-solid-full.svg" class="icon sizethree" alt=""></img>`
	} else {
		document.documentElement.classList.remove("dark");
		darkModeButton.innerHTML = `<img src="icons/moon-solid-full.svg" class="icon sizethree" alt=""></img>`
	}
	saveDarkMode();
}

loadDarkModeFromDB();
loadAllZipsAtStart();
