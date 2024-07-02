let points = 0
let round = 0
let angles = [45, 90, 180, 270, 360]
let pickMode = 'random'
let containerButtons
let radius_factor, angle, angle_start, angle_end, factor
let canvas
let level
let containerHeader

function setup() {
	containerHeader = createDiv()
	containerHeader.addClass('center')

	let containerCanvas = createDiv()
	containerCanvas.addClass('center')

	canvas = createCanvas(500, 500)
	canvas.parent(containerCanvas)
	angleMode(DEGREES)
	
	containerButtons = createDiv()
	containerButtons.addClass('buttons')

	setupMenu()

	windowResized()
}

function setupMenu() {
	canvas.attribute('hidden', true)

	let buttonLevel1 = createButton('Level 1')
	buttonLevel1.addClass('button')
	buttonLevel1.parent(containerButtons)
	buttonLevel1.mousePressed(() => {
		level = 1
		loadLevel()
	})

	let buttonLevel2 = createButton('Level 2')
	buttonLevel2.addClass('button')
	buttonLevel2.parent(containerButtons)
	buttonLevel2.mousePressed(() => {
		level = 2
		loadLevel()
	})

	let buttonLevel3 = createButton('Level 3')
	buttonLevel3.addClass('button')
	buttonLevel3.parent(containerButtons)
	buttonLevel3.mousePressed(() => {
		level = 3
		loadLevel()
	})

	let buttonLevel4 = createButton('Level 4')
	buttonLevel4.addClass('button')
	buttonLevel4.parent(containerButtons)
	buttonLevel4.mousePressed(() => {
		level = 4
		loadLevel()
	})
}

function loadLevel() {
	points = 0
	round = 0

	containerHeader.html('')
	let h = createElement('h1', 'Level ' + level)
	h.parent(containerHeader)

	switch (level) {
		case 1:
			angles = [45, 90, 180, 270, 360]
			pickMode = 'random'
			newAngle()
			break
		case 2:
			// 45 - 360 (45er Schritte)
			angles = Array.from({length: 8}, (_, i) => (i + 1) * 45)
			pickMode = 'random'
			newAngle()
			break
		case 3:
			// 15 - 360 (15er Schritte)
			angles = Array.from({length: 24}, (_, i) => (i + 1) * 15)
			pickMode = 'random'
			newAngle()
			break
		case 4:
			// 15 - 360 (15er Schritte)
			angles = Array.from({length: 24}, (_, i) => (i + 1) * 15)
			pickMode = 'order'
			newAngle()
			break
		default:
			console.log('level "', level, '" nicht bekannt');
	}
}

function setupScore() {
	canvas.attribute('hidden', true)
	containerButtons.html('')

	let score = createP(points + '/' + round + '\t' + '(' + Math.round(points / round * 100) + '%)')
	score.parent(containerButtons)

	// Level wiederholen
	let buttonRepeatLevel = createButton('Level wiederholen')
	buttonRepeatLevel.parent(containerButtons)
	buttonRepeatLevel.addClass('button')
	buttonRepeatLevel.mousePressed(() => {
		loadLevel()
	})

	// nächstes Level
	if (points/round >= 0.75 && level < 4) {
		let buttonNextLevel = createButton('nächstes Level')
		buttonNextLevel.parent(containerButtons)
		buttonNextLevel.addClass('button')
		buttonNextLevel.mousePressed(() => {
			level += 1
			loadLevel()
		})
	}
}

function newAngle() {
	canvas.removeAttribute('hidden')
	containerButtons.html('')

	setupAngle()
	drawAngle()
	createAnswers()

	windowResized()
}

function setupAngle() {
	radius_factor = random(width/8, width/2)/width
	angle = random(angles)
	angle_start = random(0, 360)
	angle_end =  angle_start + angle
	factor = random(1, 2)
}

function drawAngle() {
	let radius = width * radius_factor
	
	background(255)
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
	if (pickMode == 'random') {
		answers = [...angles]
		answers.splice(angles.indexOf(angle), 1)
		answers = answers.sort(() => 0.5 - Math.random())
		answers = answers.slice(0, 3)
		answers.push(angle)
		answers.sort(function(a, b) {return a - b})
	} else if (pickMode == 'order') {
		let index = angles.indexOf(angle)
		index -= int(random(4))
		if (index < 0) {
			index = 0
		}
		if (index + 4 > angles.length) {
			index = angles.length - 4
		}
		answers = [...angles]
		answers = answers.splice(index, 4)
	} else {
		console.log('pickMode "', pickMode, '" existiert nicht');
	}

	let buttons = []
	for (let i = 0; i < 4; i++) {
		let answer = answers[i]
		let button = createButton(answer + '°')
		buttons.push(button)
		button.addClass('button')
		button.parent(containerButtons)
		button.mousePressed(() => {
			let correct = answer == angle
			if (correct) {
				points += 1
			}
			round += 1
			for (let j = 0; j < 4; j++) {
				let button = buttons[j]
				button.mousePressed(() => {})
				let answer = answers[j]
				if (answer == angle) {
					button.addClass('green')
				} else if (i == j) {
					button.addClass('red')
				}
			}
			setTimeout(() => {
				if (round == 10) {
					setupScore()
					return
				}
				newAngle()
			}, 2000)
		})
	}
}

function windowResized() {
	let size = min(windowWidth, 500)
	resizeCanvas(size, size)
	drawAngle()
}