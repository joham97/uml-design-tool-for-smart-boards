var classes;
var relations;

//Drag and Drop Helpers
var lockOnClass = -1;
var lockOnObject = -1;
var gotDragged = false;
var ignoreFirstDrag = false;
var lastMouseX = -1;
var lastMouseY = -1;

//Rename Input Field
var input;
var ignoreInputAtAll = false;
var classToEdit = -1;
var classNameToEdit = false;
var classAttrToEdit = -1;
var classMethodToEdit = -1;
var relationToEdit = -1;
var relationTagToEdit = -1;

//Menu
var mainbuttons;
var methodenbuttons;
var beziehungenbuttons;
var kardinalitaetenbuttons;
var objectButton;
var mainSelect;
var subSelect;
var waitForSelect;

//New Relation
var tempClass1 = -1;

var frames = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var reader;

//Objektdiagramm
var showObjectDiagram = false;

function preload() {
	this.methodenbuttons = [];
	this.beziehungenbuttons = [];
	this.kardinalitaetenbuttons = [];

	this.mainbuttons = [];
	this.mainbuttons.push(new Button(10, 20, 125, 125, "Klasse", "Symbole//Hauptmenu//Klassensymbol.PNG", true, []));
	this.mainbuttons.push(new Button(10, 160, 125, 125, "Attribute / Methoden", "Symbole//Hauptmenu//AttributeMethoden.PNG", true, methodenbuttons));
	this.mainbuttons.push(new Button(10, 300, 125, 125, "Beziehung", "Symbole//Hauptmenu//Beziehungsymbol.PNG", true, beziehungenbuttons));
	this.mainbuttons.push(new Button(10, 440, 125, 125, "Kardinalitäten", "Symbole//Hauptmenu//Kardinalitaetsymbol.PNG", true, kardinalitaetenbuttons));
	this.mainbuttons.push(new Button(10, 580, 125, 125, "Löschen", "Symbole//Hauptmenu//Loeschensymbol.PNG", true, []));
	this.mainbuttons.push(new Button(10, 720, 125, 125, "Import", "Symbole//Hauptmenu//Importsymbol.PNG", true, []));
	this.mainbuttons.push(new Button(10, 860, 125, 125, "Export", "Symbole//Hauptmenu//Exportsymbol.PNG", true, []));

	this.methodenbuttons.push(new Button(165, 20, 125, 125, "Attribut", "Symbole//Untermenu//Private.PNG", false));
	this.methodenbuttons.push(new Button(165, 160, 125, 125, "Methode", "Symbole//Untermenu//Public.PNG", false));
	this.methodenbuttons.push(new Button(165, 300, 125, 125, "Konstruktor", "Symbole//Untermenu//Konstruktor.PNG", false));

	this.beziehungenbuttons.push(new Button(165, 20, 125, 125, "Assoziation", "Symbole//Untermenu//Assoziation.PNG", false));
	this.beziehungenbuttons.push(new Button(165, 160, 125, 125, "gerichtete Assoziation", "Symbole//Untermenu//gerichteteAssoziation.PNG", false));
	this.beziehungenbuttons.push(new Button(165, 300, 125, 125, "Abhängigkeit", "Symbole//Untermenu//Abhaengigkeit.PNG", false));
	this.beziehungenbuttons.push(new Button(165, 440, 125, 125, "Komposition", "Symbole//Untermenu//Komposition.PNG", false));
	this.beziehungenbuttons.push(new Button(165, 580, 125, 125, "Aggregation", "Symbole//Untermenu//Aggregation.PNG", false));
	this.beziehungenbuttons.push(new Button(165, 720, 125, 125, "Vererbung", "Symbole//Untermenu//Vererbung.PNG", false));

	this.kardinalitaetenbuttons.push(new Button(165, 20, 125, 125, "", "Symbole//Untermenu//Bezeichner.PNG", false));
	this.kardinalitaetenbuttons.push(new Button(165, 160, 125, 125, "", "Symbole//Untermenu//0..1.PNG", false));
	this.kardinalitaetenbuttons.push(new Button(165, 300, 125, 125, "", "Symbole//Untermenu//0..Stern.PNG", false));
	this.kardinalitaetenbuttons.push(new Button(165, 440, 125, 125, "", "Symbole//Untermenu//1.PNG", false));
	this.kardinalitaetenbuttons.push(new Button(165, 580, 125, 125, "", "Symbole//Untermenu//1..Stern.PNG", false));
	this.kardinalitaetenbuttons.push(new Button(165, 720, 125, 125, "", "Symbole//Untermenu//Stern.PNG", false));

	this.objectButton = new Button(1115, 10, 125, 125, "Objektdiagramm", "Symbole//Untermenu//gerichteteAssoziation.PNG", true);
}

