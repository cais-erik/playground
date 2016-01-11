$(document).ready(function () {
    var showTooltip = function (e) {
        var tooltip = $("<div class='field-tooltip'/>");
        tooltip.text($(this).attr("data-tooltip"));
        tooltip.css("top", e.pageY - 36).css("left", e.pageX + 20);
        tooltip.appendTo("body");
    }

    var hideTooltip = function (e) {
        $("div.field-tooltip").remove();
    }

    $("body").on("mouseenter", ".field-tooltip-icon", showTooltip);
    $("body").on("mouseleave", ".field-tooltip-icon", hideTooltip);

    function showLabelTooltip(e) {
        var tooltip = $("<div class='label-tooltip'/>");
        tooltip.append("<div class='left'/>");
        tooltip.append("<div class='fill'/>");
        tooltip.append("<div class='right'/>");
        tooltip.append("<div class='arrow'/>");

        tooltip.find(".fill").text($(this).attr("data-tooltip"));

        var rect = e.currentTarget.getBoundingClientRect();
        tooltip.css("top", rect.top - 30).css("left", rect.left - 10);
        tooltip.appendTo("body");
        tooltip.fadeIn(300);

        $("body").on("click", hideLabelTooltip);
    }

    function hideLabelTooltip(e) {
        $("div.label-tooltip").remove();
        $("body").off("click", hideLabelTooltip);
    }

    //$("body").on("click", "label[data-tooltip]", showLabelTooltip);
});

