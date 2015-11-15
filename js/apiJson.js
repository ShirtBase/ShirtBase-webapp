jQuery.fn.fadeOutAndRemove = function(speed){
    $(this).fadeOut(speed,function(){
        $(this).remove();
    })
}

jQuery.fn.outerHTML = function(s) {
    return (s)
        ? this.before(s).remove()
        : jQuery("<p>").append(this.eq(0).clone()).html();
}

var colors;
var apiurl = 'http://localhost:8000/api/';

$( document ).ready( getColors() );

$( document ).ready( domPutShirts() );

$("div").on("click", "i#deletelink", function(e){
    e.stopImmediatePropagation();
    console.log('clicked');
    deleteShirt($(this).parent().parent().prop('id'));
});

$(function(){
    $('#apigetbtn').on('click', function(e) {
        e.preventDefault();
        domPutShirts()
    });
    $('.shirtlink').on('click', function(e) {
        e.preventDefault();
        getShirt(e.id);
    });
});

function domPutShirts() {
    var url = 'http://localhost:8000/api/shirts';

    $.ajax({
        url: url,
        data: {
            format: 'json'
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        },
        // This needs fixing
        //dataType: 'jsonp',
        success: function(data) {
            clearShirts();
            $.each(data, function(i, item) {
                putShirt(data[i]);
            });
        },
        type: 'GET'
    });
}

function deleteShirt(id) {
    $.ajax({
        url: apiurl + 'shirts/' + id,
        type: 'delete',
        success: function(data) {
            $("#" + id).fadeOutAndRemove('slow');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        },
    });
}

function getShirt(id) {
    $.ajax({
        url: apiurl + 'shirts/' + id,
        data: {
            format: 'json'
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        },
        // This needs fixing
        //dataType: 'jsonp',
        success: function(data) {
            console.log('single one');
            clearShirts();
            putShirt(data[0]);
        },
        type: 'GET'
    });
}

function clearShirts(){
    $('#shirts').html('');
    console.log('Cleared shirts');
}

function getColors() {
    $.ajax({
        url: apiurl + 'colors/',
        data: {
            format: 'json'
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        },
        // This needs fixing
        //dataType: 'jsonp',
        //async: false,
        success: function(data) {
            colors = data;
        },
        type: 'GET'
    });
}

function putShirt(shirt) {
    $shirtDiv = $(
        "<div class=\"col s3\">" +
            "<div class=\"grid-item card hoverable\" id=\""+ shirt.id +"\">" +
                "<div class=\"card-image waves-effect waves-block waves-light\">" +
                    "<img src=\"http://localhost:8000/images/" + shirt.photo + "\" class=\"activator\">" +
                "</div>" +
                "<div class=\"card-content\">"+
                    "<span class=\"card-title activator grey-text text-darken-4\">" + shirt.name +
                    "<i class=\"material-icons right\">more_vert</i></span>"+
                    "<i class=\"material-icons right\" id=\"deletelink\">delete</i>"+
                "</div>"+
                "<div class=\"card-reveal\">"+
                    "<span class=\"card-title grey-text text-darken-4\">" + shirt.name + "<i class=\"material-icons right\">close</i></span>"+
                    "<table class=\"centered responsive-table\">"+
                        "<tr>"+
                        "<td><p id=\"tablebold\">Właściciel</p></td>"+
                        //shirt.user_id
                        "<td>" + 'Marcin' + "</td>"+
                        "</tr>"+
                        "<tr>"+
                        "<td><p id=\"tablebold\">Rozmiar</p></td>"+
                        "<td>" + shirt.size + "</td>"+
                        "</tr>"+
                        "<tr>"+
                        "<td><p id=\"tablebold\">Długość rękawa</p></td>"+
                        "<td>" + shirt.sleeve_length + "cm</td>"+
                        "</tr>"+
                        "<tr>"+
                        "<td><p id=\"tablebold\">Kolor</p></td>"+
                        "<td><div class=\"chip\"><img style=\"background-color:" + colors[shirt.color_id-1].hexCode + "\"/>" + colors[shirt.color_id-1].name + "</div></td>"+
                        "</tr>"+
                        "<tr>"+
                        "<td><p id=\"tablebold\">Wygoda</p></td>"+
                        "<td id=\"comfortability\">"+ "</td>"+
                        "</tr>"+
                        "<tr>"+
                        "<td><p id=\"tablebold\">Zużycie</p></td>"+
                        "<td id=\"wear\">"+
                        "</td>"+
                        "</tr>"+
                        "</table>"+
                        "</div>" +
                        "</div>"+
                        "</div>"
    );

    for($i=0;$i < shirt.comfortability;$i++){
        $shirtDiv.find('#comfortability').append('<i class=\"material-icons tiny\">grade</i>');
    }

    for($i=0;$i < shirt.wear;$i++){
        $shirtDiv.find('#wear').append('<i class=\"material-icons tiny\">grade</i>');
    }

    $('#shirts').append($shirtDiv);
}