function setup() {
	createCanvas(1250, 990);

	reader = new FileReader();
	reader.onload = function (progressEvent) {
		importClassDiagramFromJSON(this.result);
	};

	this.input = createInput();
	this.input.position(-1000, -1000);
	this.input.style("text-align", "center");
	this.input.style("font-size", fontSize + "px");

	classes = [];
	relations = [];

	//Test Diagram
/*
	classes.push(new Class(680, 100));
	classes.push(new Class(350, 390));
	classes.push(new Class(950, 433));

	classes[0].setName("Lebewesen");
	classes[0].addAttribute("-name: String");
	classes[0].addMethod("+getName(): String");
	classes[0].addMethod("+setName(name: String)");

	classes[1].setName("Person");
	classes[1].addAttribute("-adresse: String");
	classes[1].addAttribute("-schuhgroeße: int");
	classes[1].addMethod("+getAdresse(): String");
	classes[1].addMethod("+setAdresse(adresse: String)");
	classes[1].addMethod("+getSchuhgroeße(): String");
	classes[1].addMethod("+setSchuhgroeße(schuhgroeße: String)");

	classes[2].setName("Hund");
	classes[2].addAttribute("-farbe: String");
	classes[2].addMethod("+getFarbe(): String");
	classes[2].addMethod("+setFarbe(name: String)");

	relations.push(new Relation(this.ASSOCIATION_ARROW, classes[1], classes[2]));
	relations.push(new Relation(this.INHERITANCE, classes[0], classes[1]));
	relations.push(new Relation(this.INHERITANCE, classes[0], classes[2]));
*/
	strokeWeight(myStrokeWeight);
}

function draw() {
	background(255);

	fill(255);
	stroke(0);
	textSize(fontSize);

	if (!showObjectDiagram) {
		for (let i = 0; i < this.relations.length; i++) {
			this.relations[i].draw();
		}

		for (let i = 0; i < this.classes.length; i++) {
			this.classes[i].draw();
		}

		for (let i = 0; i < this.relations.length; i++) {
			//this.relations[i].draw2();
		}
	} else {
		drawObjectDiagram();
	}

	if (!showObjectDiagram) {

		fill(255);
		noStroke();
		rect(0, 0, 140, 990);

		textSize(12);
		noFill();
		stroke(0);

		for (let i = 0; i < this.mainbuttons.length; i++) {
			this.mainbuttons[i].draw();
			for (let j = 0; j < this.mainbuttons[i].subButtons.length; j++) {
				this.mainbuttons[i].subButtons[j].draw();
			}
		}

		this.objectButton.draw();

		if (this.mainbuttons[1].isMarked) {
			fill(31, 177, 76);
			beginShape();
			vertex(142, 205);
			vertex(160, 220);
			vertex(142, 235);
			endShape(CLOSE);
		}

		if (this.mainbuttons[2].isMarked) {
			fill(31, 177, 76);
			beginShape();
			vertex(142, 345);
			vertex(160, 360);
			vertex(142, 375);
			endShape(CLOSE);
		}

		if (this.mainbuttons[3].isMarked) {
			fill(31, 177, 76);
			beginShape();
			vertex(142, 485);
			vertex(160, 500);
			vertex(142, 515);
			endShape(CLOSE);
		}
	}

	stroke(0);
	noFill(0);
	//rect(300, 10, 940, 970);
	//FPS
	noStroke();
	fill(0);
	this.frames.splice(0, 1);
	this.frames.push(round(frameRate()));
	var fps = 0;
	for (let i = 0; i < this.frames.length; i++) {
		fps += this.frames[i];
	}

	//text("FPS: " + round(fps / 10), 0, fontSize);
}

function classOnTop(list, index) {
	list.push(list[index]);
	list.splice(index, 1);
}

