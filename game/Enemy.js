class Enemy {
    constructor(playerLoc, translateVector, borntime){
        this.location = this.randomLoc();
        this.rotation = this.get_rotation(playerLoc);
        this.translateVector = translateVector;
        this.borntime = borntime;

    }

    // TODO: Figure out offscreen bounds by math not guess and check
    randomLoc() {
        if (Math.random() < 0.5) {
            var x = ((Math.random() < 0.5) ? -15 : 15);
            var y = Math.random() * 3;
        } else {
            var x = Math.random() * 5;
            var y = ((Math.random() < 0.5) ? -10 : 10);
        }
        return [x, y, -6];
    }

    get_rotation(playerLoc) {
        var dir = [playerLoc[0]-this.location[0], playerLoc[1]-this.location[1], this.location[2]];
        return Math.atan2(dir[1], dir[0]);
    }

    get age() {
        return this.borntime;
    }

    get translate() {
        return this.transform();
    }

    transform() {
        // Get rotation matrix
        var angle = this.rotation + this.translateVector[0];
        var rotation = SimpleMatrix.rotate(angle, 0, 0, 1);

        // Calculate tranform matrix
        var forwardVector= [Math.cos(angle) * this.translateVector[1], Math.sin(angle) * this.translateVector[1],0]
        var transform = SimpleMatrix.translate(this.location[0] + forwardVector[0], this.location[1] + forwardVector[1], this.location[2]).multiply(rotation);

        //Update location and roation after transformation
        this.location[0] += forwardVector[0];
        this.location[1] += forwardVector[1];
        this.rotation += this.translateVector[0];

        return transform;
    }
}
