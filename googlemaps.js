/*!
 * Google Maps API Call
 */
var locations = [
    {
        "Lng": 6.322030000000041,
        "Lat": 51.07336,
        "label": "Zentrale Erkelenz",
        "address": "Kölner Straße 76, 41812 Erkelenz"
    },
    {
        "Lng": 10.132931999999983,
        "Lat": 54.3266026,
        "label": "Aussenstelle Kiel", "address": "Muhliusstraße 53, 24103 Kiel"
    }, {
        "Lng": 9.936374999999998,
        "Lat": 53.5725716,
        "label": "Aussenstelle Hamburg",
        "address": "Große Bahnstraße 33, 22525 Hamburg"
    }, {
        "Lng": 13.380115199999977,
        "Lat": 52.5738766,
        "label": "Aussenstelle Berlin",
        "address": "Frühlingstraße 8, 13158 Berlin"
    }, {
        "Lng": 9.987250000000017,
        "Lat": 52.16434,
        "label": "Aussenstelle Hildesheim",
        "address": "Daimlerring 27, 31135 Hildesheim"
    }, {
        "Lng": 8.485824099999945,
        "Lat": 49.9185585,
        "label": "Aussenstelle Groß-Gerau",
        "address": "Am Marktplatz 19, 64521 Groß-Gerau"
    }, {
        "Lng": 9.780019100000004,
        "Lat": 49.1039293,
        "label": "Aussenstelle Schwäbisch Hall",
        "address": "Weinbrennerweg 2, 74523 Schwäbisch Hall"
    }, {
        "Lng": 8.612345699999992,
        "Lat": 49.6995735,
        "label": "Aussenstelle Bensheim",
        "address": "Heimrodstraße 14, 64625 Bensheim"
    }
];


function initMap() {
    zoom = 6;
    return map = new google.maps.Map(document.getElementById("map"), {
        zoom: zoom,
        //center: {lat: 51.163375, lng: 10.447683} // Geographische Mitte Deutschlands
        center: {lng: 10.447683, lat: 52.16434}, // Geographische Mitte Ost-West und höhe Hildesheim
        shown: false
    });
}


function addMarker(i, map) {
    return function () {
        locations[i].marker = new google.maps.Marker({
            map: map,
            position: {lat: locations[i].Lat, lng: locations[i].Lng},
            dataid: i,
            animation: google.maps.Animation.DROP
        });
        locations[i].infowindow = new google.maps.InfoWindow({
            content: "<h3>" + locations[i].label + "</h3><p>" + locations[i].address + "</p>"
        });
        locations[i].marker.addListener("click", function () {
            for (var p = 0; p < locations.length; p++) {
                if (this.dataid != p && locations[p].hasOwnProperty("infowindow")) {
                    locations[p].infowindow.close();
                    locations[p].marker.setAnimation(null)
                }
            }
            locations[this.dataid].infowindow.open(map, locations[this.dataid].marker);
            locations[0].marker.setAnimation(google.maps.Animation.BOUNCE);
        });
        if (i === 7) {
            window.setTimeout(function () {
                locations[0].infowindow.open(map, locations[0].marker)
                locations[0].marker.setAnimation(google.maps.Animation.BOUNCE);
            }, 1000);
        }
    }
}


function buildObserver(selector, func) {
    if (!("IntersectionObserver" in window)) {
        console.log("No IntersectionObserver running " + func.name + " immediately");
        func();
        return false;
    } else {
        console.log("building IntersectionObserver for " + selector);
        // It is supported, load the observer
        observer = new IntersectionObserver(func, config);
        var mapdom = document.querySelectorAll(selector);
        observer.observe(mapdom[0]);
        return observer;
    }
}


function animateMap(entry) {
    if (!("IntersectionObserver" in window) && map.shown !== !0) {
        console.log("No IntersectionObserver, running animateMap");
        map = initMap();
        for (var i = 0; i < locations.length; i++) {
            locations[i].timeOut = window.setTimeout(addMarker(i, map), (500 * i) + 1500);
        }
        map.shown = !0;
    } else if (map.shown === !0 && ("IntersectionObserver" in window)) {
        console.log("Intersection already triggered, disconnecting Map-Observer");
        gmapobserver.disconnect();
    } else if (!map.shown && entry[0].intersectionRatio > 0 && ("IntersectionObserver" in window)) {
        map = initMap();
        console.log("Intersection triggering, running animateMap");
        for (var i = 0; i < locations.length; i++) {

            locations[i].timeOut = window.setTimeout(addMarker(i, map), (500 * i) + 1500);
        }
        map.shown = !0;
    }
}

function insertIframe(entry) {
    var placeholder = jQuery("div#iframe");
    var inserted = jQuery("div#iframe iframe");
    var iframe = "<iframe style=\"width:100%;height:500px;\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" src=\"https://maps.google.com/maps?f=q&amp;source=s_q&amp;q=A%20%26%20A%20ARBEITSSCHUTZ%2C%20K%C3%B6lner%20Str.%2076%2C%2041812%20Erkelenz&amp;aq=0&amp;ie=UTF8&amp;t=m&amp;z=15&amp;iwloc=A&amp;output=embed\"></iframe>";
    if (!("IntersectionObserver" in window)) {
        console.log("No IntersectionObserver, running insertIframe");
        placeholder.append(iframe);
    } else if (inserted.length > 0) {
        console.log("Intersection already triggered, disconnecting IFrame-Observer");
        iframeobserver.disconnect();
    } else if (inserted.length < 1 && entry[0].intersectionRatio > 0) {
        console.log("Intersection triggering, running insertIframe");
        placeholder.append(iframe);
    }
}

function centerMap() {
    if (map.shown == !0) map.setCenter(new google.maps.LatLng({lng: 10.447683, lat: 52.16434}));
}
function zoomMap(mediaQuery) {
    if (map.shown == !0) {
        if (mediaQuery) {
            map.setZoom(6); // Zoom in on large devices
        } else {
            map.setZoom(5); // Zoom out on small devices
        }
        window.setTimeout(centerMap, 200);
    }
}

var map = {
    setZoom: function(){}
};

mediaQueryResponse.addResponse("medium", zoomMap);
mediaQueryResponse.init();

var gmapobserver = buildObserver(".mapid", animateMap);
var iframeobserver = buildObserver(".iframeid", insertIframe);