function closeAll() {
	this.waitForSelect = false;
	this.mainSelect = -1;
	for (let i = 0; i < this.mainbuttons.length; i++) {
		this.mainbuttons[i].isMarked = false;
		for (let j = 0; j < this.mainbuttons[i].subButtons.length; j++) {
			this.mainbuttons[i].subButtons[j].visible = false;
			this.mainbuttons[i].subButtons[j].isMarked = false;
		}
	}
	for (let i = 0; i < this.classes.length; i++) {
		this.classes[i].marked = false;
	}
	for (let i = 0; i < this.relations.length; i++) {
		this.relations[i].markCadinalities(false);
		this.relations[i].markNames(false);
	}
}

function keyReleased() {
	if (keyCode == ENTER) {
		closeRename();
	}
}

function mousePressed() {
	if (!this.waitForSelect) {
		if (!ignoreInputAtAll && this.lockOnClass == -1) {
			for (let i = this.classes.length - 1; i >= 0; i--) {
				if (this.classes[i].checkHitbox(mouseX, mouseY) && this.lockOnClass == -1 && !this.showObjectDiagram) {
					classOnTop(this.classes, i);
					this.lockOnClass = this.classes.length - 1;
					this.ignoreFirstDrag = true;
					this.lastMouseX = mouseX;
					this.lastMouseY = mouseY;
				}
			}
			for (let i = this.objects.length - 1; i >= 0; i--) {
				if (this.objects[i].checkHitbox(mouseX, mouseY) && this.lockOnObject == -1 && this.showObjectDiagram) {
					classOnTop(this.objects, i);
					this.lockOnObject = this.objects.length - 1;
					this.ignoreFirstDrag = true;
					this.lastMouseX = mouseX;
					this.lastMouseY = mouseY;
				}
			}
		}
	}
}

function mouseDragged() {
	if (!this.waitForSelect) {
		if (!ignoreInputAtAll && !ignoreFirstDrag) {
			this.gotDragged = true;
			if (this.lockOnClass != -1) {
				let newX = classes[this.lockOnClass].x + (mouseX - this.lastMouseX);
				let newY = classes[this.lockOnClass].y + (mouseY - this.lastMouseY);
				if (150 < newX && newX + classes[this.lockOnClass].width < 1250) {
					this.classes[this.lockOnClass].setX(newX);
					this.lastMouseX = mouseX;
				}
				if (10 < newY && newY + classes[this.lockOnClass].height < 990) {
					this.classes[this.lockOnClass].setY(newY);
					this.lastMouseY = mouseY;
				}
			}
			if (this.lockOnObject != -1) {
				let newX = objects[this.lockOnObject].x + (mouseX - this.lastMouseX);
				let newY = objects[this.lockOnObject].y + (mouseY - this.lastMouseY);
				if (300 < newX && newX + objects[this.lockOnObject].width < 1240) {
					this.objects[this.lockOnObject].setX(newX);
					this.lastMouseX = mouseX;
				}
				if (10 < newY && newY + objects[this.lockOnObject].height < 980) {
					this.objects[this.lockOnObject].setY(newY);
					this.lastMouseY = mouseY;
				}
			}
		}
		this.ignoreFirstDrag = false;
	}
}

function mouseReleased() {
	if (!this.waitForSelect) {
		this.lockOnClass = -1;
		this.lockOnObject = -1;
		this.lastMouseX = -1;
		this.lastMouseX = -1;
	}
}

