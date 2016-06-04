
var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";


/**
 * Prijava v sistem z privzetim uporabnikom za predmet OIS in pridobitev
 * enolične ID številke za dostop do funkcionalnosti
 * @return enolični identifikator seje za dostop do funkcionalnosti
 */
function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
                "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}

/**
 * Generator podatkov za novega pacienta, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati novega pacienta z
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */
function generirajPodatke(stPacienta) {
  // TODO: Potrebno implementirati
 var sessionId = getSessionId();
 var ime, priimek, datumRojstva,datumInUra = "";
 var ehrId = "";

    switch(stPacienta){
        case 1: 
            ime = "Jure";
            priimek = "Brezgat";
            datumRojstva = "1945-03-30T13:21"; 
            break;
        case 2:
            ime = "Milan";
            priimek ="Brezrok"; 
            datumRojstva ="1987-05-01T23:23"; 
            break;
        case 3:
            ime = "Matjaž";
            priimek ="Brezgozda"; 
            datumRojstva ="1996-01-30T15:15"; 
            break;
    }
    
    $.ajaxSetup({
		    headers: {"Ehr-Session": sessionId}
		});
		$.ajax({
		    url: baseUrl + "/ehr",
		    type: 'POST',
		    success: function (data) {
		        ehrId = data.ehrId;
		        var partyData = {
		            firstNames: ime,
		            lastNames: priimek,
		            dateOfBirth: datumRojstva,
		            partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
		        };
		        $.ajax({
		            url: baseUrl + "/demographics/party",
		            type: 'POST',
		            contentType: 'application/json',
		            data: JSON.stringify(partyData),
		            success: function (party) {
		                if (party.action == 'CREATE') {
		                   
		                    var addToOption = document.createElement("option");
		                    addToOption.value = ehrId;
		                    addToOption.text = ime + " " + priimek;
		                    
		                    $("#preberiObstojeciEHR").append(addToOption);
		                    
		                    zapisiVitalneZnake(ehrId,stPacienta);
		                    
		                    //console.log("ehrId: "+ehrId);
		                    return ehrId;
		                }
		            },
		            error: function(err) {
		            	console.log("Napaka!");
		            	return null;
		            }
		        });
		    }
		});
}

function zapisiVitalneZnake(ehrId,stPacienta){
    if(stPacienta == 1){
        podatkiZaPacienta(ehrId,"1960-07-01T13:16Z","15,8","99,3","36,6");
        podatkiZaPacienta(ehrId,"1962-02-01T12:25Z","15,9","99,2","36,5");
        podatkiZaPacienta(ehrId,"1964-03-01T11:14Z","16,0","99,1","37,5");
        podatkiZaPacienta(ehrId,"1965-12-01T09:27Z","16,8","99,6","36,8");
        podatkiZaPacienta(ehrId,"1967-10-01T10:04Z","17,0","99,3","35,9");
        podatkiZaPacienta(ehrId,"1977-01-01T08:09Z","16,9","99,5","36,1");
    } else if (stPacienta == 2) {
        podatkiZaPacienta(ehrId,"1997-04-30T21:20Z","19,5","67,0","35,1");
        podatkiZaPacienta(ehrId,"2000-03-20T08:09Z","20,1","68,5","36,1");
        podatkiZaPacienta(ehrId,"2003-01-10T08:10Z","20,5","65,3","36,2");
        podatkiZaPacienta(ehrId,"2005-08-15T08:11Z","20,8","72,1","35,7");
        podatkiZaPacienta(ehrId,"2010-11-12T08:22Z","21,9","71,0","34,5");
        podatkiZaPacienta(ehrId,"2015-09-07T08:34Z","22,5","63,1","38,9");
    } else {
        podatkiZaPacienta(ehrId,"2016-01-30T00:00Z","19,0","78,0","36,9");
        podatkiZaPacienta(ehrId,"2016-02-28T21:21Z","19,0","78,1","36,7");
        podatkiZaPacienta(ehrId,"2016-03-30T22:11Z","19,0","79,0","36,1");
        podatkiZaPacienta(ehrId,"2016-04-11T23:59Z","19,0","81,3","36,4");
        podatkiZaPacienta(ehrId,"2016-05-12T10:58Z","19,1","82,4","37,5");
        podatkiZaPacienta(ehrId,"2016-06-05T07:23Z","19,1","81,0","35,9");
    }
    
}

