
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
        podatkiZaPacienta(ehrId,"1977-06-01T21:21Z","19,5","67,0","35,5","80","120","97");
        podatkiZaPacienta(ehrId,"1970-05-01T21:21Z","19,5","67,0","35,5","80","120","97");
        podatkiZaPacienta(ehrId,"1964-04-01T21:21Z","19,5","67,0","35,5","80","120","97");
        podatkiZaPacienta(ehrId,"1963-03-01T21:21Z","19,5","67,0","35,5","80","120","97");
        podatkiZaPacienta(ehrId,"1962-02-01T21:21Z","19,5","67,0","35,5","80","120","97");
        podatkiZaPacienta(ehrId,"1960-01-01T21:21Z","19,5","67,0","35,5","80","120","97");
    } else if (stPacienta == 2) {
        podatkiZaPacienta(ehrId,"1999-01-01T21:21Z","19,5","67,0","35,5","80","120","97");
        podatkiZaPacienta(ehrId,"1999-01-01T21:21Z","19,5","67,0","35,5","80","120","97");
        podatkiZaPacienta(ehrId,"1999-01-01T21:21Z","19,5","67,0","35,5","80","120","97");
        podatkiZaPacienta(ehrId,"1999-01-01T21:21Z","19,5","67,0","35,5","80","120","97");
        podatkiZaPacienta(ehrId,"1999-01-01T21:21Z","19,5","67,0","35,5","80","120","97");
        podatkiZaPacienta(ehrId,"1999-01-01T21:21Z","19,5","67,0","35,5","80","120","97");
    } else {
        podatkiZaPacienta(ehrId,"1999-01-01T21:21Z","19,5","67,0","35,5","80","120","97");
        podatkiZaPacienta(ehrId,"1999-01-01T21:21Z","19,5","67,0","35,5","80","120","97");
        podatkiZaPacienta(ehrId,"1999-01-01T21:21Z","19,5","67,0","35,5","80","120","97");
        podatkiZaPacienta(ehrId,"1999-01-01T21:21Z","19,5","67,0","35,5","80","120","97");
        podatkiZaPacienta(ehrId,"1999-01-01T21:21Z","19,5","67,0","35,5","80","120","97");
        podatkiZaPacienta(ehrId,"1999-01-01T21:21Z","19,5","67,0","35,5","80","120","97");
    }
    
}

function podatkiZaPacienta(ehrId,ura,visina,teza,temperatura,st,dt,kisik,merilec){
   sessionId = getSessionId();
   console.log("visina: "+visina+", teza: "+teza);
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
    	    "vital_signs/body_temperature/any_event/body_height_length|unit": "dm",
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
    	    committer: merilec,
    	};
    	$.ajax({
    	    url: baseUrl + "/composition?" + $.param(parametriZahteve),
    	    type: 'POST',
    	    contentType: 'application/json',
    	    data: JSON.stringify(podatki),
    	    success: function (res) {
    	        $("#uspesno").html("<span class='obvestilo label label-success fade-in'>Uspešno naložene vitalne meritve!</span>");
    	    },
    	    error: function(err) {
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
// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija


$(document).ready(function() {
    
    $('#preberiObstojeciEHR').change(function() {
		$("#preberiSporocilo").html("");
		$("#preberiEHRid").val($(this).val());
	});

});