function mouseClicked() {
	if (this.showObjectDiagram) {
		clickObjectDiagram();
		gotDragged = false;

		if (this.waitForSelect) {
			this.clickWhileWaitForSelect(mouseX, mouseY);
		}
	} else {
		if (!this.waitForSelect) {
			//Close Rename Window
			if (this.ignoreInputAtAll && (this.classToEdit != -1 || this.relationToEdit != -1)) {
				closeRename();
			}
		}

		//Menu
		for (let i = 0; i < this.mainbuttons.length; i++) {
			if (this.mainbuttons[i].checkHitbox()) {
				if (!this.mainbuttons[i].isMarked) {
					closeAll();
					this.mainbuttons[i].isMarked = true;
					for (let j = 0; j < this.mainbuttons[i].subButtons.length; j++) {
						this.mainbuttons[i].subButtons[j].visible = true;
						if (this.mainbuttons[i].subButtons[j].checkHitbox()) {
							this.mainbuttons[i].subButtons[j].isMarked = true;
						}
					}
					mainButtonSelected(i);
					return;
				} else {
					closeAll();
				}
			}
		}
		for (let i = 0; i < this.mainbuttons.length; i++) {
			for (let j = 0; j < this.mainbuttons[i].subButtons.length; j++) {
				if (this.mainbuttons[i].subButtons[j].checkHitbox()) {
					for (let k = 0; k < this.mainbuttons[i].subButtons.length; k++) {
						this.mainbuttons[i].subButtons[k].isMarked = false;
					}
					this.mainbuttons[i].subButtons[j].isMarked = true;
					subButtonSelected(j);
					return;
				}
			}
		}

		if (!this.waitForSelect) {
			//Show Rename Window if valid
			if (!this.ignoreInputAtAll && !gotDragged) {
				for (let i = this.classes.length - 1; i >= 0; i--) {
					if (this.classes[i].checkHitbox(mouseX, mouseY)) {
						if (this.classes[i].checkHitboxClassName(mouseX, mouseY)) {
							renameClass(i);
							return;
						} else {
							let id = this.classes[i].getAttributeByPos(mouseX, mouseY);
							if (id != -1) {
								renameAttribute(i, id);
								return;
							} else {
								let id = this.classes[i].getMethodByPos(mouseX, mouseY);
								if (id != -1) {
									renameMethod(i, id);
									return;
								}
							}
						}
					}
				}
				for (let i = 0; i < this.relations.length; i++) {
					var res = this.relations[i].getNameByPos(mouseX, mouseY);
					if (res == 1 && this.relations[i].name1.name != "") {
						renameRelationName(i, res);
					}
					if (res == 2 && this.relations[i].name2.name != "") {
						renameRelationName(i, res);
					}
				}
			}
			gotDragged = false;
		}

		if (this.objectButton.checkHitbox()) {
			this.showObjectDiagram = true;
			initObjectdiagram();
			return;
		}

		if (this.waitForSelect) {
			this.clickWhileWaitForSelect(mouseX, mouseY);
		}
	}
}

function mainButtonSelected(id) {
	this.mainSelect = id;
	this.waitForSelect = false;
	for (let i = 0; i < this.classes.length; i++) {
		this.classes[i].marked = false;
	}
	if (id == 0) {
		//Klasse hinzufügen
		classes.push(new Class(width / 2 + 100, height / 2));
		this.mainbuttons[id].isMarked = false;
		this.mainSelect = -1;
	}
	if (id == 4) {
		this.waitForSelect = true;
	}
	if (id == 5) {
		this.openFileDialog();
		this.mainbuttons[id].isMarked = false;
		this.mainSelect = -1;
	}
	if (id == 6) {
		this.exportClassDiagramToJSON();
		this.mainbuttons[id].isMarked = false;
		this.mainSelect = -1;
	}
}

function subButtonSelected(id) {
	if (this.mainSelect == 1 || this.mainSelect == 2) {
		this.markAllClasses(true);
		this.waitForSelect = true;
	} else if (this.mainSelect == 3) {
		if (id == 0) {
			this.markAllCadinalities(false);
			this.markAllNames(true);
		} else {
			this.markAllNames(false);
			this.markAllCadinalities(true);
		}
		this.waitForSelect = true;
	}
	this.subSelect = id;
}

