// readobj() reads an obj file from the index.html dom. They are stored as
// scripts currently with the id `objID`

function readobj(objID) {

    var positions = [];
    var normals = [];
    var triIndices = [];

    var objText = document.getElementById(objID).innerHTML;
    var lines = objText.split('\n');

    for (var i = 0; i < lines.length; i++) {
        if (lines[i].length == 0) {
            continue;
        }

        var tokens = lines[i].split(" ");
        switch(tokens[0]) {
            case "":
                break;
            case "v":
                positions.push(+tokens[1]);
                positions.push(+tokens[2]);
                positions.push(+tokens[3]);
                break;
            case "vn":
                normals.push(+tokens[1]);
                normals.push(+tokens[2]);
                normals.push(+tokens[3]);
                break;
            case "f":
                var position = new Array(tokens.length-1)
                for(var j=1; j<tokens.length; ++j) {
                  var indices = tokens[j].split("/")
                  position[j-1] = (indices[0]|0)-1
                }
                triIndices.push(position[0])
                triIndices.push(position[1])
                triIndices.push(position[2])
                break;
            default:
                throw new Error("unrecognized obj directive");
        }
    }
    var ret = [];
    ret.push(positions);
    ret.push(normals);
    ret.push(triIndices);

    return ret;
}
