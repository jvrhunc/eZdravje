
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
				console.log(datumInUra);
				
				var result = ["","","","","",""];
				var vmesneVisine = 0;
				var vmesneTeze = 0;
				for(var k = 0; k < 10; k++){
					vmesneTeze = teze[k];
					vmesneVisine = visine[k] / 100;
					result[k]= (vmesneTeze / (vmesneVisine*vmesneVisine))/10;
					//console.log(result[k]);
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
              "<span class='obvestilo label label-success fade-in'>Uspešno dodane meritve za "+ehrId+" . Ponovno generiraj graf --></span>");
		    },
		    error: function(err) {
		    	$("#dodajMeritveVitalnihZnakovSporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
		    }
		});
	}
}

var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });
}

$(document).ready(function() {
    
    $('#preberiObstojeciEHR').change(function() {
		$("#preberiSporocilo").html("");
		$("#preberiEHRid").val($(this).val());
	});
	
	$('#preberiObstojeciVitalniZnak').change(function() {
		$("#dodajMeritveVitalnihZnakovSporocilo").html("");
		var podatki = $(this).val().split("|");
		$("#dodajVitalnoEHR").val(podatki[0]);
		$("#dodajVitalnoDatumInUra").val(podatki[1]);
		$("#dodajVitalnoTelesnaVisina").val(podatki[2]);
		$("#dodajVitalnoTelesnaTeza").val(podatki[3]);
		$("#dodajVitalnoTelesnaTemperatura").val(podatki[4]);
	});

});