function clickWhileWaitForSelect(x, y) {
	if (!this.showObjectDiagram) {
		for (let i = this.classes.length - 1; i >= 0; i--) {
			if (this.classes[i].checkHitbox(x, y)) {
				//Attribut / Method
				if (mainSelect == 1) {
					if (this.subSelect == 0) {
						this.classes[i].addAttribute("-attribut: int");
					} else if (this.subSelect == 1) {
						this.classes[i].addMethod("+methode()");
					} else if (this.subSelect == 2) {
						this.classes[i].addMethodConstructor("+" + this.classes[i].name + "()");
					}
					markAllClasses(false);
					this.mainbuttons[this.mainSelect].subButtons[this.subSelect].isMarked = false;
					this.subSelect == -1;
					this.waitForSelect = false;
					return;
				} else if (mainSelect == 2) {
					if (this.tempClass1 == -1) {
						this.tempClass1 = i;
						this.classes[i].marked = false;
					} else {
						for (let j = 0; j < this.relations.length; j++) {
							if ((this.relations[j].class1 == this.classes[i] && this.relations[j].class2 == this.classes[this.tempClass1]) ||
								(this.relations[j].class1 == this.classes[this.tempClass1] && this.relations[j].class2 == this.classes[i])) {
								this.removeRelation(j);
								j--;
							}
						}
						if (this.subSelect == 0) {
							relations.push(new Relation(this.ASSOCIATION, classes[tempClass1], classes[i]));
						} else if (this.subSelect == 1) {
							relations.push(new Relation(this.ASSOCIATION_ARROW, classes[tempClass1], classes[i]));
						} else if (this.subSelect == 2) {
							relations.push(new Relation(this.DEPENDENCY, classes[tempClass1], classes[i]));
						} else if (this.subSelect == 3) {
							relations.push(new Relation(this.COMPOSITION, classes[tempClass1], classes[i]));
						} else if (this.subSelect == 4) {
							relations.push(new Relation(this.AGGREGATION, classes[tempClass1], classes[i]));
						} else if (this.subSelect == 5) {
							relations.push(new Relation(this.INHERITANCE, classes[i], classes[tempClass1]));
						}
						markAllClasses(false);
						this.mainbuttons[this.mainSelect].subButtons[this.subSelect].isMarked = false;
						this.subSelect == -1;
						this.tempClass1 = -1;
						this.waitForSelect = false;
						return;
					}
				} else if (this.mainSelect == 4) {
					if (this.classes[i].checkHitboxClassName(mouseX, mouseY)) {
						for (let j = 0; j < this.relations.length; j++) {
							if (this.relations[j].class1 == this.classes[i] || this.relations[j].class2 == this.classes[i]) {
								this.removeRelation(j);
								j--;
							}
						}
						this.classes.splice(i, 1);
						this.mainbuttons[this.mainSelect].isMarked = false;
						this.waitForSelect = false;
						this.mainSelect = -1;
						return;
					} else {
						let id = this.classes[i].getAttributeByPos(mouseX, mouseY);
						if (id != -1) {
							this.classes[i].removeAttribute(id);
							this.mainbuttons[this.mainSelect].isMarked = false;
							this.waitForSelect = false;
							this.mainSelect = -1;
							return;
						} else {
							id = this.classes[i].getMethodByPos(mouseX, mouseY);
							if (id != -1) {
								this.classes[i].removeMethod(id);
								this.mainbuttons[this.mainSelect].isMarked = false;
								this.waitForSelect = false;
								this.mainSelect = -1;
								return;
							}
						}
					}
				}
			}
		}
		for (let i = 0; i < this.relations.length; i++) {
			if (this.mainSelect == 3) {
				var resName = this.relations[i].getNameByPos(mouseX, mouseY);
				var res = this.relations[i].getCardinalityByPos(mouseX, mouseY);
				if (this.subSelect == 0) {
					if (resName == 1) {
						this.relations[i].name1.setName("Bezeichner");
					} else if (resName == 2) {
						this.relations[i].name2.setName("Bezeichner");
					}
				} else if (this.subSelect == 1) {
					setCardianlityIfHitted(res, i, "0..1");
				} else if (this.subSelect == 2) {
					setCardianlityIfHitted(res, i, "0..*");
				} else if (this.subSelect == 3) {
					setCardianlityIfHitted(res, i, "1");
				} else if (this.subSelect == 4) {
					setCardianlityIfHitted(res, i, "1..*");
				} else if (this.subSelect == 5) {
					setCardianlityIfHitted(res, i, "*");
				}
				if (resName == 1 || resName == 2 || res == 1 || res == 2) {
					markAllCadinalities(false);
					markAllNames(false);
					this.mainbuttons[this.mainSelect].subButtons[this.subSelect].isMarked = false;
					this.subSelect == -1;
					this.waitForSelect = false;
				}
			} else if (this.mainSelect == 4) {
				var res1 = this.relations[i].getNameByPos(mouseX, mouseY);
				if (res1 == 1) {
					this.relations[i].name1.setName("");
					resetRemove();
					return;
				} else if (res1 == 2) {
					this.relations[i].name2.setName("");
					resetRemove();
					return;
				}
				var res2 = this.relations[i].getCardinalityByPos(mouseX, mouseY);
				if (res2 == 1) {
					this.relations[i].cadinality1.setName("");
					resetRemove();
					return;
				} else if (res2 == 2) {
					this.relations[i].cadinality2.setName("");
					resetRemove();
					return;
				}
				if (res1 != -1 || res2 != -1) {
					this.mainbuttons[this.mainSelect].isMarked = false;
					this.waitForSelect = false;
					this.mainSelect = -1;
				} else {
					this.removeRelationIfValid(i);
				}
			}
		}
	} else {
		clickWhileWaitForSelectObjectDiagram(x, y);
	}
}

