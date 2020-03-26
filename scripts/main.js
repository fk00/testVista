function newQuery(link){
    var Httpreq = new XMLHttpRequest(); 
    Httpreq.open("GET", link, false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

function addEvent(elem, type, handler){ 
    if(elem.addEventListener){
        elem.addEventListener(type, handler, false);
    } else {
        elem.attachEvent('on'+type, function(){ handler.call( elem ); });
    }
    return false;
}


var presentList = JSON.parse(newQuery('presentList.json'));
var quittingList = JSON.parse(newQuery('quittingList.json'));
console.log(presentList);

var navBlock = document.getElementById("nav");
navBlock.innerHTML = "";
var setLink = document.createElement("a");
setLink.className = "active";
setLink.id = "presentLink";
setLink.innerHTML = "Присутствуют("+presentList.length+")";
navBlock.appendChild(setLink);
setLink = document.createElement("a");
setLink.id = "quittingLink";
setLink.innerHTML = "Выбывшие("+quittingList.length+")";
navBlock.appendChild(setLink);

 var table = document.getElementById("list");
table.innerHTML = "";
var setTR = document.createElement("tr");
setTR.innerHTML = "<td>№ ИБ</td><td>ФИО</td><td>Палата</td>";
table.appendChild(setTR);
for(var i = 1; i < presentList.length+1; i++){
    setTR = document.createElement("tr");
    setTR.setAttribute('data-id', presentList[i-1]['historyNumber']);
    addEvent(setTR, 'click', findInfo);
    setTR.innerHTML = "<td>"+i+"</td><td>"+presentList[i-1]['firstName']+" "+presentList[i-1]['lastName']+"</td><td>"+presentList[i-1]['bedNumber']+"</td>";
    table.appendChild(setTR);
}

function getAge(date) {
    var d = date.split('-');
    console.log(d);
    if( typeof d[2] !== "undefined" ) return ((new Date().getTime() - new Date(date)) / (24 * 3600 * 365.25 * 1000)) | 0;

    return 0;
}

function findInfo(e){
    var id = this.getAttribute('data-id');
    var found = false;
    var obj;
    for(var i = 0; i < presentList.length; i++){
        if(presentList[i]['historyNumber'] == id){
            found = true;
            obj = presentList[i];
            break;
        }
    }
    if(!found){
        for(var i = 0; i < quittingList.length; i++){
            if(quittingList[i]['historyNumber'] == id){
                found = true;
                obj = presentList[i];
                break;
            }
        }
    }
    if(found){
        var fio = document.getElementById("about-fio");
        fio.innerHTML = obj['firstName']+" "+obj['lastName'];
        var age = document.getElementById("about-age");
        age.innerHTML = getAge(obj['birthDate']);
        var diagnosis = document.getElementById("about-diagnosis");
        diagnosis.innerHTML = obj['diagnosis'];

    }
}

function listHistories(e){
   if(!e.target.classList.contains('active')){
        var temp = document.getElementsByClassName('active');
        temp[0].className = "";
        e.target.className = "active";
        var table = document.getElementById("list");
        table.innerHTML = "";
        if(e.target.id == "presentLink"){
            var setTR = document.createElement("tr");
            setTR.innerHTML = "<td>№ ИБ</td><td>ФИО</td><td>Палата</td>";
            table.appendChild(setTR);
            for(var i = 1; i < presentList.length+1; i++){
                setTR = document.createElement("tr");
                setTR.setAttribute('data-id', presentList[i-1]['historyNumber']);
                addEvent(setTR, 'click', findInfo);
                setTR.innerHTML = "<td>"+i+"</td><td>"+presentList[i-1]['firstName']+" "+presentList[i-1]['lastName']+"</td><td>"+presentList[i-1]['bedNumber']+"</td>";
                table.appendChild(setTR);
            }
        } else if(e.target.id == "quittingLink"){
            var setTR = document.createElement("tr");
            setTR.innerHTML = "<td>№ ИБ</td><td>ФИО</td><td>Причина выбытия</td>";
            table.appendChild(setTR);
            for(var i = 1; i < quittingList.length+1; i++){
                setTR = document.createElement("tr");
                setTR.setAttribute('data-id', quittingList[i-1]['historyNumber']);
                addEvent(setTR, 'click', findInfo);
                setTR.innerHTML = "<td>"+i+"</td><td>"+quittingList[i-1]['firstName']+" "+quittingList[i-1]['lastName']+"</td><td>"+quittingList[i-1]['cause']+"</td>";
                table.appendChild(setTR);
            }
        }
   }
}

var presentLink = document.getElementById("presentLink");
addEvent(presentLink, 'click', listHistories);
var quittingLink = document.getElementById("quittingLink");
addEvent(quittingLink, 'click', listHistories);