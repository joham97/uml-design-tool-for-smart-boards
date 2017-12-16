var objects = [];
var objectRelations = [];

var objectdiagramWidth = 125;

var selectedAttributeText = -1;

var objectdiagramwidth = 135;
var objectdiagramheight = 30;

var neueBeziehung = false;
var loeschenObjectDiagram = false;

var tempClass1 = -1;

var classButton;

var objectToEdit = -1;
var objectAttrToEdit = -1;

function initObjectdiagram() {
    this.objectdiagramheight = 25 * this.classes.length + 50;

    textSize(30);
    this.objectdiagramwidth = textWidth("Neue Beziehung");
    textSize(22);
    for (let i = 0; i < this.classes.length; i++) {
        if (this.objectdiagramwidth < textWidth(this.classes[i].name)) {
            this.objectdiagramwidth = textWidth(this.classes[i].name);
        }
    }
    this.objectdiagramwidth += 20;

    this.classButton = new Button(1115, 10, 125, 125, "Klassendiagramm", "Symbole//back.PNG", true);
}

function drawObjectDiagram() {
    for (let i = 0; i < objectRelations.length; i++) {
        this.objectRelations[i].draw();
    }

    for (let i = 0; i < objects.length; i++) {
        this.objects[i].draw();
    }

    stroke(0);
    fill(255);
    rect(10, 20, this.objectdiagramwidth, this.objectdiagramheight);

    noStroke();
    fill(0);
    textSize(30);
    text("Klassen:", 20, 50);
    for (let i = 0; i < this.classes.length; i++) {
        noStroke();
        fill(0);
        textSize(22);
        text(this.classes[i].name, 20, 20 + 22 + 25 * i + 40);
    }

    stroke(0);
    fill(255);
    rect(10, 40 + this.objectdiagramheight, this.objectdiagramwidth, 50);
    noStroke();
    fill(0);
    textSize(30);
    if (this.neueBeziehung) {
        fill(31, 177, 76);
    }
    text("Neue Beziehung", 20, 40 + this.objectdiagramheight + 35);

    stroke(0);
    fill(255);
    rect(10, 40 + this.objectdiagramheight + 70, this.objectdiagramwidth, 50);
    noStroke();
    fill(0);
    textSize(30);
    if (this.loeschenObjectDiagram) {
        fill(31, 177, 76);
    }
    text("Löschen", 20, 40 + this.objectdiagramheight + 35 + 70);

    fill(255);
    stroke(0);
    rect(10, 40 + this.objectdiagramheight + 140, this.objectdiagramwidth, 980 - (this.objectdiagramheight + 175));
    noStroke();
    fill(0);
    text("Attributtexte:", 20, 40 + this.objectdiagramheight + 170);

    textSize(22);
    for (let i = 0; i < predefined.length; i++) {
        if (selectedAttributeText == i) {
            fill(31, 177, 76);
        } else {
            fill(0);
        }
        text(predefined[i], 20, 40 + this.objectdiagramheight + 200 + i * 25);
    }

    textSize(12);
    this.classButton.draw();
}

function markAll(mark) {
    for (let i = 0; i < this.objects.length; i++) {
        this.objects[i].marked = mark;
    }
}

function clickObjectDiagram() {
    if (this.ignoreInputAtAll && this.objectToEdit != -1) {
        closeObjRename();
    }
    
    for (let i = 0; i < predefined.length; i++) {
        if (hitbox(mouseX, mouseY, 20, 40 + this.objectdiagramheight + 178 + i * 25, this.objectdiagramwidth, 25)) {
            selectedAttributeText = i;
            waitForSelect = false;
            loeschenObjectDiagram = false;
        }
    }

    if (hitbox(mouseX, mouseY, 10, 40 + this.objectdiagramheight, this.objectdiagramwidth, 50)) {
        this.neueBeziehung = !this.neueBeziehung;
        this.loeschenObjectDiagram = false;
        this.markAll(this.neueBeziehung);
        this.selectedAttributeText = -1;
        this.waitForSelect = this.neueBeziehung;
        this.tempClass1 = -1;
    }
    if (hitbox(mouseX, mouseY, 10, 110 + this.objectdiagramheight, this.objectdiagramwidth, 50)) {
        this.loeschenObjectDiagram = !this.loeschenObjectDiagram;
        this.neueBeziehung = false;
        this.markAll(false);
        this.selectedAttributeText = -1;
        this.waitForSelect = this.loeschenObjectDiagram;
        this.tempClass1 = -1;
    }

    for (let i = 0; i < this.classes.length; i++) {
        if (hitbox(mouseX, mouseY, 20, 60 + 25 * i, this.objectdiagramwidth, 25)) {
            this.objects.push(this.classes[i].getAsObject(500, 500));
        }
    }

    if (selectedAttributeText != -1) {
        for (let i = 0; i < objects.length; i++) {
            let res = objects[i].getAttributeByPos(mouseX, mouseY);
            if (res != -1) {
                let attr = objects[i].attributes[res].split("\"");
                objects[i].setAttribute(res, attr[0] + "\"" + predefined[selectedAttributeText] + "\"" + attr[2]);
                selectedAttributeText = -1;
            }
        }
    }else{
        if (!this.waitForSelect && !gotDragged) {
            for (let i = this.objects.length - 1; i >= 0; i--) {
                if (this.objects[i].checkHitbox(mouseX, mouseY)) {
                    let id = this.objects[i].getAttributeByPos(mouseX, mouseY);
                    if (id != -1) {
                        renameObjectAttributeText(i, id);
                        return;
                    }                    
                }
            }        
        }
    }

    if (this.classButton.checkHitbox()) {
        this.showObjectDiagram = false;
    }
}

