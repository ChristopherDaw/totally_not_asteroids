class Cloud {
    constructor(playerLoc, borntime){
        this.location = [playerLoc[0],playerLoc[1],playerLoc[2]];
        this.borntime = borntime;
        this.scale = [0.15, 0.15, 0.15]
    }

    get age() {
        return this.borntime;
    }

    get translate() {
        return this.transform();
    }


    transform() {
        var scale = SimpleMatrix.scale(this.scale[0], this.scale[1], this.scale[2]);
        // Calculate tranform matrix
        var transform = SimpleMatrix.translate(this.location[0], this.location[1], this.location[2]).multiply(scale);

        for(var i = 0; i < this.scale.length; i++){
            this.scale[i] *= 0.95;
        }
    

        return transform;
    }
}