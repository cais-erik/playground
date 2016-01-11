/// <reference path="lib/jquery-1.7.1-vsdoc.js" />
// make part function global
var loadParts = null;

(function () {

	var numParts = 0;
	var numPartsLoaded = 0;

    $(document).ready(function () {
        $(document).bind("loadParts", function (event, rootElement) {
            loadParts(rootElement);
        });
    });

    loadParts = function(rootElement) {
            
        var parts = $(rootElement).find("div[data-viewPart]");
        numParts = parts.length;

        parts.each(function (index, element) {
            var target = $(this);
            var partName = $(this).attr("data-viewPart");
            var part = partName + ".html";
            // cache buster
            if (typeof caisVersion !== 'undefined') part = part + '?' + caisVersion;

            $("<div>").load(part, function(response){
                target.replaceWith(response);
                numPartsLoaded++;

                // fire an event for each part that loaded based on the part and path name.
                $(document).trigger(partName + "_loaded");
                checkAllPartsLoaded(rootElement);
            });
        });
    };
    
    function checkAllPartsLoaded(rootElement)
    {
    	if(numPartsLoaded == numParts)
    	{
            // finally fire event to let process know ALL parts have loaded.
            numPartsLoaded = 0;
            $(document).trigger("allPartsLoaded_" + rootElement);
    	}
    }

}).call();