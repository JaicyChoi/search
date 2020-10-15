const form = document.querySelector('form');
const search = document.querySelector('.search');
const submit = document.querySelector('.submit');
const resultsElement = document.querySelector('.results');
const layer = document.querySelector('#layer');
const layer_content = document.querySelector('#layer_content');
const title = document.querySelector('.title');
const delete_value = document.querySelector('.delete_value');

title.onclick = () => {
    resultsElement.innerHTML = '';
    search.value = '';
    delete_value.classList.remove('show');
}

function enter(key){
    if(key.keyCode === 13)
        search.submit();
}

//input focus event
search.addEventListener('keyup', () => {
    if( search.value )
        delete_value.classList.add('show');
    else
        delete_value.classList.remove('show');
});
search.addEventListener('focus', () => {
    if( search.value )
        delete_value.classList.add('show');
});
delete_value.addEventListener('click', () => {
    search.value = '';
    delete_value.classList.remove('show');
    search.focus();
});

function not_found(){
    let div = document.createElement('div');
    div.classList.add('not_found');
    div.innerText = 'No matches found.'
    resultsElement.appendChild(div);
}

submit.addEventListener('click', (event) => {
    search.blur();
    event.preventDefault();
    resultsElement.innerHTML = '';
    let formData = new FormData(form);
    let keywords = formData.get('keywords');
    // let exception = /[a-zA-Z/?=&]/;
    let exception = /[c-ru-zC-RU-Z/?=&]/;
    let count = 0;

    if( keywords.trim().length === 0 || exception.test(keywords) || keywords === '.' || 
    Number(keywords) < 50 || Number(keywords) > 80 ) not_found();
    else
    {
        count = 0;
        let makeTable = function(info)
        {
            let table = document.createElement('div');
            table.classList.add('show_table');
            let tr = document.createElement('ul');

            let td_level = document.createElement('li');
            let td_level_span = document.createElement('span');
            td_level.classList.add('td_level');
            td_level_span.classList.add('level_align');
            td_level_span.innerHTML = 'Lv.'+ info.level;
            if( keywords === info.level )
                td_level_span.classList.add('highlight');
            td_level.appendChild(td_level_span);
            tr.appendChild(td_level);

            let td_hunt = document.createElement('li');
            td_hunt.classList.add('td_hunt');
            if( info.hunt === true )
            {
                let img = document.createElement('img');
                img.classList.add('hunt_icon');
                img.src = 'icon/hunt_icon.png'
                td_hunt.appendChild(img);
            }
            else if( info.hunt === 'B' || info.hunt === 'T' )
            {
                let img = document.createElement('img');
                img.classList.add('SAB_icon');
                img.src = 'icon/B_icon.png';
                td_hunt.appendChild(img);
            }
            else if( info.hunt === 'A' || info.hunt === 'S' || info.hunt === 'SS' )
            {
                let img = document.createElement('img');
                img.classList.add('SAB_icon');
                img.src = 'icon/SA_icon.png';
                td_hunt.appendChild(img);
            }
            tr.appendChild(td_hunt);

            let td_name = document.createElement('li');
            let td_name_span = document.createElement('span');
            td_name.classList.add('td_name');
            td_name_span.classList.add('name_align');
            td_name_span.innerHTML = '<a class=\'name\'>' + info.name + '</a>';
            highlight_name(td_name_span, info.name, keywords);
            td_name.appendChild(td_name_span);
            tr.appendChild(td_name);

            let td_location = document.createElement('li');
            let td_location_span = document.createElement('span');
            td_location.classList.add('td_location');
            td_location_span.classList.add('location_align');
            td_location_span.innerHTML = info.location;
            highlight_location(td_location_span, info.location, keywords);
            td_location.appendChild(td_location_span);
            tr.appendChild(td_location);

            let td_coordinate = document.createElement('li');
            let td_coordinate_span = document.createElement('span');
            td_coordinate.classList.add('td_coordinate');
            td_coordinate_span.classList.add('coordinate_align');
            td_coordinate_span.innerHTML = info.coordinate;
            td_coordinate.appendChild(td_coordinate_span);
            tr.appendChild(td_coordinate);

            let td_drop = document.createElement('li');
            let td_drop_span = document.createElement('span');
            td_drop.classList.add('td_drop');
            td_drop_span.classList.add('drop_align');

            if( info.drop !== '&nbsp' ){
                for( let i = 0 ; i < info.drop.length ; i++ ){
                    let drop_item = document.createElement('p');
                    drop_item.innerHTML = info.drop[i];

                    if( drop_item.innerText.indexOf(keywords) >= 0){
                        if( drop_item.innerText.indexOf(keywords) === 0 ){
                            drop_item.innerHTML = '<p class="drop_p"><span style="color:yellow; font-weight:bold">' + drop_item.innerText.substr(drop_item.innerText.indexOf(keywords), keywords.length) + '</span>' + drop_item.innerText.substr(keywords.length, drop_item.innerText.length) + '</p>';
                        }
                        else if( drop_item.innerText.indexOf(keywords) > 0 ){
                            if( drop_item.innerText.indexOf(keywords) + keywords.length === drop_item.innerText.length ){
                                drop_item.innerHTML = '<p class="drop_p">' + drop_item.innerText.substr(0, drop_item.innerText.indexOf(keywords)) + '<span style="color:yellow; font-weight:bold">' + drop_item.innerText.substr(drop_item.innerText.indexOf(keywords), keywords.length) + '</span></p>';
                            }
                            else{
                                drop_item.innerHTML = '<p class="drop_p">' + drop_item.innerText.substr(0, drop_item.innerText.indexOf(keywords)) + '<span style="color:yellow; font-weight:bold">' + drop_item.innerText.substr(drop_item.innerText.indexOf(keywords), keywords.length) + '</span>' + drop_item.innerText.substr(drop_item.innerText.indexOf(keywords) + keywords.length, drop_item.innerText.length) + '</p>';
                            }
                        }
                    }

                    td_drop.appendChild(drop_item);
                }
                for( let i = 0 ; i < info.drop.length ; i++ ){
                    let drop_item = document.createElement('span');
                    drop_item.innerHTML = info.drop[i];
                    td_drop_span.appendChild(drop_item);
                }
            }
            if( !td_drop.innerHTML.includes('&nbsp') )
                td_drop.id='drop';

            td_drop.appendChild(td_drop_span);       
            tr.appendChild(td_drop);

            table.appendChild(tr);
            resultsElement.appendChild(table);

            count++;
        }
        for( let key in DATA )
        {
            for( let i = 0 ; i < DATA[key].length ; i++ )
            {
                if( keywords.toUpperCase() === DATA[key][i].hunt )
                    makeTable(DATA[key][i]);
                else if( Boolean(Number(keywords)) === true && DATA[key][i].level === keywords || DATA[key][i].name.includes(keywords) || DATA[key][i].location.includes(keywords) )
                    makeTable(DATA[key][i]);
                else if( Boolean(Number(keywords)) === false){
                    for( let j = 0 ; j < DATA[key][i].drop.length ; j++ ){
                        if( DATA[key][i].drop[j].includes(keywords.toUpperCase(), 72) )
                            makeTable(DATA[key][i]);
                    }
                }
            }
        }
        for( let i = 0 ; i < resultsElement.childNodes.length ; i++ )
            resultsElement.childNodes[i].firstChild.childNodes[2].onclick = viewMap;

        if( count === 0 ) not_found();
        else
        {
            let div = document.createElement('div');
            div.classList.add('total');
            div.innerText = 'Total : '+ count;
            resultsElement.insertBefore(div, resultsElement.childNodes[0]);
        }
    }
    if( count > 0 ){
        let last_div = document.querySelectorAll('.show_table');
        last_div[last_div.length-1].classList.add('bottom_line');
    }
});

