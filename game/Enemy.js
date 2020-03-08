class Enemy {
    constructor(playerLoc, borntime){
        this.enemyType = this.getType();
        this.location = this.randomLoc();
        this.rotation = this.getRotation(playerLoc);
        this.translateVector = this.getVector();
        this.borntime = borntime;
    }

    getVector() {
        switch (this.enemyType) {
            case 0:
                return [0, 0.075, 0];
            case 1:
                return [0, 0.125, 0];
            case 2:
                return [0, 0.175, 0];
            case 3:
                return [0, 0.222, 0];
            default:
                return [0, 0.075, 0];
        }
    }


    //                                 (    0    ,     1     ,   2   ,  3 )
    // Randomly generate type of enemy (dark blue, light blue, orange, red)
    // with different properties (speed, tracking) from easy to hard
    getType() {
        // Probabilities for enemy types:
        // 0 = 70%, 1 = 17%, 2 = 10%, 3 = 3%
        // Math.random() is in the range [0, 1]
        var rand = Math.random();
        if (rand < 0.7) {
            return 0;
        } else if (rand < 0.87) {
            return 1;
        } else if (rand < 0.97) {
            return 2;
        } else if (rand < 1.0) {
            return 3;
        }
    }

    // TODO: Figure out offscreen bounds by math not guess and check
    randomLoc() {
        if (Math.random() < 0.5) {
            var x = ((Math.random() < 0.5) ? -15 : 15);
            var y = (Math.random()-0.5) * 10;
        } else {
            var x = (Math.random()-0.5) * 15;
            var y = ((Math.random() < 0.5) ? -10 : 10);
        }
        return [x, y, -6];
    }

    getRotation(playerLoc) {
        var dir = [playerLoc[0]-this.location[0], playerLoc[1]-this.location[1], this.location[2]];
        return Math.atan2(dir[1], dir[0]);
    }

    get color() {
        switch (this.enemyType) {
            case 0:
                return [3, 100, 70];
            case 1:
                return [62, 146, 204];
            case 2:
                return [238, 132, 52];
            case 3:
                return [216, 49, 91];
        }
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