function podatkiZaPacienta(ehrId,ura,visina,teza,temperatura){
   sessionId = getSessionId();
   //console.log("visina: "+visina+", teza: "+teza);
    $.ajaxSetup({
    	    headers: {"Ehr-Session": sessionId}
    	});
    	var podatki = {
    		// Struktura predloge je na voljo na naslednjem spletnem naslovu:
      // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
    	    "ctx/language": "en",
    	    "ctx/territory": "SI",
    	    "ctx/time": ura,
    	    "vital_signs/height_length/any_event/body_height_length": visina,
    	    "vital_signs/body_temperature/any_event/body_height_length|unit": "cm",
    	    "vital_signs/body_weight/any_event/body_weight": teza,
    	   	"vital_signs/body_temperature/any_event/temperature|magnitude": temperatura,
    	    "vital_signs/body_temperature/any_event/temperature|unit": "°C",
    	};
    	var parametriZahteve = {
    	    ehrId: ehrId,
    	    templateId: 'Vital Signs',
    	    format: 'FLAT',
    	};
    	$.ajax({
    	    url: baseUrl + "/composition?" + $.param(parametriZahteve),
    	    type: 'POST',
    	    contentType: 'application/json',
    	    data: JSON.stringify(podatki),
    	    success: function (res) {
    	        //console.log("USPEŠNO!");
    	        $("#uspesno").html("<span class='obvestilo label label-success fade-in'>Uspešno zgenerirane vitalne meritve za 3 osebe!</span>");
    	    },
    	    error: function(err) {
    	    	//console.log("NEUSPEŠNO!");
    	    	$("#uspesno").append("<span class='obvestilo label label-danger fade-in'>NEUSPESNO!</span>");
    	    }
    	});

}

function izpisiGeneriranePodatke(){
    for(var i = 1; i <=3 ; i++){
        generirajPodatke(i);
    }
}

// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija

function vrniVisino(ehrId,callback){
	sessionId = getSessionId();
	
	if (!ehrId || ehrId.trim().length == 0) {
		$("#preberiSporocilo").html("<span class='obvestilo label label-warning " +
      "fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
	    $.ajax({
	       url:baseUrl + "/demographics/ehr/" + ehrId + "/party",
	       type: 'GET',
	       headers: {"Ehr-Session":sessionId},
	       success: function (data){
	           var party = data.party;
	           //console.log("IME: "+party.firstNames+" priimek: "+ party.lastNames+" dat. rojstva: "+party.dateOfBirth);
	           $.ajax({
	              url:baseUrl+"/view/"+ehrId+"/height",
	              type:'GET',
	              headers:{"Ehr-Session":sessionId},
	              success:function(res){
	                  if(res.length > 0){
	                      callback(res);
	                  }
	              },
	              error:function(){
	                  console.log("NAPAKA!");
	                  return null;
	              }
	           });
	       }
	    });
	}
	
}

function vrniTezo(ehrId,callback){
	sessionId = getSessionId();
	
	if (!ehrId || ehrId.trim().length == 0) {
		$("#preberiSporocilo").html("<span class='obvestilo label label-warning " +
      "fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
	    $.ajax({
	       url:baseUrl + "/demographics/ehr/" + ehrId + "/party",
	       type: 'GET',
	       headers: {"Ehr-Session":sessionId},
	       success: function (data){
	           var party = data.party;
	           //console.log("IME: "+party.firstNames+" priimek: "+ party.lastNames+" dat. rojstva: "+party.dateOfBirth);
	           $.ajax({
	              url:baseUrl+"/view/"+ehrId+"/weight",
	              type:'GET',
	              headers:{"Ehr-Session":sessionId},
	              success:function(res){
	                  if(res.length > 0){
	                      callback(res);
	                  }
	              },
	              error:function(){
	                  console.log("NAPAKA!");
	                  return null;
	              }
	           });
	       }
	    });
	}
}

function vrniDatumInUro(ehrId,callback){
	sessionId = getSessionId();
	
	if (!ehrId || ehrId.trim().length == 0) {
		$("#preberiSporocilo").html("<span class='obvestilo label label-warning " +
      "fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
	    $.ajax({
	       url:baseUrl + "/demographics/ehr/" + ehrId + "/party",
	       type: 'GET',
	       headers: {"Ehr-Session":sessionId},
	       success: function (data){
	           var party = data.party;
	           //console.log("IME: "+party.firstNames+" priimek: "+ party.lastNames+" dat. rojstva: "+party.dateOfBirth);
	           $.ajax({
	              url:baseUrl+"/view/"+ehrId+"/weight",
	              type:'GET',
	              headers:{"Ehr-Session":sessionId},
	              success:function(res){
	                  if(res.length > 0){
	                      callback(res);
	                  }
	              },
	              error:function(){
	                  console.log("NAPAKA!");
	                  return null;
	              }
	           });
	       }
	    });
	}
}

function izvediMeritve(){
		sessionId = getSessionId();
		var ehrId = $("#preberiObstojeciEHR").val();
		
		$("#dodajVitalnoEHR").val(ehrId);
		
		var visine=["","","","","","","","","",""];
		var teze=["","","","","","","","","",""];
		var datumInUra =["","","","","","","","","",""];
		
		vrniVisino(ehrId,function(res){
			for(var i in res){
				visine[i] = res[i].height;
				
			}
			
			vrniTezo(ehrId,function(res1){
				for(var j in res1){
					teze[j] = res1[j].weight;
					datumInUra[j] = res1[j].time;
					var tmp=datumInUra[j];
					
					datumInUra[j] = datumInUra[j].substring(0,10);
					//console.log(datumInUra[j]);
				}
				//console.log(datumInUra);
				
				var result = ["","","","","",""];
				var vmesneVisine = 0;
				var vmesneTeze = 0;
				for(var k = 0; k < 10; k++){
					vmesneTeze = teze[k];
					vmesneVisine = visine[k] / 100;
					result[k]= (vmesneTeze / (vmesneVisine*vmesneVisine))/10;
					//console.log(result[k]);
				}
				
				var rezultat = parseInt(result[0]);
				//console.log("rezultat "+rezultat);
			
				if(rezultat < 18){
					$("#sporociloBMI").html("<p class='zapar'>Kaj pa je s vami? Zakaj ste tako suhi? Ali veste, da po svetu vse več in več ljudi umira od podhranjenosti? Bi radi bili eden izmed njih? Resnično upam, da ne!</p>\
											<p class='zapar'>Priporočam vam, da v tem trenutku obiščeč restavracijo, kjer se naužijete velike porcije ogljikovih hidratov(osebno najbolj priporočam špagete) in beljakovin!</p>\
											<p class='zapar'>Prav tako vam priporočam da čimprej obiščete zdravnika, saj s podhranjenostjo ni šale! Zato hitro prste na tipkolnico in pojdite v zemljevid poiskat vam najbližjo restavracijo!</p>\
											<p class='zapar'><b>Tukaj imate nekaj namigov kaj bi lahko iskali</b>: <i>restavracija, špagetarna, bolnica, zdravstveni dom, itd.</i></p>");
				} else if (rezultat >= 18 && rezultat < 25){
					$("#sporociloBMI").html("<p class='zapar'>Čestitam, vaša BMI vrednost je idealna, le tako naprej!</p>\
											<p class='zapar'>Mislim da imam ravno pravšnjo idejo za vas..kaj ko bi obiskali kakšne terme, se relaksirali in proslavili vaše zdravo življenje?</p>\
											 <p class='zapar'><b>Namigi za iskanje</b>: <i>terme, wellnes, kopališče, itd.</i></p>");
				} else if (rezultat >=25 && rezultat < 30){
					$("#sporociloBMI").html("<p class='zapar'>Kakor vsak dan pravim: <b>s trudom se daleč pride</b>. Le-tega boste vi še kako potrebovali, saj ste na zelo visoki ravni po BMI lestvici. Če se dovolj potrudite, mislim da uspete iz sebe spraviti par kilogramov, kajneda?</p>\
											<p class='zapar'>Ne jejte več veliko mastne hrane, veliko telovadite in rezultat bo kmalu prišel tudi na vaš trebušček.</p>\
											<p class='zapar'><b>Tukaj je še nekaj namigov za iskanje po vašem zemljevidu</b>: <i>trim road, fitnes center, šprtna dvorana, itd.</i></p>");
				} else {
					$("#sporociloBMI").html("<p class='zapar'>Kaj pa ste vi počeli skozi celotno življenje? Jedli pice? Pili koka-kolo? Namreč vaš BMI je izredno prevelik, kot vrjetno tudi vaš trebušček! Začnite skrbeti za sebe in ne pojejte vsega kar vidite!</p>\
											<p class='zapar'>Obvezno obiščite zdravnika, če ne celo kar kliničnega centra!</p>\
											<p class='zapar'><b>Nekaj napotkov za isaknje po zemljevidu</b>: <i>bolnica, bolnišnica, zdravstveni dom, itd.</i></p>");
				}
				
				generirajGraf(result,datumInUra);
			});
		});
}


function generirajGraf(result,datumInUra){
		var ctx = $("#myChart");
		var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: [datumInUra[0], datumInUra[1], datumInUra[2], datumInUra[3], datumInUra[4], datumInUra[5], datumInUra[6],datumInUra[7],datumInUra[8],datumInUra[9]],
              datasets: [{
                  label: 'BMI(Body Mass Index)',
                  data: [result[0], result[1], result[2], result[3], result[4], result[5], result[6],result[7],result[8],result[9]],
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                      'rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1
              }]
          },
          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero:true
                      }
                  }]
              }
          }
      });
}

