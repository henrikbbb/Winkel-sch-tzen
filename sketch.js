let points = 0
// let angles = [45, 90, 180, 270, 360]
let angles = Array.from({length: 24}, (_, i) => (i + 1) * 15);
let containerAnswers
let containerFeedback
let last_timeout_id
let radius_factor, angle, angle_start, angle_end, factor

function setup() {
	createCanvas(500, 500)
	angleMode(DEGREES)
	
	
	containerAnswers = createDiv()

	newAngle()

	windowResized()

}

function newAngle() {
	containerAnswers.html('')

	setupAngle()
	drawAngle()
	createAnswers()
}

function setupAngle() {
	radius_factor = random(100, width/2)/width
	angle = random(angles)
	angle_start = random(0, 360)
	angle_end =  angle_start + angle
	factor = random(1, 2)
}

function drawAngle() {
	background(255)

	let radius = width * radius_factor
	
	fill(225)
	strokeWeight(2)
	stroke(0)
	arc(width/2, height/2, 2*radius, 2*radius, angle_start, angle_end, PIE)

	let length = radius * factor
	x = cos(angle_start) * length + width/2
	y = sin(angle_start) * length + height/2
	line(width/2, height/2, x, y)
	x = cos(angle_end) * length + width/2
	y = sin(angle_end) * length + height/2
	line(width/2, height/2, x, y)

	strokeWeight(4)
	point(width/2, height/2)
}

function createAnswers() {
	// gib 4 Antwortmöglichkeiten aus, darunter die richtige Antwort
	answers = [...angles]
	answers.splice(angles.indexOf(angle), 1)
	answers = answers.sort(() => 0.5 - Math.random())
	answers = answers.slice(0, 3)
	answers.push(angle)
	answers.sort(function(a, b) {return a - b})

	let buttons = []

	containerAnswers.addClass('answers')
	for (let i = 0; i < 4; i++) {
		let answer = answers[i]
		let button = createButton(answer + '°')
		buttons.push(button)
		button.addClass('answer')
		button.parent(containerAnswers)
		button.mousePressed(() => {
			let correct = answer == angle
			if (correct) {
				points += 1
			}
			for (let j = 0; j < 4; j++) {
				let button = buttons[j]
				let answer = answers[j]
				if (answer == angle) {
					button.addClass('green')
				} else if (i == j) {
					button.addClass('red')
				}
			}
			last_timeout_id = setTimeout(() => {
				newAngle()
			}, 3000)
		})
	}
}

function windowResized() {
	let size = min(windowWidth, 500)
	resizeCanvas(size, size)
	drawAngle()
  }