function resetRemove(){
	this.mainbuttons[this.mainSelect].isMarked = false;
	this.waitForSelect = false;
	this.mainSelect = -1;
}

function setCardianlityIfHitted(res, i, cadinality) {
	if (res == 1) {
		this.relations[i].cadinality1.setName(cadinality);
	} else if (res == 2) {
		this.relations[i].cadinality2.setName(cadinality);
	}
}

function markAllClasses(mark) {
	for (let i = 0; i < this.classes.length; i++) {
		this.classes[i].marked = mark;
	}
}

function markAllCadinalities(mark) {
	for (let i = 0; i < this.relations.length; i++) {
		this.relations[i].markCadinalities(mark);
	}
}

function markAllNames(mark) {
	for (let i = 0; i < this.relations.length; i++) {
		this.relations[i].markNames(mark);
	}
}

function closeRename() {
	if (this.classToEdit != -1) {
		if (classNameToEdit) {
			this.classes[this.classToEdit].setName(this.input.value());
		}
		if (this.classAttrToEdit != -1) {
			this.classes[this.classToEdit].setAttribute(this.classAttrToEdit, this.input.value());
		}
		if (this.classMethodToEdit != -1) {
			this.classes[this.classToEdit].setMethod(this.classMethodToEdit, this.input.value());
		}
	} else {
		if (this.relationTagToEdit == 1) {
			this.relations[this.relationToEdit].name1.setName(this.input.value());
		} else {
			this.relations[this.relationToEdit].name2.setName(this.input.value());
		}
	}

	this.input.position(-1000, -1000);

	this.classToEdit = -1;
	this.classNameToEdit = false;
	this.classAttrToEdit = -1;
	this.classMethodToEdit = -1;

	this.ignoreInputAtAll = false;
}

function renameClass(id) {
	this.input.style("text-align", "center");
	ignoreInputAtAll = true;
	this.input.position(this.classes[id].x + 11, this.classes[id].y + 11);
	this.input.size(this.classes[id].width - 9, this.classes[id].nameHeight - 10);
	this.classToEdit = id;
	this.classNameToEdit = true;
	this.input.value(this.classes[id].name);
	this.input.elt.focus();
}

function renameAttribute(id, count) {
	this.input.style("text-align", "left");
	ignoreInputAtAll = true;
	this.input.position(this.classes[id].x + 11, 8 + this.classes[id].y + this.classes[id].nameHeight + this.classes[id].marginY + count * (fontSize + this.classes[id].marginY / 2));
	this.input.size(this.classes[id].width - 9, fontSize + this.classes[id].marginY / 2 - 5);
	this.classToEdit = id;
	this.classAttrToEdit = count;
	this.input.value(this.classes[id].attributes[count]);
	this.input.elt.focus();
}

function renameMethod(id, count) {
	this.input.style("text-align", "left");
	ignoreInputAtAll = true;

	this.input.position(this.classes[id].x + 11, 8 + this.classes[id].y + this.classes[id].nameHeight + this.classes[id].attrHeight + this.classes[id].marginY + count * (fontSize + this.classes[id].marginY / 2));
	this.input.size(this.classes[id].width - 9, fontSize + this.classes[id].marginY / 2 - 5);
	this.classToEdit = id;
	this.classMethodToEdit = count;
	this.input.value(this.classes[id].methods[count]);
	this.input.elt.focus();
}

function renameRelationName(id, count) {
	this.input.style("text-align", "left");
	ignoreInputAtAll = true;

	var relationTag = this.relations[id].name1;
	if (count == 2) {
		relationTag = this.relations[id].name2;
	}

	textSize(fontSize);

	if (relationTag.right) {
		this.input.position(relationTag.x + 8 - textWidth(relationTag.name), relationTag.y + 10);
	} else {
		this.input.position(relationTag.x + 8, relationTag.y + 10);
	}
	this.input.size(textWidth(relationTag.name), relationTag.height);
	this.relationToEdit = id;
	this.relationTagToEdit = count;
	this.input.value(relationTag.name);
	this.input.elt.focus();
}