function clickWhileWaitForSelectObjectDiagram(x, y) {
    if (this.neueBeziehung) {
        for (let i = 0; i < objects.length; i++) {
            if (this.objects[i].checkHitbox(x, y)) {
                if (tempClass1 == -1) {
                    this.tempClass1 = i;
                    this.objects[i].marked = false;
                } else {
                    objectRelations.push(new Relation(this.ASSOCIATION, this.objects[this.tempClass1], this.objects[i]));
                    this.tempClass1 = -1;
                    this.neueBeziehung = false;
                    this.waitForSelect = false;
                    this.selectedAttributeText = -1;
                    this.markAll(false);
                }
            }
        }
    }
    if (this.loeschenObjectDiagram) {
        for (let i = 0; i < objects.length; i++) {
            if (this.objects[i].checkHitbox(x, y)) {
                for (let j = 0; j < this.objectRelations.length; j++) {
                    if (this.objects[i] == this.objectRelations[j].class1 ||
                        this.objects[i] == this.objectRelations[j].class2) {
                        this.objectRelations.splice(j, 1);
                        j--;
                    }
                }
                this.objects.splice(i, 1);
                this.loeschenObjectDiagram = false;
                this.waitForSelect = false;
                return;
            }            
        }
        for (let i = 0; i < this.objectRelations.length; i++) {
            if(this.removeObjectRelationIfValid(i)){
                return;
            }
        }
    }
}

function removeObjectRelationIfValid(i) {
	let validifier = 20;

	var rel_vec = createVector(this.objectRelations[i].x2 - this.objectRelations[i].x1, this.objectRelations[i].y2 - this.objectRelations[i].y1);
	var rel_orth = createVector(this.objectRelations[i].x2 - this.objectRelations[i].x1, this.objectRelations[i].y2 - this.objectRelations[i].y1).rotate(PI / 4).normalize();

	var res1 = getCollisionLineLine(mouseX, mouseY, mouseX + rel_orth.x * validifier, mouseY + rel_orth.y * validifier,
		this.objectRelations[i].x1, this.objectRelations[i].y1, this.objectRelations[i].x2, this.objectRelations[i].y2);

	var res2 = getCollisionLineLine(mouseX, mouseY, mouseX - rel_orth.x * validifier, mouseY - rel_orth.y * validifier,
		this.objectRelations[i].x1, this.objectRelations[i].y1, this.objectRelations[i].x2, this.objectRelations[i].y2);

	if ((res1.x != -1 && res1.y != -1) || (res2.x != -1 && res2.y != -1)) {
		this.objectRelations.splice(i, 1);
        this.loeschenObjectDiagram = false;
        this.waitForSelect = false;
        return true;
	}
    return false;


}

function renameObjectAttributeText(id, count) {
    var vel = this.objects[id].attributes[count].split("\"");

	this.input.style("text-align", "left");
	ignoreInputAtAll = true;
    textSize(fontSize);
	this.input.position(this.objects[id].x + 11 + textWidth(vel[0]), 8 + this.objects[id].y + this.objects[id].nameHeight + this.objects[id].marginY + count * (fontSize + this.objects[id].marginY / 2));
	this.input.size(max(100, this.objects[id].width - 9 - textWidth(vel[0])), fontSize + this.objects[id].marginY / 2 - 5);
	this.objectToEdit = id;
	this.objectAttrToEdit = count;
	this.input.value(vel[1]);
	this.input.elt.focus();
}

function closeObjRename() {
	if (this.objectToEdit != -1) {
		if (this.objectAttrToEdit != -1) {
            var currentVal = this.objects[this.objectToEdit].attributes[this.objectAttrToEdit].split("\"");
			this.objects[this.objectToEdit].setAttribute(this.objectAttrToEdit, currentVal[0]+"\""+this.input.value()+"\"");
		}
	}

	this.input.position(-1000, -1000);

	this.objectToEdit = -1;
	this.objectAttrToEdit = -1;

	this.ignoreInputAtAll = false;
}