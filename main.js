const searchWrap = document.querySelector(".searchWrap");
const searchButton = document.querySelector(".searchButton");
const currentLocation = document.querySelector(".currentLocation");
const searchLocation = document.querySelector(".searchLocation");
const topBar = document.querySelector(".topBar");
const searchLocationOnMap = document.querySelector(".searchLocationOnMap");
const searchButtonOnMap = document.querySelector(".searchButtonOnMap");


const mapContainer = document.querySelector("#map");
let locationValue = "";


// 지역검색, 주소=>좌표 변환 함수
function findCoords(locationValue) {
    naver.maps.Service.geocode({
        query : locationValue
    }, function(status, response) {
        if(status === naver.maps.Service.Status.Error) {
            if(!address) return alert("주소가 맞지않음. 정확한 주소를 입력");

            return alert("Geocode 에러, 주소: " + locationValue);
        }
        if(response.v2.meta.totalCount === 0) return alert("결과가 검색되지 않음");

        let item = response.v2.addresses[0],
            point = new naver.maps.Point(item.x, item.y);

            map.setCenter(point);
    });
}


// 주소검색으로 이동
searchButton.addEventListener("click", e => {
    locationValue = searchLocation.value;
    eventHandle(e);

    findCoords(locationValue);
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

// 맵상에서 주소검색
searchButtonOnMap.addEventListener("click", e => {
    e.preventDefault();
    locationValue = searchLocationOnMap.value;

    findCoords(locationValue);
})

// 이벤트핸들(화면넘김막기)
function eventHandle(e) {
    e.preventDefault();
    searchWrap.style.display = "none";
    mapContainer.style.display = "block";
    topBar.style.display = "block";
}   

let mapOptions = {zoom: 13};
// 맵 생성
let map = new naver.maps.Map('map', mapOptions);
let markerList = [];



const url = "https://api.odcloud.kr/api/15077586/v1/centers?page=1&perPage=1000&" + 
"serviceKey=gNWiWkY9fyJ3dGm%2FIwxImL9MOl930bOHlSItvNS%2BPPZVQZuouadlFyn5sLYy9HEFkGLcEanPhYPDM8uN9f6j1w%3D%3D";
let centerList = null;
//공공데이터포털 api 참조, 백신센터조회
async function getCenterList() {
    let response = await fetch(url);
    let result = await response.json();
    markerList = createMarker(result.data);
}



function createMarker(data){
    data.forEach(element => {
        let marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(element.lng, element.lat),
            map: map,
            icon: {
                url: "syringe1.png",
                origin: new naver.maps.Point(0, 0),
                anchor: new naver.maps.Point(11, 35)
            }
        })
        markerList.push(marker);
    })
    console.log(markerList);
}

getCenterList();