function highlight_name(span, string, keywords){
    if( string.indexOf(keywords) >= 0){
        if( string.indexOf(keywords) === 0 ){
            span.innerHTML = '<a class=\'name\'><span style="color:yellow; font-weight:bold">' + string.substr(string.indexOf(keywords), keywords.length) + '</span>' + string.substr(keywords.length, string.length) + '</a>';
        }
        else if( string.indexOf(keywords) > 0 ){
            if( string.indexOf(keywords) + keywords.length === string.length ){
                span.innerHTML = '<a class=\'name\'>' + string.substr(0, string.indexOf(keywords)) + '<span style="color:yellow; font-weight:bold">' + string.substr(string.indexOf(keywords), keywords.length) + '</span></a>';
            }
            else{
                span.innerHTML = '<a class=\'name\'>' + string.substr(0, string.indexOf(keywords)) + '<span style="color:yellow; font-weight:bold">' + string.substr(string.indexOf(keywords), keywords.length) + '</span>' + string.substr(string.indexOf(keywords) + keywords.length, string.length) + '</a>';
            }
        }
    }
}

function highlight_location(span, string, keywords){
    if( string.indexOf(keywords) >= 0){
        if( string.indexOf(keywords) === 0 ){
            span.innerHTML = '<span style="color:yellow; font-weight:bold">' + string.substr(string.indexOf(keywords), keywords.length) + '</span>' + string.substr(keywords.length, string.length);
        }
        else if( string.indexOf(keywords) > 0 ){
            if( string.indexOf(keywords) + keywords.length === string.length ){
                span.innerHTML = string.substr(0, string.indexOf(keywords)) + '<span style="color:yellow; font-weight:bold">' + string.substr(string.indexOf(keywords), keywords.length) + '</span>';
            }
            else{
                span.innerHTML = string.substr(0, string.indexOf(keywords)) + '<span style="color:yellow; font-weight:bold">' + string.substr(string.indexOf(keywords), keywords.length) + '</span>' + string.substr(string.indexOf(keywords) + keywords.length, string.length);
            }
        }
    }
}