function removeRelationIfValid(i) {
	let validifier = 20;

	var rel_vec = createVector(this.relations[i].x2 - this.relations[i].x1, this.relations[i].y2 - this.relations[i].y1);
	var rel_orth = createVector(this.relations[i].x2 - this.relations[i].x1, this.relations[i].y2 - this.relations[i].y1).rotate(PI / 4).normalize();

	var res1 = getCollisionLineLine(mouseX, mouseY, mouseX + rel_orth.x * validifier, mouseY + rel_orth.y * validifier,
		this.relations[i].x1, this.relations[i].y1, this.relations[i].x2, this.relations[i].y2);

	var res2 = getCollisionLineLine(mouseX, mouseY, mouseX - rel_orth.x * validifier, mouseY - rel_orth.y * validifier,
		this.relations[i].x1, this.relations[i].y1, this.relations[i].x2, this.relations[i].y2);

	if ((res1.x != -1 && res1.y != -1) || (res2.x != -1 && res2.y != -1)) {
		this.removeRelation(i);
		this.mainbuttons[this.mainSelect].isMarked = false;
		this.waitForSelect = false;
		this.mainSelect = -1;
	}

}

function removeRelation(i) {
	let relation = this.relations[i];
	if (relation.type == this.INHERITANCE) {
		relation.class2.superClass = null;
	}
	this.relations.splice(i, 1);
}

function hitbox(x, y, rectX, rectY, rectWidth, rectHeight) {
	return rectX <= x && x <= rectX + rectWidth && rectY <= y && y <= rectY + rectHeight;
}

function exportClassDiagramToJSON() {

	let data = { classes: [], relations: [] };
	for (let i = 0; i < this.classes.length; i++) {
		data.classes.push({
			id: i,
			name: this.classes[i].name,
			attributes: this.classes[i].attributes,
			methods: this.classes[i].methods,
			x: this.classes[i].x,
			y: this.classes[i].y
		});
	}

	for (let i = 0; i < this.relations.length; i++) {
		let classID1 = -1;
		let classID2 = -1;

		for (let j = 0; j < this.classes.length; j++) {
			if (this.classes[j] == this.relations[i].class1) {
				classID1 = j;
			}
			if (this.classes[j] == this.relations[i].class2) {
				classID2 = j;
			}
		}
		data.relations.push({
			type: this.relations[i].type,
			classID1: classID1,
			classID2: classID2,
			name1: this.relations[i].name1.name,
			name2: this.relations[i].name2.name,
			cadinality1: this.relations[i].cadinality1.name,
			cadinality2: this.relations[i].cadinality2.name
		});
	}


	var textToWrite = JSON.stringify(data);
	var textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
	var fileNameToSaveAs = "export.json";
	var downloadLink = document.createElement("a");
	downloadLink.download = fileNameToSaveAs;
	downloadLink.innerHTML = "Download File";
	if (window.webkitURL != null) {
		// Chrome allows the link to be clicked
		// without actually adding it to the DOM.
		downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
	}
	else {
		// Firefox requires the link to be added to the DOM
		// before it can be clicked.
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
	}

	downloadLink.click();
}

function openFileDialog() {
	document.getElementById('file-input').click();
}

function newFile() {
	var file = document.getElementById('file-input').files[0];
	reader.readAsText(file);
}

function importClassDiagramFromJSON(result) {
	var data = JSON.parse(result);

	this.classes = [];
	this.relations = [];
	this.objects = [];
	this.objectRelations = [];

	for (let i = 0; i < data.classes.length; i++) {
		let classToAdd = new Class(data.classes[i].x, data.classes[i].y);
		classToAdd.setName(data.classes[i].name);
		for (let j = 0; j < data.classes[i].attributes.length; j++) {
			classToAdd.addAttribute(data.classes[i].attributes[j]);
		}
		for (let j = 0; j < data.classes[i].methods.length; j++) {
			classToAdd.addMethod(data.classes[i].methods[j]);
		}
		this.classes.push(classToAdd);
	}

	for (let i = 0; i < data.relations.length; i++) {
		let relationToAdd = new Relation(data.relations[i].type, this.classes[data.relations[i].classID1], this.classes[data.relations[i].classID2]);
		relationToAdd.name1.setName(data.relations[i].name1);
		relationToAdd.name2.setName(data.relations[i].name2);
		relationToAdd.cadinality1.setName(data.relations[i].cadinality1);
		relationToAdd.cadinality2.setName(data.relations[i].cadinality2);

		this.relations.push(relationToAdd);
	}
}
