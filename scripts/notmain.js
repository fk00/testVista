/* Выгружаем данные */
function loadGoods(link){
    var Httpreq = new XMLHttpRequest(); // новый запрос
    Httpreq.open("GET", link, false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

var itemList = JSON.parse(loadGoods('shop.json'));

/* Получаем GET данные */
var $_GET = (function() {
    var a = window.location.search;
    var b = new Object();
    a = a.substring(1).split("&");
    for (var i = 0; i < a.length; i++) {
    c = a[i].split("=");
        b[c[0]] = c[1];
    }
    return b;
})();

/* Немного переменных */
var g_iPage = 1; // Текущая страница
var g_iPageMax = 15; // Товаров на странице
var g_iPageOffset = 0; // Смещение
var g_iPageNum = 0;

var temp = $_GET['page'];
g_iPageNum = Math.ceil(itemList.length / g_iPageMax);

if(temp && temp > 1 && temp <= g_iPageNum) g_iPage = $_GET['page']; 
g_iPageOffset = (g_iPage-1)*g_iPageMax;


/* Выгружаем нужные товары */
var divGoods = document.getElementById("goods");
divGoods.innerHTML = "";

/* Сортировки */
var createSort = document.createElement("div");
createSort.id = "sort";
createSort.className = "shadow";
divGoods.appendChild(createSort);
// Прайс
var sortByPrice = document.createElement("select");
sortByPrice.id = "sortByPrice";
createSort.appendChild(sortByPrice);

sortByPrice.options[0] = new Option("Без фильтра", "0");
sortByPrice.options[1] = new Option("От наименьшей цены", "1");
sortByPrice.options[2] = new Option("От наибольшей цены", "2");

// Наличие
var setLabel = document.createElement("label");
var sortData = getData('sort') || {};
if(!sortData.hasOwnProperty(0)) sortData[0] = 0;
if(!sortData.hasOwnProperty(1)) sortData[1] = 0;
setData('sort', sortData);
var g_iTempSort = sortData[1];
sortByPrice.options[g_iTempSort].selected = true;
sortByPrice.onclick = function(e) {
    var check = e.target.selectedIndex;
    if(g_iTempSort != check){
        sortData[1] = check;
        setData('sort', sortData);
        window.open("/?page="+g_iPage, '_self');
    }
}
if(sortData[0] == 1) setLabel.innerHTML = "<input type=\"checkbox\" id=available checked> Сначала те, что в наличии";
else setLabel.innerHTML = "<input type=\"checkbox\" id=available> Сначала те, что в наличии";


setLabel.onclick = function(){
    var isAvailable = document.getElementById('available');
    if(isAvailable.checked){
        sortData[0] = 1;
        setData('sort', sortData);
    } else {
        sortData[0] = 0;
        setData('sort', sortData);
    }
    window.open("/?page="+g_iPage, '_self');
}
createSort.appendChild(setLabel);
if(sortData[1] == 1) {
    itemList.sort((prev, next) => prev['price'] - next['price']);
} else if(sortData[1] == 2) {
    itemList.sort((prev, next) => next['price'] - prev['price']);
}
if(sortData[0] == 1){
    itemList.sort(function(x, y) {
        return (x['available'] === y['available'])? 0 : x['available']? -1 : 1;
        //return (x['available'] === y['available'])? 0 : x['available']? 1 : -1;
    });
}

/* * */
for(var i = g_iPageOffset; i < (g_iPageOffset+g_iPageMax); i++){
    if(i > itemList.length-1) break;
    var newGood = document.createElement("div");
    newGood.className = "good shadow";
    divGoods.appendChild(newGood);
    var setImg = document.createElement("img");
    setImg.src = itemList[i]['image'];
    newGood.appendChild(setImg);
    var setAbout = document.createElement("div");
    setAbout.className = "about";
    newGood.appendChild(setAbout);
    var setTitle = document.createElement("h2");
    setTitle.innerHTML = itemList[i]['title'];
    setAbout.appendChild(setTitle);
    var setPrice = document.createElement("p");
    setPrice.className = "price";
    setPrice.innerHTML = itemList[i]['price']+" рублей";
    setAbout.appendChild(setPrice);
    var setDesc = document.createElement("p");
    setDesc.className = "desc";
    setDesc.innerHTML = itemList[i]['descr'];
    setAbout.appendChild(setDesc);
    var bPos = document.createElement("div");
    bPos.className = "b-pos";
    setAbout.appendChild(bPos);
    var setButton = document.createElement("div");
    if(itemList[i]['available']){
        setButton.className = "button";
        setButton.setAttribute('data-id', itemList[i]['id']);
        setButton.innerHTML = "Добавить в корзину";
        addEvent(setButton, 'click', addToCart);
    } else {
        setButton.className = "button disabled";
        setButton.innerHTML = "Нет в наличии";
    }
    bPos.appendChild(setButton);
}
loadCart();
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* Пагинация */
function addPage(page){
    var pager = document.createElement("div");
    if(page < 0 || page > g_iPageNum) return;
    if(page != 0){
        pager.innerHTML = page;
        if(page == g_iPage) pager.className = "page s-shadow active";
        else {
            pager.className = "page s-shadow";
            pager.onclick = function(){
                window.open("/?page="+page, '_self');
            }
        }
    } else {
        pager.innerHTML = '...';
        pager.className = "page empty";
    }
    pageBlock.appendChild(pager);
}

var pageBlock = document.createElement("div");
pageBlock.id = 'pages';
divGoods.appendChild(pageBlock); 

var prev = g_iPage-1;
var next = g_iPage;
next++;
// <
if(g_iPage > 1){
    var goBack = document.createElement("div");
    goBack.className = "page s-shadow";
    goBack.innerHTML = "<";
    goBack.onclick = function(){
        var open = g_iPage-1;
        window.open("/?page="+open, '_self');
    }
    pageBlock.appendChild(goBack);
}
// first
addPage(1);
if(prev > 1 && prev != 0) addPage(0);
if(prev > 1) addPage(prev);
if(g_iPage > 1 && g_iPage < g_iPageNum) addPage(g_iPage);
if(next < g_iPageNum)addPage(next);
if(g_iPageNum-g_iPage > 1 && (g_iPageNum-g_iPage) != 0) addPage(0);
// last
addPage(g_iPageNum);
// >
if(g_iPage < g_iPageNum){
    var goNext = document.createElement("div");
    goNext.className = "page s-shadow";
    goNext.innerHTML = ">";
    goNext.onclick = function(){
        var open = g_iPage+1;
        window.open("/?page="+open, '_self');
    }
    pageBlock.appendChild(goNext);
}
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* Корзина */
function addEvent(elem, type, handler){
    if(elem.addEventListener){
        elem.addEventListener(type, handler, false);
    } else {
        elem.attachEvent('on'+type, function(){ handler.call( elem ); });
    }
    return false;
}

function getData(name){
    return JSON.parse(localStorage.getItem(name));
}

function setData(name, o){
    localStorage.setItem(name, JSON.stringify(o));
    return false;
}

function addToCart(e){
    this.disabled = true;
    var cartData = getData('cart') || {};
    var id = this.getAttribute('data-id'); 
    if(cartData.hasOwnProperty(id-1)) cartData[id-1][0] += 1;
     else cartData[id-1] = [1];
    if(!setData("cart", cartData)) this.disabled = false; 
    loadCart();
    return false;
}

function loadCart(){
    var cartData = getData('cart');
    var divCart = document.getElementById("cart");
    divCart.innerHTML = "";
    var endPrice = 0;
    if(cartData !== null){
        for(var items in cartData){
            var item = items;
            if(sortData[0] == 1 || sortData[1] > 0){
                for(var i = 0; i < itemList.length; i++) {
                    if(itemList[i].id == (Number.parseInt(item)+1)) {
                        item = i;
                        break;
                    }
                }
            }
            endPrice += cartData[items][0]*itemList[item]['price']; 
            var setItem = document.createElement("div");
            setItem.className = "item";
            divCart.appendChild(setItem);
            var setImg = document.createElement("img");
            setImg.src = itemList[item]['image'];
            setItem.appendChild(setImg);
            var setInfo = document.createElement("div");
            setInfo.className = "item-info";
            setItem.appendChild(setInfo);
            var infoTitle = document.createElement("p");
            infoTitle.className = "item-title";
            infoTitle.innerHTML = itemList[item]['title'];
            setInfo.appendChild(infoTitle);
            var infoCount = document.createElement("p");
            infoCount.className = "item-count";
            infoCount.innerHTML = "x"+cartData[items][0];
            setInfo.appendChild(infoCount);
            var xPos = document.createElement("div");
            xPos.className = "x-pos";
            setItem.appendChild(xPos);
            var xLink = document.createElement("a");
            xLink.innerHTML = "x";
            xLink.setAttribute('remove-id', itemList[item]['id']);
            //addEvent(xLink, 'click', removeData);
            xLink.onclick = function(e){
                e.preventDefault;
                var t = e.target.getAttribute("remove-id");
                delete cartData[t-1];
                setData("cart", cartData);
                var but = document.querySelector("[data-id=\""+t+"\"]");
                if(but !== null){
                    var parent = but.parentNode;
                    parent.getElementsByClassName("c-info")[0].remove();
                }
                var count = 0;
                for(var key in cartData){
                    count++;
                    break;
                }

                if(count == 0) localStorage.removeItem('cart');
                loadCart();
            }
            xPos.appendChild(xLink);
            if(sortData[0] == 1 || sortData[1] > 0){
                var but = document.querySelector("[data-id=\""+(Number.parseInt(items)+1)+"\"]");
            } else var but = document.querySelector("[data-id=\""+(Number.parseInt(item)+1)+"\"]");
            if(but !== null){
                var parent = but.parentNode;
                var setInfo = document.createElement("p");
                setInfo.className = "c-info";
                setInfo.innerHTML = "Добавлено: <strong>"+cartData[items][0]+" товаров</strong>";
                if(parent.getElementsByClassName("c-info").length > 0){
                    var replace = parent.getElementsByClassName("c-info")[0];
                    parent.replaceChild(setInfo, replace);
                } else parent.appendChild(setInfo);
            }
            
        }
        var setMessage = document.createElement("p");
        setMessage.className = "fprice";
        setMessage.innerHTML = "итог";
        divCart.appendChild(setMessage);
        var setPrice = document.createElement("p");
        setPrice.className = "price";
        setPrice.innerHTML = endPrice + " рублей";
        divCart.appendChild(setPrice);
        var setButton = document.createElement("div");
        setButton.className = "button active";
        setButton.innerHTML = "Заказать";
        divCart.appendChild(setButton);
    } else {
        var setMessage = document.createElement("p");
        setMessage.className = "fprice";
        setMessage.innerHTML = "Добавьте товар в корзину";
        divCart.appendChild(setMessage);
    }
    return false;
}
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */