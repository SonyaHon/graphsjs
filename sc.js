var canvas, ctx;

var mouseEvents = {
	isClicked: false,
	x: null,
	y: null
}	

var menuEvents = {
	makeEdge: false
}

var twoVertsSelection = {
	v1: null,
	v2: null,
	isGood: false,
	clear: function() {
		graph.verts[twoVertsSelection.v1].color = "#D83535";
		graph.verts[twoVertsSelection.v2].color = "#D83535";
		this.v1 = null;
		this.v2 = null;
		this.isGood = false;
	}
}

var graph = {
	
	verts: null,
	edges: null,

	init: function () {
		this.verts = [];
		this.edges = [];
	},

	insertVert: function(x, y) {
		var id = this.verts.length;
		this.verts.push({x:x, y:y, id:id, color:"#D83535"});
	},

	insertEdge: function(v1, v2) {
		var vs = this.verts[v1];
		var vd = this.verts[v2];
		this.edges.push({v1:vs, v2:vd});
	},
	
	draw: function() {
		ctx.lineWidth = 3;
		for(var i = 0; i < this.edges.length; i++) {
			if(this.edges[i].v1.id != this.edges.v2.id) {
				ctx.fillStyle = "#610D0D";
				ctx.moveTo(this.edges[i].v1.x, this.edges[i].v1.y);
				ctx.lineTo(this.edges[i].v2.x, this.edges[i].v2.y);
				ctx.stroke();
			}
			else {
				ctx.fillStyle = "#610D0D";
			}
		}

		for(var i = 0; i < this.verts.length; i++) {
			ctx.fillStyle = this.verts[i].color;
			ctx.beginPath();
			ctx.arc(this.verts[i].x, this.verts[i].y, 10, 0*Math.PI, 2*Math.PI, true);
			ctx.fill();
			ctx.fillStyle = "#610D0D";
			ctx.beginPath();
			ctx.arc(this.verts[i].x, this.verts[i].y, 11, 0*Math.PI, 2*Math.PI, true);
			ctx.stroke();

			ctx.fillStyle = "#FFFFFF";
			if(this.verts[i].id < 9) {
				ctx.fillText(this.verts[i].id + 1, 
					this.verts[i].x - 3, this.verts[i].y + 3);
			}
			else {
				ctx.fillText(this.verts[i].id + 1, 
					this.verts[i].x - 6, this.verts[i].y + 3);
			}
		}
	}
}

function main (){
	canvas = document.getElementById("can");
	canvas.height = $(window).height();
	canvas.width = ($(window).width() / 3) * 2;
	ctx = canvas.getContext("2d");

	canvas.addEventListener("click", function(evt) {
		if(!mouseEvents.isClicked) {
			mouseEvents.isClicked = true;
			mouseEvents.x = evt.clientX;
			mouseEvents.y = evt.clientY;
		}
	});

	document.getElementById("makeEdgeButton").onclick = function(){
		menuEvents.makeEdge = true;
	};

	graph.init();
	loop();
}

function loop(){
	updateMouse();
	updateLogic();
	graph.draw();
	window.requestAnimationFrame(loop, canvas);
}

function updateMouse(){
	if(mouseEvents.isClicked == true) {
		for(var i = 0; i < graph.verts.length; i++) {
			if((mouseEvents.x > graph.verts[i].x - 15 && mouseEvents.x <
			 graph.verts[i].x + 15) &&
				(mouseEvents.y > graph.verts[i].y - 15 && mouseEvents.y <
					graph.verts[i].y +15)) {
				mouseEvents.isClicked = false;
				if(twoVertsSelection.v1 === null) {
					twoVertsSelection.v1 = graph.verts[i].id;
					graph.verts[i].color = "#00dd00";
				}
				else if (twoVertsSelection.v2 === null && 
					twoVertsSelection.v1 != graph.verts[i].id) {
					twoVertsSelection.v2 = graph.verts[i].id;
					graph.verts[i].color = "#00dd00";
					twoVertsSelection.isGood = true;
				}
				else if (twoVertsSelection.v2 === null &&
					twoVertsSelection.v1 == graph.verts[i].id) {
					twoVertsSelection.v2 = graph.verts[i].id;
					graph.verts[i].color = "#cc5200";
					twoVertsSelection.isGood = true;
				}

				return;
			}
		}
		graph.insertVert(mouseEvents.x, mouseEvents.y);
		mouseEvents.isClicked = false;
	}
}

function updateLogic() {
	if(twoVertsSelection.isGood === true && menuEvents.makeEdge === true) {
		graph.insertEdge(twoVertsSelection.v1, twoVertsSelection.v2);
		twoVertsSelection.clear();
	}

	if(menuEvents.makeEdge === true) {
		menuEvents.makeEdge = false;
	}
}