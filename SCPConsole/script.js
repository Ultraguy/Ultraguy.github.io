$.ajaxSetup({
    scriptCharset: "utf-8", //or "ISO-8859-1"
    contentType: "application/json; charset=utf-8"
});


function getSCP(scpNum) {
    $.getJSON('http://whateverorigin.org/get?url=' + 
    encodeURIComponent(`http://www.scp-wiki.net/${scpNum}`) + '&callback=?',
    function (data) {
        console.log("> ", data);

        //If the expected response is text/plain
        $('#console').append(`<h1 class='scp'>${scpNum.toUpperCase()}</h1>`)
        $("#console").append($(data.contents).find("#page-content"));
        $('.footer-wikiwalk-nav').remove();
        //If the expected response is JSON
        //var response = $.parseJSON(data.contents);
});
}
$( "#input" ).keypress(function( event ) {
    if ( event.which == 13 ) {
        parseCommandInput($('#input').val());
        $("#input").val('')
    }
});
function parseCommandInput(command) {
    getSCPCheck = /^get ((SCP)|(scp))-((0\d{1,2})|([1-4]\d{3})|(\d{3}))(?!\d)(-j)?$/
    if (getSCPCheck.test(command)) {
        console.log('running getSCP')
        getSCP(command.slice(3))
        return;
    }
    if (command == 'help') {
        $('#console').append(`
        <h2>Help Menu of Commands for SCP-Terminal Version 0.1 Alpha:</h2>
            <p><span class='command'>get scp-XXXX</span> -- <span class='commandDescription'>This command gets the database entry for SCP-XXXX, the XXXX being a valid scp-entry</span></p>
            <br><br>
        `)
    }


}