function viewMap(){
    //console.log(this.childNodes[0].firstChild.childNodes[1].innerHTML);
    document.body.classList.add('scroll_lock');
    layer.style.visibility = 'visible';
    layer.style.opacity = 1;
    
    let img = document.createElement('img');
    img.classList.add('map');
    let found = false;

    //handling overlapped monster name
    if( this.nextSibling.innerText === '아지스 라' )
        img.src = 'map/Azys_Lla/' + this.innerText + '.jpg';
    else if( this.nextSibling.innerText === '레이크랜드' )
        img.src = 'map/Lakeland/' + this.innerText + '.jpg';
    else if( this.nextSibling.innerText === '라케티카 대삼림' )
        img.src = 'map/The_Raktika_Greatwood/' + this.innerText + '.jpg';
    else if( this.nextSibling.innerText === '일 메그' )
        img.src = 'map/Il_Mheg/' + this.innerText + '.jpg';
    else if( this.nextSibling.innerText === '콜루시아 섬' )
        img.src = 'map/Kholusia/' + this.innerText + '.jpg';
    else if( this.nextSibling.innerText === '템페스트' )
        img.src = 'map/The_Tempest/' + this.innerText + '.jpg';
    else
        for( let key in DATA)
        {
            for( let i = 0 ; i < DATA[key].length; i++ )
                if( DATA[key][i].name === this.innerText )
                {
                    img.src = 'map/' + key + '/'+ this.innerText + '.jpg';
                    found = true; break;
                }
            if( found === true ) break;
        }

    let info = document.createElement('div');
    info.classList.add('info');

    if( this.nextSibling.nextSibling.innerText === '지도 참조' )
        info.innerText = this.innerText;
    else
        info.innerText = this.innerText + ' ' + this.nextSibling.nextSibling.innerText;

    layer_content.appendChild(info);
    layer_content.appendChild(img);
    
    window.onkeyup = function(esc){
        let key = esc.keyCode ? esc.keyCode : esc.which;

        if( key === 27)
        {
            layer.style.visibility = 'hidden';
            layer.style.opacity = 0;
            layer_content.removeChild(info);
            layer_content.removeChild(img);
        }
    }

    layer.onclick = function(){
        layer.style.visibility = 'hidden';
        layer.style.opacity = 0;
        layer_content.removeChild(info);
        layer_content.removeChild(img);
        document.body.classList.remove('scroll_lock');
    }
}

$(window).scroll(function(event){
    var scroll = $(window).scrollTop();
  if (scroll >= 50) {
      $(".top_button").addClass("show");
  } else {
      $(".top_button").removeClass("show");
  }
});

$('a').click(function(){
  $('html, body').animate({
      scrollTop: $( $(this).attr('href') ).offset().top
  }, 1000);
});