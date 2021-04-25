const searchWrap = document.querySelector(".searchWrap");
const searchButton = document.querySelector(".searchButton");
const currentLocation = document.querySelector(".currentLocation");
const searchLocation = document.querySelector(".searchLocation");


const mapContainer = document.querySelector("#map");
let locationValue = "";


// 주소검색으로 이동
searchButton.addEventListener("click", e => {
    locationValue = searchLocation.value;
    eventHandle(e);

    naver.maps.Service.geocode({
        query : locationValue
    }, function(status, response) {
        if(status === naver.maps.Service.Status.Error) {
            if(!address) return alert("주소가 맞지않음. 정확한 주소를 입력");

            return alert("Geocode 에러, 주소: " + locationValue);
        }
        if(response.v2.meta.totalCount === 0) return alert("결과가 검색되지 않음");

        console.log(response);
        let item = response.v2.addresses[0],
            point = new naver.maps.Point(item.x, item.y);

            map.setCenter(point);
    });
})

// 현재위치로 이동
currentLocation.addEventListener("click" , e => {
    locationValue = "currentLocation";
    eventHandle(e);

    navigator.geolocation.getCurrentPosition(position => {
        let currentCoords = new naver.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.setCenter(currentCoords);
    });
})

function eventHandle(e) {
    e.preventDefault();
    searchWrap.style.display = "none";
    mapContainer.style.display = "block";
}

let mapOptions = {zoom: 15};
// 맵 생성
let map = new naver.maps.Map('map', mapOptions);


const url = "https://api.odcloud.kr/api/15077586/v1/centers?page=1&perPage=204&" + 
    "serviceKey=gNWiWkY9fyJ3dGm%2FIwxImL9MOl930bOHlSItvNS%2BPPZVQZuouadlFyn5sLYy9HEFkGLcEanPhYPDM8uN9f6j1w%3D%3D";

async function getCenterList() {
    let response = await fetch(url);
    if(response.ok){
        return await response.json(); 
    } else {
        alert("HTTP-Error: " + response.status);
    }
}