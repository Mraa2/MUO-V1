const iconGetNext = document.querySelector('.iconGetNext');
const iconGetBack2 = document.querySelector('.iconGetBack2');

const fillerBox = document.querySelector(".fillerBox");
const fileBox = document.querySelector(".fileBox");

const questionHeadClass = document.querySelector(".questionHeadClass");

const p1 = 83;
const p2 = 11.5;
const wf1 = 50;
const hf1 = 7;
const h2 = 9;

function getAspect() {
	const width = window.innerWidth;
	const height = window.innerHeight;

	return width/height;
}

function getResize(ratio, sens, inv){
	if (!inv){
		return ((ratio - 1)*sens);
	} else {
		return ((1 - ratio)*sens);
	}
	
}

function updateArrowsRelative(){
	const sensitivity = 2;

	const aspectRatio = getAspect();
 	const finalLeftVw = getResize(aspectRatio, sensitivity);

	iconGetNext.style.left = `${p1 + finalLeftVw}vw`;
	iconGetBack2.style.left = `${p2 + finalLeftVw}vw`;
}

function updateFieldSize(){
	const aspect = getAspect();

	const sensitivity = 20;
	const sens2 = 3.5;
	const sens3 = 6;

	const sizing = getResize(aspect, sensitivity, true);
	const siz2 = getResize(aspect, sens2);
	const siz3 = getResize(aspect, sens3);
	const siz4 = getResize(aspect, sens2, true)

	
	const buttons01 = document.querySelectorAll(".button01");
	buttons01.forEach(button01 => {

		button01.style.width = `${wf1 + sizing}vw`;
		button01.style.height = `${hf1 + siz2}vh`;
		button01.style.fontSize = `${(hf1 + siz2)*0.55}vh`;
		button01.style.borderRadius = `${(hf1 + siz2)*0.25}vh`;
	});

	const textILook = document.querySelectorAll(".textInsideLookin");
	textILook.forEach(each => {
		
		if (each.innerHTML !== "Všechny otázky") {
			each.style.marginLeft = `${(wf1 + sizing)*0.2}vw`;
			each.style.fontSize = `${(hf1 + siz2)*0.45}vh`;
		} else {
			each.style.marginLeft = `0vw`;
			each.style.textAlign = "center";
			each.style.fontSize = `${(hf1 + siz2)*0.55}vh`;
		}
	});

	const iconILook = document.querySelectorAll(".iconInsideLookin");
	iconILook.forEach(eacher => {
		eacher.style.fontSize = `${(hf1 + siz2)*0.55}vh`;
		eacher.style.marginRight = `${(wf1 + sizing) * 0.8}vw`;
	})
	
	fillerBox.style.width = `${wf1 + sizing}vw`;
	fillerBox.style.height = `${hf1 + siz2}vh`;
	fillerBox.style.fontSize = `${(hf1 + siz2)*0.5}vh`;
	if (aspect > 1) {
		questionHeadClass.style.fontSize = `${h2 * 0.5}vh`;
	} else if (aspect <= 1 && aspect >= 0.6) {
		questionHeadClass.style.fontSize = `${(h2 + siz3)*0.5}vh`;
	} else {
		questionHeadClass.style.fontSize = `${(h2 + siz3)*0.6}vh`;
	}
}

updateArrowsRelative();
updateFieldSize();

window.addEventListener("resize", function(){
	updateArrowsRelative();
	updateFieldSize();
});
	
