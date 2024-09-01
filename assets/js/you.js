	//actually i just wanted to play around with width and height of drawing pad
	//computer art on mousepad is difficult, so i think smaller is cuter and better!
	let width = Math.min(400, screen.height - document.getElementById("sketchpad-home").getBoundingClientRect().top - 100);
	let height = width;

	$("#art_wall_img").attr("width", width);
	$("#art_wall_img").attr("width", height);
	$("#sketchpad").attr("width", width);
	$("#sketchpad").attr("width", height);

	const canvas = document.getElementById('sketchpad');

	const sketchpad = new Atrament(canvas, {
		width: width,
		height: height,
		color: '#ffbf47', //orange
		weight: 0
	});

	 //change opacity based on input of opacity slider
	 var opacity = document.getElementById("opacity_slider");
	 opacity.oninput = function() {
		 sketchpad.opacity = opacity.value/100;
	 }

	 //change thickness based on input of thickness slider
	 var thickness = document.getElementById("thickness_slider");
	 thickness.oninput = function() {
		 sketchpad.weight = thickness.value*2;
	 }

	function isPrimeModified(value) {
			//so more row based
			//taking largest factor so more squares per row - horizontal looking
	    for(var i = value-1; i > 1; i--) {
	        if(value % i === 0) {
	            return i;
	        }
	    }
			return value;
	}

	class paletteCanvas {
		constructor(i) {
			//taking first element out cuz it's name of place
			let color_array = colors[i];
			let color_info = color_array[0];
			let color_contributor = color_array[1];
			//first get rid of the text
			color_array.shift();
			//then get rid of the author, so only color arrays left
			color_array.shift();
			//if length of color_array is prime, just have 1 row
			//get first largest factor of the number of colors
			let boxes_per_row = isPrimeModified(color_array.length);
			//get the number of rows by dividing by the number of columns
			let num_rows = color_array.length/boxes_per_row;
			// console.log("~~~~~~~");
			// console.log(num_rows);
			// console.log(boxes_per_row);
			// console.log(color_array.length);
			// console.log("~~~~~~~");
			let palette_canvas = document.getElementsByClassName('palette')[i];
			//correct
			let box_width = 300/7;
			let ctx = palette_canvas.getContext('2d');
			let boundaries = {};

			palette_canvas.setAttribute("height", box_width*num_rows);
			palette_canvas.setAttribute("width", box_width*boxes_per_row);
			ctx.strokeStyle = "black";

			//for each color
			for (let i = 0; i < color_array.length/boxes_per_row; i++) { //number of rows
				let y = box_width*i; //each y line
				ctx.moveTo(0, y+box_width);
				ctx.lineTo(box_width*boxes_per_row, y+box_width);
				ctx.stroke();
				for (let j = 0; j < boxes_per_row; j++) { //number of boxes per row
					let k = i*boxes_per_row + j; //index in unrolled colors
					ctx.fillStyle = color_array[k][0];
					let x = box_width*j; //each x line
					ctx.fillRect(x, y, box_width, box_width);

					//draw black square around the colorful palette box
					ctx.moveTo(x+box_width, y);
					ctx.lineTo(x+box_width, y+box_width);
					ctx.stroke();

					//shortcut? to finding which box i'm in later when clicking palette??
					//4 points can be generated
					let x0 = x;
					let y0 = y;
					let x1 = x + box_width;
					let y1 = y + box_width;
					console.log("original coords");
					console.log(x0);
					console.log(y0);
					console.log(x1);
					console.log(y1);
					console.log("-------");
					boundaries[k] = [x0, y0, x1, y1];

				}
			}

			//draw the inside box boundaries for the palette in black 1 px ??
			//nah

			//bind event listener so change color of drawing with click
			palette_canvas.onclick = function(e) {
					//change text of palette_info, the overall palette description
					$("#palette_info").html(color_info);
					$("#palette_contributor").html(color_contributor);
					console.log("client_x: " + e.clientX + " client_y: " + e.clientY);
					console.log("offset_x: " + palette_canvas.offsetLeft + " offset_y: " + palette_canvas.offsetTop);
					let canvas_coords = document.getElementById("palette_"+i).getBoundingClientRect();
					let mouse_x = e.clientX - canvas_coords.left, //yah i don't even know
							mouse_y = e.clientY - canvas_coords.top;
					console.log("mouse_x:" + mouse_x + " mouse_y:" + mouse_y)

					let boundary_check = Object.values(boundaries);
					for (var key in boundaries) {
						console.log(key);
						let x0 = parseFloat(boundaries[key][0]);
						let y0 = parseFloat(boundaries[key][1]);
						let x1 = parseFloat(boundaries[key][2]);
						let y1 = parseFloat(boundaries[key][3]);
						//within box
						if (((x1 - 0) > mouse_x) && ((mouse_x - 0) > x0) && (y1 > mouse_y) && (mouse_y > y0)) {
							//important part, switching color
							console.log("color should switch");
							sketchpad.color = color_array[key][0];
							$("#color_description").html(color_array[key][1]);							
						}
					}
				};
		}
	}


  //no color picker, filling palette per entry in colors
	//goes across right left down right left down
	//[palette inspiration, palette contributor, [hex code, text description]..]
	let colors = [
		["Grapefruit Soju",
		  "monicat_xcx",
		 ["#ff485e", "bottle cap"],
		 ["#52a832", "bottle"],
		 ["black", "letters (Korean)"],
		 ["white", "label"]],
		["Sunnyvale, California",
		  "monicat_xcx",
		 ["#91e7ff", "sky"],
		 ["#fcfbae", "ducklings copying their mother at the community center near the dentist's office"],
		 ["#c2adde", "low hills surrounding the valley"],
		 ["#5cc49b", "a girl scout junior vest"],
		 ["#9eeb98", "electric grass"],
		 ["#d7d9de", "chain-link fence"],
		 ["#f5b5dd", "the root of a clover flower petal. if it were a bit darker it'd be the root of a lush magnolia flower."],
	 	 ["#ffbf47", "the oranges at my house"]],
		["San Francisco, CA",
		  "drawnbydipa",
		 ["#f04c00", "the Golden Gate Bridge"],
		 ["#0058AB", "the Pacific Ocean"]],
		["Taipei, Taiwan",
		   "rayacooks",
		 ["#abd982", "Green: nature, mountains, and hills in Taiwan"],
		 ["#4a99e8", "Blue: sky on sunny days, especially beautiful when you can see 101 in the skyline"],
		 ["#b477ed", "Purple: incredible sunsets on the beach"],
		 ["#fff759", "Yellow: vibrancy of city life and the scorching summer heat"],
	 	 ["#ffffff", "White: creativity and courage of the activists fighting for rights and equality"]],
		["Enya",
			"enya",
			["black", "Black: simple, stylish, for some reason it \"feels\" quiet (maybe because night), doesn't drawing \
			attention. Almost everything I own and wear is black"],
			["red", "Red: it's powerful, angry, the color of blood and war. When I wear it I feel powerful, but I don't like to own red objects because it's too bright."],
			["gray", "Gray: also a very chill color. A softer version of black, but still neutral enough to wear and own. Denotes nuance \
			(\"gray area\")"],
			["yellow", "Yellow: my favorite color of light. Warmth. The color of the sun in cartoons. A gender-neutral color great for babies (rather than baby blue \
			or pink). Not happiness, but a subtle kind of joy"]
		],
		["Encinitas, CA",
			"royachagnon",
			["#DE075A", "Bougainvillea: Bougainvilleas come in a lot of colors, but this is definitely the most common and the most striking in the San Diego area. In the spring and summer, they are in full bloom and it’s one of my favorite sights to see."],
			["#0A5C78", "ocean: This is a beach town, so I had to include the ocean. I love when it’s a rich deep blue."],
			["#608A25", "palm tree: We have a lot of palm trees, and a lot of our other vegetation is kind of this light shade of green."],
			["#1A5E11", "encinitas sign: The historic Encinitas sign that spans Highway 101 is an iconic gateway to our town!"],
			["#9F66D1", "sea lavender/jacaranda: Two of my other favorite local flowers. Sea lavender by the beach is such a pretty pop of color on the bluffs, and in late spring the jacaranda blooms brighten up the streets in my neighborhood."],
			["#F3E7C1", "sand: Because the beach, duh!"],
			["#8CCCFA", "sky: There’s something about a cloudless, bright blue sky that just brings out the vibrancy in all the other colors around here."],
			["#C06A20", "La Paloma: This orange is the color of the Spanish-style clay tile roofs you can see around town, including on the historic La Paloma Theater."]
		],
		["Houston, TX",
			"Alexis from Texas",
			["#a9bbc2", "Menil Museum: a place where my hometown friends reunite"],
			["#091069", "NASA: grew up surrounded by science--my initial inspiration and introduction to my current reality"],
			["#e0b943", "Happy: sunny days, happy people, simplicity, diversity"],
			["#034ale", "Oaks: the trees are a deep green"]
		]
	];

	//TO DO: make 'palettes' into a scrollable div
	//create new canvases and instantiate
	let frag = "<table><tr>";
	for (let i = 0; i < colors.length; i++) {
		if (i%2 == 0) {
			frag += "</tr>"
			if (i != colors.length - 1) { //if not last palette, start new row
				frag += "<tr>"
			}
		}
		frag += '<td><canvas id="palette_'+ i + '" class="palette"></canvas></td>';
	}
	frag+= "</table>"
	document.getElementById("palettes").innerHTML = frag;

	//shuffle order of palettes to ensure fairness of colors seen
	function shuffle(array) {
	  var currentIndex = array.length, temporaryValue, randomIndex;

	  // While there remain elements to shuffle...
	  while (0 !== currentIndex) {

	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;

	    // And swap it with the current element.
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }

	  return array;
	}
	colors = shuffle(colors);


	let palette_canvases = document.getElementsByClassName("palette");
	let palette_canvases_instantiated = [];
	for (let i = 0; i < palette_canvases.length; i++) {
		let palettecanvas = new paletteCanvas(i); //here it puts in index, colors accessed in constructor
		console.log(palettecanvas)
		palette_canvases_instantiated.push(palettecanvas);
	}

	document.getElementById("download").onclick = function(){
		//we have to get the dataURL of the image
		const dataURL = sketchpad.toImage();
		//set href of download to dataURL
		$("#download").attr("href", dataURL);
	};

	let prev_visitors = [['assets/images/visitors/1.jpeg','Tri','Singapore'],
						['assets/images/visitors/2.png', 'pg', 'East Bay'],
						['assets/images/visitors/4.png', 'ina_banana_17', 'New Taipei City']
											];

	let random_prev_visitor = Math.floor(Math.random()*prev_visitors.length);
	document.getElementById("art_wall_img").src = prev_visitors[random_prev_visitor][0];
	document.getElementById("art_wall_name").innerHTML = prev_visitors[random_prev_visitor][1];
	document.getElementById("art_wall_location").innerHTML = prev_visitors[random_prev_visitor][2];
