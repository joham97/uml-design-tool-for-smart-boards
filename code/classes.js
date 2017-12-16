class Class {
    constructor(_x, _y, _width, _height) {
        this.x = _x;
        this.y = _y;
        this.width = 200;
        this.height = 150;

        this.marginX = 8;
        this.marginY = 10;

        this.name = "Klasse";
        this.attributes = [];
        this.methods = [];
        this.marked = false;

        this.drawAsObject = false;

        this.myClass = null;

        this.nameHeight = this.margin + fontSize + this.margin;
        this.attrHeight = this.margin + this.margin;
        this.methodsHeight = this.margin + this.margin;

        this.relations = [];

        this.superClass = null;

        this.calculateSize();
    }

    draw() {
        fill(255);
        noStroke();
        rect(this.x, this.y, this.width, this.height);

        if (this.marked) {
            noFill();
            stroke(31, 177, 76);
            //Mark
            rect(this.x - this.marginX, this.y - this.marginX, this.width + this.marginX * 2, this.height + this.marginX * 2);
        }

        noFill();
        stroke(0);
        //Class Frame
        rect(this.x, this.y, this.width, this.height);

        //Seperator
        line(this.x, this.y + this.nameHeight, this.x + this.width, this.y + this.nameHeight);
        
        if(!this.drawAsObject){
            line(this.x, this.y + this.nameHeight + this.attrHeight, this.x + this.width, this.y + this.nameHeight + this.attrHeight);
        }
        
        noStroke();
        fill(0);
        //Class Name
        text(this.name, this.x + (this.width / 2 - textWidth(this.name) / 2), this.y + this.marginY + fontSize);

        //Attributes
        for (let i = 0; i < this.attributes.length; i++) {
            text(this.attributes[i], this.x + this.marginX, this.y + this.nameHeight + this.marginY + fontSize + i * (fontSize + this.marginY / 2));
        }
        
        if(!this.drawAsObject){
            //Methods
            for (let i = 0; i < this.methods.length; i++) {
                text(this.methods[i], this.x + this.marginX, this.y + this.nameHeight + this.attrHeight + this.marginY + fontSize + i * (fontSize + this.marginY / 2));
            }
        }
    }

    calculateSize() {
        textSize(fontSize);
        this.calculateWidth();
        this.calculateHeight();

        this.centerX = this.x + this.width / 2;
        this.centerY = this.y + this.height / 2;

        this.calculateRelations();
    }

    calculateRelations() {
        for (let i = 0; i < this.relations.length; i++) {
            this.relations[i].calculatePosition();
        }
    }

    calculateWidth() {
        this.width = textWidth(this.name) + 20;
        for (let i = 0; i < this.attributes.length; i++) {
            let tempWidth = textWidth(this.attributes[i]);
            if (this.width < tempWidth) {
                this.width = tempWidth;
            }
        }
        for (let i = 0; i < this.methods.length; i++) {
            let tempWidth = textWidth(this.methods[i]);
            if (this.width < tempWidth) {
                this.width = tempWidth;
            }
        }
        this.width += this.marginX;
        this.width += this.marginX;
    }


    calculateHeight() {
        this.nameHeight = this.marginY;
        this.nameHeight += fontSize;
        this.nameHeight += this.marginY;

        this.attrHeight = this.marginY;
        for (let i = 0; i < this.attributes.length; i++) {
            this.attrHeight += fontSize + this.marginY / 2;
        }
        this.attrHeight += this.marginY;

        this.methodsHeight = this.marginY;
        for (let i = 0; i < this.methods.length; i++) {
            this.methodsHeight += fontSize + this.marginY / 2;
        }
        this.methodsHeight += this.marginY;

        if(!this.drawAsObject){
            this.height = this.nameHeight + this.attrHeight + this.methodsHeight;
        }else{
            this.height = this.nameHeight + this.attrHeight;
        }
    }

    checkHitbox(x, y) {
        return hitbox(x, y, this.x, this.y, this.width, this.height);
    }

    checkHitboxClassName(x, y) {
        return hitbox(x, y, this.x, this.y, this.width, this.nameHeight);
    }

    getAttributeByPos(x, y) {
        for (let i = 0; i < this.attributes.length; i++) {
            let attr = this.attributes[i];
            if (hitbox(x, y, this.x, this.y + this.nameHeight + this.marginY + i * (fontSize + this.marginY / 2), this.width, fontSize + this.marginY / 2)) {
                return i;
            }
        }
        return -1;
    }

    getMethodByPos(x, y) {
        for (let i = 0; i < this.methods.length; i++) {
            let attr = this.methods[i];
            if (hitbox(x, y, this.x, this.y + this.nameHeight + this.attrHeight + this.marginY + i * (fontSize + this.marginY / 2), this.width, fontSize + this.marginY / 2)) {
                return i;
            }
        }
        return -1;
    }

    setX(x) {
        this.x = x;
        this.calculateSize();
        this.calculateRelations();
    }

    setY(y) {
        this.y = y;
        this.calculateSize();
        this.calculateRelations();
    }

    setName(name) {
        this.name = name;
        this.calculateSize();
    }

    addAttribute(attribute) {
        this.attributes.push(attribute);
        this.calculateSize();
    }

    removeAttribute(index) {
        this.attributes.splice(index, 1);
        this.calculateSize();
    }

    getAttribute(index) {
        return this.attributes[index];
    }

    setAttribute(index, attribute) {
        if(attribute == ""){
            this.attributes.splice(index, 1);
        }else{
            this.attributes[index] = attribute;
        }
        this.calculateSize();
    }

    addMethod(method) {
        this.methods.push(method);
        this.calculateSize();
    }
    
    addMethodConstructor(method) {
        //On Top
		this.methods.splice(0, 0, method);
        this.calculateSize();
    }

    removeMethod(index) {
        this.methods.splice(index, 1);
        this.calculateSize();
    }

    getMethod(index) {
        return this.methods[index];
    }

    setMethod(index, method) {
        if(method == ""){
            this.methods.splice(index, 1);
        }else{
            this.methods[index] = method;
        }
        this.calculateSize();
    }

    isMarked() {
        return this.marked;
    }

    setMarked(marked) {
        this.marked = marked;
    }

    getCenterX() {
        return this.centerX;
    }

    getCenterY() {
        return this.centerY;
    }

    setDrawAsObject(value) {
        this.drawAsObject = value;
    }

    addRelation(relation) {
        this.relations.push(relation);
    }

    removeRelation(relation) {
        for (let i = 0; i < relations.length; i++) {
            if (this.relations[i] == relation) {
                this.relations.splice(i, 1);
                i--;
            }
        }
    }

    getAsObject(x, y) {
        var classClone = new Class(x, y);

        classClone.setName(this.name);
        //TODO: Vererbte Attribute

        try{
            this.addAttrsOfSuper(classClone, this);
        }catch (e){
            console.log("ACHTUNG! Kreisvererbung");
            alert("ACHTUNG! Kreisvererbung");
        }

        //Objekt Parameters
        classClone.setDrawAsObject(true);
        classClone.myClass = this;

        classClone.calculateSize();

        return classClone;
    }

    addAttrsOfSuper(classClone, cClass){        
        if(cClass.superClass != null){
            this.addAttrsOfSuper(classClone, cClass.superClass);
        }
        this.addAttrs(classClone, cClass.attributes);
    }

    addAttrs(classClone, attrs){
         for (let i = 0; i < attrs.length; i++) {
            if(attrs[i].split(":").length > 1){
                if(attrs[i].charAt(0)=="+" ||  attrs[i].charAt(0)=="-" || attrs[i].charAt(0)=="#"){
                    var s = attrs[i].split(":")[0];
                    classClone.addAttribute(s.substring(1, s.length) + " = \"\"");
                }else{
                    classClone.addAttribute(attrs[i].split(":")[0] + " = \"\"");
                }
            }else{
                classClone.addAttribute(attrs[i]);
            }
        }
    }
}

