class Line {
    constructor(r1, r2, i, max) {
        this.r1 = r1;
        this.r2 = r2;
        this.i = i;
        this.marked = false;
    }

    calcPos() {

    }
}

class Button {
    constructor(x, y, width, height, name, pic, visible,subButtons) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.name = name;
        this.pic = loadImage(pic);
        this.isMarked = false;
        this.visible = visible;
        this.subButtons = subButtons;
    }

    draw() {

        if (this.visible) {
            fill(255);
            if (this.isMarked) {
                stroke(31, 177, 76);
            } else {
                stroke(0);
            }

            rect(this.x, this.y, this.width, this.height);
            image(this.pic, this.x + 14, this.y + 7, this.width - 28, this.height - 28);

            noStroke();
            fill(0);
            text(this.name, this.x + (this.width / 2 - textWidth(this.name) / 2), this.y + this.height - 5);
        }
    }

    checkHitbox() {
        return this.visible && (mouseX >= this.x && mouseX <= this.x + this.width && mouseY >= this.y && mouseY <= this.y + this.height);
    }


}

