var canvas, ctx;

var path = [];
var queue = [];
var seen = [];
var vertsValue = [];
var vertsPairs = [];
var p = [];

var INFINITY = 100000;

var mouseEvents = {
	isClicked: false,
	x: null,
	y: null
}	

var menuEvents = {
	makeEdge: false,
	fsp: false
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
		if(vs.id < vd.id)
			this.edges.push({v1:vs, v2:vd, color:"#610D0D"});
		else
			this.edges.push({v1:vd, v2:vs, color:"#610D0D"});
	},

	clear: function() {
		this.verts.length = 0;
		this.edges.length = 0;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	},
	
	getEdgeByVerts: function(id1, id2) {
		for(var i = 0; i < this.edges.length; i++) {
			if(this.edges[i].v1.id == id1 && this.edges[i].v2.id == id2) {
				return i;
			}
			else if (this.edges[i].v1.id == id2 && this.edges[i].v2.id == id1) {
				return i;
			}
			else {
				return null;
			}
		}
	},

	draw: function() {
		ctx.lineWidth = 3;
		for(var i = 0; i < this.edges.length; i++) {
			if(this.edges[i].v1.id != this.edges[i].v2.id) {
				ctx.strokeStyle = this.edges[i].color;
				ctx.beginPath();
				ctx.moveTo(this.edges[i].v1.x, this.edges[i].v1.y);
				ctx.lineTo(this.edges[i].v2.x, this.edges[i].v2.y);
				ctx.stroke();
			}
			else if(this.edges[i].v1.id === this.edges[i].v2.id){
				ctx.fillStyle = "#610D0D";
				ctx.beginPath();
				ctx.arc(this.edges[i].v1.x, this.edges[i].v2.y, 17, 0, 2*Math.PI, true);
				ctx.stroke();
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
	canvas.height = $(document).outerHeight() - 10;
	canvas.width = ($(document).width() / 3) * 2;
	ctx = canvas.getContext("2d");

	$("#menu").outerHeight(canvas.height - 2);
	$("#helptext").outerHeight(canvas.height);

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

	document.getElementById("delButton").onclick = function() {
		var answer = confirm("Are you sure?");
		if(answer == true) {
			graph.clear();
		}
	};

	document.getElementById("findPathButton").onclick = function() {
		menuEvents.fsp = true;
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
					twoVertsSelection.v1 !== graph.verts[i].id) {
					twoVertsSelection.v2 = graph.verts[i].id;
					graph.verts[i].color = "#00dd00";
					twoVertsSelection.isGood = true;
				}
				else if (twoVertsSelection.v2 === null &&
					twoVertsSelection.v1 === graph.verts[i].id) {
					twoVertsSelection.v2 = graph.verts[i].id;
					graph.verts[i].color = "#4d4dff";
					twoVertsSelection.isGood = true;
				}
				else if(twoVertsSelection.isGood === true) {
					twoVertsSelection.clear();
					twoVertsSelection.v1 = graph.verts[i].id;
					graph.verts[i].color = "#00dd00";
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
	else if(twoVertsSelection.isGood === true && menuEvents.fsp === true) {
		console.log(graph.edges[0].color);
		var pathL = deictra(twoVertsSelection.v1, twoVertsSelection.v2);
		console.log(graph.edges[0].color);
		twoVertsSelection.clear();
	}

	if(menuEvents.makeEdge === true) {
		menuEvents.makeEdge = false;
	}
	if(menuEvents.fsp === true) {
		menuEvents.fsp = false;
	}
}

function deictra(id1, id2) {

	seen.length = 0;
	path.length = 0;
	queue.length = 0;
	vertsValue.length = 0;
    vertsPairs.length = 0;;
    p.length = 0;

	if(id1 > id2) {
		var temp = id1;
		id1 = id2;
		id2 = temp;
	}

	for(var i = 0; i < graph.verts.length; i++) {
		seen[i] = false;		
	}

	for(var i = 0; i < graph.verts.length; i++) {
		vertsValue[i] = INFINITY;	
	}
	for(var i = 0; i < graph.edges.length; i++) {
		vertsPairs[graph.edges[i].v1.id] = [];
		vertsPairs[graph.edges[i].v1.id].push(graph.edges[i].v2.id);
		vertsPairs[graph.edges[i].v2.id] = [];
		vertsPairs[graph.edges[i].v2.id].push(graph.edges[i].v1.id);
	}

	for(var i = 0; i < graph.verts.length; i++) {
		p[i] = id1;
	}

	queue.push(id1);
	vertsValue[id1] = 0;

	while(queue.length) {
		var w = queue.shift();
		doVert(w);
	}

	findRoot(id1, id2, vertsValue[id2]);
	console.log(graph.edges);
	graph.edges[graph.getEdgeByVerts(id1, path[0])].color = "#4d4dff";
	console.log(path[0], path[1]);
	//graph.edges[graph.getEdgeByVerts(path[0], id1)].color = "4d4dff";
	//for(var k = 0; k < path.length - 1; k++) {
	//	console.log(graph.getEdgeByVerts(path[k], path[k+1]));
	//	graph.edges[graph.getEdgeByVerts(path[k], path[k+1])].color = "#4d4dff";	
	//} 
	return vertsValue[id2];
}

function findRoot(id1, id2, pathL) {
	while(id1 !== id2) {
		path.push(p[id1]);
		id1 = p[id1];
	}
}

function doVert(w) {
	if(seen[w] === true) {
		return;
	}

	seen[w] = true;

	for(var i = 0; i < vertsPairs[w].length; i++) {
		if(vertsValue[vertsPairs[w][i]] >= vertsValue[w] + 1) {
			vertsValue[vertsPairs[w][i]] = vertsValue[w] + 1;
			p[w] = vertsPairs[w][i];
		}

		queue.push(vertsPairs[w][i]);
	}
}