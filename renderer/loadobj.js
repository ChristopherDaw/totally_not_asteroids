// readobj() reads an obj file from the index.html dom. They are stored as
// scripts currently with the id `objID`

function readobj(objID) {

    var v = [];
    var vn = [];
    var f = [];

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
                v.push(+tokens[1], +tokens[2], +tokens[3]);
                break;
            case "vn":
                vn.push(+tokens[1], +tokens[2], +tokens[3]);
                break;
            case "f":
                var position = new Array(tokens.length-1)
                for(var j=1; j<tokens.length; ++j) {
                  var indices = tokens[j].split("/")
                  position[j-1] = (indices[0]|0)-1
                }
                f.push(position)
                break;
            default:
                throw new Error("unrecognized obj directive");
        }
    }
    var ret = [];
    ret.push(v);
    ret.push(vn);
    ret.push(f);

    return ret;
}