function dodajMeritveVitalnihZnakov() {
	sessionId = getSessionId();

	var ehrId = $("#dodajVitalnoEHR").val();
	var datumInUra = $("#dodajVitalnoDatumInUra").val();
	var telesnaVisina = $("#dodajVitalnoTelesnaVisina").val();
	var telesnaTeza = $("#dodajVitalnoTelesnaTeza").val();
	var telesnaTemperatura = $("#dodajVitalnoTelesnaTemperatura").val();

	if (!ehrId || ehrId.trim().length == 0) {
		$("#dodajMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo " +
      "label label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
	} else {
		$.ajaxSetup({
		    headers: {"Ehr-Session": sessionId}
		});
		var podatki = {
			// Struktura predloge je na voljo na naslednjem spletnem naslovu:
      // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
		    "ctx/language": "en",
		    "ctx/territory": "SI",
		    "ctx/time": datumInUra,
		    "vital_signs/height_length/any_event/body_height_length": telesnaVisina,
		    "vital_signs/body_weight/any_event/body_weight": telesnaTeza,
		   	"vital_signs/body_temperature/any_event/temperature|magnitude": telesnaTemperatura,
		    "vital_signs/body_temperature/any_event/temperature|unit": "°C",
		    
		};
		var parametriZahteve = {
		    ehrId: ehrId,
		    templateId: 'Vital Signs',
		    format: 'FLAT',
		};
		$.ajax({
		    url: baseUrl + "/composition?" + $.param(parametriZahteve),
		    type: 'POST',
		    contentType: 'application/json',
		    data: JSON.stringify(podatki),
		    success: function (res) {
		        $("#dodajMeritveVitalnihZnakovSporocilo").html(
              "<span class='obvestilo label label-success fade-in'>Uspešno dodane meritve za "+ehrId+" . Poizvedba--></span>");
		    },
		    error: function(err) {
		    	$("#dodajMeritveVitalnihZnakovSporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
		    }
		});
	}
}

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 46.117427, lng: 14.836805},  
    zoom: 8
  });
  var input = /** @type {!HTMLInputElement} */(
      document.getElementById('pac-input'));

  var types = document.getElementById('type-selector');
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setIcon(/** @type {google.maps.Icon} */({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    infowindow.open(map, marker);
  });

  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
  function setupClickListener(id, types) {
    var radioButton = document.getElementById(id);
    radioButton.addEventListener('click', function() {
      autocomplete.setTypes(types);
    });
  }

  setupClickListener('changetype-all', []);
  setupClickListener('changetype-address', ['address']);
  setupClickListener('changetype-establishment', ['establishment']);
  setupClickListener('changetype-geocode', ['geocode']);
}

$(document).ready(function() {
    
    $('#preberiObstojeciEHR').change(function() {
		$("#preberiSporocilo").html("");
		$("#preberiEHRid").val($(this).val());
	});

});