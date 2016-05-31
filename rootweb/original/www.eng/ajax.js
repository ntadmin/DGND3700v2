/*
 * readyState:
 * 0: Request not sent yet
 * 1: Request built but not sent yet (before call open())
 * 2: Request sent and no data read yet
 * 3: Request sent and get some data now
 * 4: Request finished. responseText ready now
 */

/* Create XMLHttpRequest object */
function createRequest() {
    var request;

    try {
        request = new XMLHttpRequest();
    } catch (trymicrosoft) {
        try {
            request = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (othermicrosoft) {
            try {
                request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (failed) {
                request = false;
            }
        }
    }
    if (!request) {
        alert("Error initializing XMLHttpRequest!");
    }
    return request;
}
