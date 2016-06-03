
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
        podatkiZaPacienta(ehrId,"1960-07-01T13:16Z","15,8","99,3","36,6","90","130","92");
        podatkiZaPacienta(ehrId,"1962-02-01T12:25Z","15,9","99,2","36,5","88","141","68");
        podatkiZaPacienta(ehrId,"1964-03-01T11:14Z","16,0","99,1","37,5","83","151","50");
        podatkiZaPacienta(ehrId,"1965-12-01T09:27Z","16,8","99,6","36,8","82","122","80");
        podatkiZaPacienta(ehrId,"1967-10-01T10:04Z","17,0","99,3","35,9","100","170","91");
        podatkiZaPacienta(ehrId,"1977-01-01T08:09Z","16,9","99,5","36,1","99","169","92");
    } else if (stPacienta == 2) {
        podatkiZaPacienta(ehrId,"1997-04-30T21:20Z","19,5","67,0","35,1","50","101","97");
        podatkiZaPacienta(ehrId,"2000-03-20T08:09Z","20,1","68,5","36,1","55","102","97");
        podatkiZaPacienta(ehrId,"2003-01-10T08:10Z","20,5","65,3","36,2","59","103","97");
        podatkiZaPacienta(ehrId,"2005-08-15T08:11Z","20,8","72,1","35,7","54","100","97");
        podatkiZaPacienta(ehrId,"2010-11-12T08:22Z","21,9","71,0","34,5","69","99","97");
        podatkiZaPacienta(ehrId,"2015-09-07T08:34Z","22,5","62,1","38,9","67","91","97");
    } else {
        podatkiZaPacienta(ehrId,"2016-01-30T00:00Z","19,0","78,0","36,9","80","120","93");
        podatkiZaPacienta(ehrId,"2016-02-28T21:21Z","19,0","78,1","36,7","88","131","93");
        podatkiZaPacienta(ehrId,"2016-03-30T22:11Z","19,0","79,0","36,1","80","120","93");
        podatkiZaPacienta(ehrId,"2016-04-11T23:59Z","19,0","81,3","36,4","79","118","93");
        podatkiZaPacienta(ehrId,"2016-05-12T10:58Z","19,1","82,4","37,5","80","120","93");
        podatkiZaPacienta(ehrId,"2016-06-05T07:23Z","19,1","81,0","35,9","81","125","93");
    }
    
}

function podatkiZaPacienta(ehrId,ura,visina,teza,temperatura,st,dt,kisik){
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
    	    "vital_signs/blood_pressure/any_event/systolic": st,
    	    "vital_signs/blood_pressure/any_event/diastolic": dt,
    	    "vital_signs/indirect_oximetry:0/spo2|numerator": kisik,
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
    	        $("#uspesno").html("<span class='obvestilo label label-success fade-in'>Uspešno naložene vitalne meritve!</span>");
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

function preberiEHRodBolnika() {
	sessionId = getSessionId();

	var ehrId = $("#preberiEHRid").val();

	if (!ehrId || ehrId.trim().length == 0) {
		$("#preberiSporocilo").html("<span class='obvestilo label label-warning " +
      "fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				$("#preberiSporocilo").html("<span class='obvestilo label " +
          "label-success fade-in'>Bolnik '" + party.firstNames + " " +
          party.lastNames + "', ki se je rodil '" + party.dateOfBirth +
          "'.</span>");
			},
			error: function(err) {
				$("#preberiSporocilo").html("<span class='obvestilo label " +
          "label-danger fade-in'>Napaka '" +
          JSON.parse(err.responseText).userMessage + "'!");
			}
		});
	}
}

function dodajMeritveVitalnihZnakov() {
	sessionId = getSessionId();

	var ehrId = $("#dodajVitalnoEHR").val();
	var datumInUra = $("#dodajVitalnoDatumInUra").val();
	var telesnaVisina = $("#dodajVitalnoTelesnaVisina").val();
	var telesnaTeza = $("#dodajVitalnoTelesnaTeza").val();
	var telesnaTemperatura = $("#dodajVitalnoTelesnaTemperatura").val();
	var sistolicniKrvniTlak = $("#dodajVitalnoKrvniTlakSistolicni").val();
	var diastolicniKrvniTlak = $("#dodajVitalnoKrvniTlakDiastolicni").val();
	var nasicenostKrviSKisikom = $("#dodajVitalnoNasicenostKrviSKisikom").val();
	var merilec = $("#dodajVitalnoMerilec").val();

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
		    "vital_signs/blood_pressure/any_event/systolic": sistolicniKrvniTlak,
		    "vital_signs/blood_pressure/any_event/diastolic": diastolicniKrvniTlak,
		    "vital_signs/indirect_oximetry:0/spo2|numerator": nasicenostKrviSKisikom
		};
		var parametriZahteve = {
		    ehrId: ehrId,
		    templateId: 'Vital Signs',
		    format: 'FLAT',
		    committer: merilec
		};
		$.ajax({
		    url: baseUrl + "/composition?" + $.param(parametriZahteve),
		    type: 'POST',
		    contentType: 'application/json',
		    data: JSON.stringify(podatki),
		    success: function (res) {
		        $("#dodajMeritveVitalnihZnakovSporocilo").html(
              "<span class='obvestilo label label-success fade-in'>Uspešno dodani vitalni znaki.</span>");
		    },
		    error: function(err) {
		    	$("#dodajMeritveVitalnihZnakovSporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
		    }
		});
	}
}
// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija

function vrniVisine(ehrId){
    sessionId = getSessionId();

	var visine=[];
	    
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
	                      for(var i in res){
	                          var result = res[i].height / 100; 
	                          visine[i] = result;
	                          //console.log(result);
	                      }
	                		
	                	return visine;
	                  	
	                  }
	              },
	              error:function(){
	                  console.log("NAPAKA!");
	              }
	           });
	       }
	    });
	}
}


function vrniTeze(ehrId){
	sessionId = getSessionId();

	var teze = [];
	
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
	                      for(var i in res){
	                          var result = res[i].weight/10; 
	                          teze[i] = result;
	                          //console.log(result);
	                      }
	                	//console.log("teze1: "+teze);	
	                	return teze;
	                  	
	                  }
	              },
	              error:function(){
	                  console.log("NAPAKA!");
	              }
	           });
	       }
	    });
	}
}

function izracunajBMI(){
	var ehrId = $("#preberiEHRid").val();
	
	var teze = vrniTeze(ehrId);
	//console.log("teze2: "+teze);
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
		$("#dodajVitalnoKrvniTlakSistolicni").val(podatki[5]);
		$("#dodajVitalnoKrvniTlakDiastolicni").val(podatki[6]);
		$("#dodajVitalnoNasicenostKrviSKisikom").val(podatki[7]);
		$("#dodajVitalnoMerilec").val(podatki[8]);
	});

});