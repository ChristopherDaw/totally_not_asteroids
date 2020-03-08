//We only check the x and y axis because we have no z movement
function pointBoxCollision(point, location, box) {
    return (point[0] >= location[0] + box[0] && point[0] <= location[0] + box[1]) &&
           (point[1] >= location[1] + box[2] && point[1] <= location[1] + box[3]) ;
}

function BoxCollision(locationA, boxA, locationB, boxB) {
    return (locationA[0] + boxA[0] <= locationB[0] + boxB[1] && locationA[0] +boxA[1] >= locationB[0] +boxB[0]) &&
           (locationA[1] + boxA[2] <= locationB[1] + boxB[3] && locationA[1] + boxA[3] >= locationB[1] + boxB[2]);
}

function generateBoundingBox(points){
    var minX = 0, maxX = 0, minY = 0, maxY = 0, minZ = 0, maxZ = 0;

    for(var i = 0; i < points.length; i++){
        //Determine if max or min X
        if(points[i] <= minX)
            minX = points[i];
        if(points[i] >= maxX)
            maxX = points[i];
        
        //Determine if max or min Y
        if(points[i+1] <= minY)
            minY = points[i+1];
        if(points[i+1] >= maxY)
            maxY = points[i+1];
        
        //Determine if max or min Z
        if(points[i+2] <= minZ)
            minZ = points[i+2];
        if(points[i+2] >= maxZ)
            maxZ = points[i+2];

        i += 3;
    };

    return [minX, maxX, minY, maxY, minZ, maxZ];
}