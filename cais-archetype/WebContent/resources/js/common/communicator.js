Communicator.prototype.constructor = Communicator;

function Communicator(alertType, alertComment, communicatorPlaceholder) {
    var communicatorContainer = $("<div id='" + communicatorPlaceholder + "' class='communicator'/>"),
        closeCommunicator = $("<div class='communicatorClose'/>"),
        icon = $("<div class='icon " + alertType + "'/>"),
        commmunicatorContent = $("<div class='communicatorContent'><span></span></div>"),
        left = $("<div class='communicatorLeft'/>"),
        right = $("<div class='communicatorRight'/>"),
        fill = $("<div class='communicatorFill'/>");

    communicatorContainer.append(left).append(fill).append(right).append(commmunicatorContent).append(closeCommunicator);

    commmunicatorContent.prepend(icon).find("span").text(alertComment);

    communicatorContainer.addClass(alertType);

    closeCommunicator.on("click", function () {
        $(this).closest(".communicator").replaceWith("<div id='" + communicatorPlaceholder + "'/>");
    });

    $(document).bind("closeCommunicator", function () {
        $("#" + communicatorPlaceholder).replaceWith("<div id='" + communicatorPlaceholder + "'/>");
        $(document).off("closeCommunicator");
    });
    $("#" + communicatorPlaceholder).replaceWith(communicatorContainer);
    var delay = setTimeout(function () {
        communicatorContainer.addClass("visible");
    }, 1);
}