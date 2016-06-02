
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


var imena = ["Klemen", "Matija", "Jure"];
var priimki = ["Spraveka","Brezgrada","Odnikoder"];
var datumiRojstva = ["1996-01-30T21:21","1980-01-01T00:00","1954-03-03T13:54"];

var datumiInUre = ["2016-01-19T14:12Z","2016-04-12T16:39Z","2016-06-02T04:41Z"];
var telesneVisine = ["190","158","208"];
var telesneTeze = ["78","109","59"];
var telesneTemperature = ["36,7","37,9","35,1"];
var sistolicniKrvniTlaki = ["82","102","54"];
var diastolicniKrvniTlaki = ["124","169","90"];
var nasicenostKrviSKisikom1 = ["98","62","73"];
var merilci = ["Špela Prekohriba","Maša Spentljo","Andreja Komaandreja"];

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
 var ime, priimek, datumRojstva,datumInUra,telesnaVisina,telesnaTeza,telesnaTemperatura,sistolicniKrvniTlak,diastolicniKrvniTlak,nasicenostKrviSKisikom,merilec;
 var ehrId;

    switch(stPacienta){
        case 1: 
            ime = imena[stPacienta-1];
            priimek = priimki[stPacienta-1];
            datumRojstva = datumiRojstva[stPacienta-1];
            datumInUra = datumiInUre[stPacienta-1];
        	telesnaVisina = telesneVisine[stPacienta-1];
        	telesnaTeza = telesneTeze[stPacienta-1];
        	telesnaTemperatura = telesneTemperature[stPacienta-1];
        	sistolicniKrvniTlak = sistolicniKrvniTlaki[stPacienta-1];
        	diastolicniKrvniTlak = diastolicniKrvniTlaki[stPacienta-1];
        	nasicenostKrviSKisikom = nasicenostKrviSKisikom1[stPacienta-1];
        	merilec = merilci[stPacienta-1];
            break;
        case 2:
            ime = imena[stPacienta-1];
            priimek = priimki[stPacienta-1];
            datumRojstva = datumiRojstva[stPacienta-1];
            datumInUra = datumiInUre[stPacienta-1];
        	telesnaVisina = telesneVisine[stPacienta-1];
        	telesnaTeza = telesneTeze[stPacienta-1];
        	telesnaTemperatura = telesneTemperature[stPacienta-1];
        	sistolicniKrvniTlak = sistolicniKrvniTlaki[stPacienta-1];
        	diastolicniKrvniTlak = diastolicniKrvniTlaki[stPacienta-1];
        	nasicenostKrviSKisikom = nasicenostKrviSKisikom1[stPacienta-1];
        	merilec = merilci[stPacienta-1];
            break;
        case 3:
            ime = imena[stPacienta-1];
            priimek = priimki[stPacienta-1];
            datumRojstva = datumiRojstva[stPacienta-1];
            datumInUra = datumiInUre[stPacienta-1];
        	telesnaVisina = telesneVisine[stPacienta-1];
        	telesnaTeza = telesneTeze[stPacienta-1];
        	telesnaTemperatura = telesneTemperature[stPacienta-1];
        	sistolicniKrvniTlak = sistolicniKrvniTlaki[stPacienta-1];
        	diastolicniKrvniTlak = diastolicniKrvniTlaki[stPacienta-1];
        	nasicenostKrviSKisikom = nasicenostKrviSKisikom1[stPacienta-1];
        	merilec = merilci[stPacienta-1];
            break;
    }
    
    if (!ime || !priimek || !datumRojstva || ime.trim().length == 0 ||
      priimek.trim().length == 0 || datumRojstva.trim().length == 0) {
		$("#kreirajSporocilo").html("<span class='obvestilo label " +
      "label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
	} else {
		$.ajaxSetup({
		    headers: {"Ehr-Session": sessionId}
		});
		$.ajax({
		    url: baseUrl + "/ehr",
		    type: 'POST',
		    success: function (data) {
		        var ehrId = data.ehrId;
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
		                    $("#kreirajSporocilo").append("<span class='" +
                          "label label-success '>Uspešno kreiran EHR '" +
                          ehrId + "' za osebo "+ime+" "+priimek+", rojeno "+datumRojstva+".</span>    ");
		                    $("#preberiEHRid").val(ehrId);
		                }
		            },
		            error: function(err) {
		            	$("#kreirajSporocilo").html("<span class='obvestilo label " +
                    "label-danger fade-in'>Napaka '" +
                    JSON.parse(err.responseText).userMessage + "'!");
		            }
		        });
		    }
		});
	}
	
	

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
		        $("#kreirajSporocilo").html(
              "<span class='obvestilo label label-success fade-in'>" +
              res.meta.href + ".</span>");
		    },
		    error: function(err) {
		    	$("#kreirajSporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
		    }
		});
	}
	
	return ehrId;
}

function izpisiGeneriranePodatke(){
    for(var i = 1; i <=3 ; i++){
        generirajPodatke(i);
    }
}
// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija

function kreirajEHRzaBolnika() {
	sessionId = getSessionId();

	var ime = $("#kreirajIme").val();
	var priimek = $("#kreirajPriimek").val();
	var datumRojstva = $("#kreirajDatumRojstva").val();

	if (!ime || !priimek || !datumRojstva || ime.trim().length == 0 ||
      priimek.trim().length == 0 || datumRojstva.trim().length == 0) {
		$("#kreirajSporocilo").html("<span class='obvestilo label " +
      "label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
	} else {
		$.ajaxSetup({
		    headers: {"Ehr-Session": sessionId}
		});
		$.ajax({
		    url: baseUrl + "/ehr",
		    type: 'POST',
		    success: function (data) {
		        var ehrId = data.ehrId;
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
		                    $("#kreirajSporocilo").html("<span class='obvestilo " +
                          "label label-success fade-in'>Uspešno kreiran EHR '" +
                          ehrId + "'.</span>");
		                    $("#preberiEHRid").val(ehrId);
		                }
		            },
		            error: function(err) {
		            	$("#kreirajSporocilo").html("<span class='obvestilo label " +
                    "label-danger fade-in'>Napaka '" +
                    JSON.parse(err.responseText).userMessage + "'!");
		            }
		        });
		    }
		});
	}
}


$(document).ready(function() {
    
    $('#preberiPredlogoBolnika').change(function() {
        $("#kreirajSporocilo").html("");
        var podatki = $(this).val().split(",");
        $("#kreirajIme").val(podatki[0]);
        $("#kreirajPriimek").val(podatki[1]);
        $("#kreirajDatumRojstva").val(podatki[2]);
    });
    
});