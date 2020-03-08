function Menu(){
    //If Menu not displayed, display menu
    //Hide controls and end
    if(document.getElementById("menu").style.display == "none"){
        document.getElementById("menu").style.display = "block";
        document.getElementById("controls").style.display = "none";
        document.getElementById("end").style.display = "none";
    }
}

function EndScreen(){
    //If Endscreen not displayed, display endscreen
    //Hide controls and menu
    if(document.getElementById("end").style.display == "none"){
        document.getElementById("end").style.display = "block";
        document.getElementById("controls").style.display = "none";
        document.getElementById("menu").style.display = "none";
    }
}