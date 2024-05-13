let icon = { 
	success: 
	'<span class="material-symbols-outlined">task_alt</span>', 
	danger: 
	'<span class="material-symbols-outlined">error</span>', 
	warning: 
	'<span class="material-symbols-outlined">warning</span>', 
	info: 
	'<span class="material-symbols-outlined">info</span>', 
}; 

export function showToast( 
	message = "Sample Message", 
	toastType = "info", 
	duration = 3000) { 
	if ( 
		!Object.keys(icon).includes(toastType)) 
		toastType = "info"; 

	let box = document.createElement("div"); 
	box.classList.add( 
		"toast", `toast-${toastType}`); 
	box.innerHTML = ` <div class="toast-content-wrapper"> 
					<div class="toast-icon"> 
					${icon[toastType]} 
					</div> 
					<div class="toast-message">${message}</div> 
					<div class="toast-progress"></div> 
					</div>`; 
	duration = duration || 5000; 
	box.querySelector(".toast-progress").style.animationDuration = 
			`${duration / 1000}s`; 

	let toastAlready = 
		document.body.querySelector(".toast"); 
	if (toastAlready) { 
		toastAlready.remove(); 
	} 

	document.body.appendChild(box)
};

export function fillProgressCircle(element, percentage) {

    // Get the progress circle element.
    const circleFill = document.getElementById(`circle-fill-${element}`);
	const progressPercent = document.getElementById(`progress-percent-${element}`);

	// Updating the progress circle based on the percentage.
	progressPercent.innerHTML = percentage + "%";
	if (percentage === 0){
		circleFill.style.display = "none";
	}
	else {
		circleFill.style.display = "block";
		circleFill.style.strokeDashoffset = 242 - (242 * (percentage / 100));
	}
}
