$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$.postJSON = function(url, data, callback) {
    return jQuery.ajax({
        'type': 'POST',
        'url': url,
        'contentType': 'application/json',
        'data': JSON.stringify(data),
        'dataType': 'json',
        'success': callback
    });
};
$.fn.setMasks = function(){
    var $that = $(this);
    $that.find("input[type='date'], input[data-role='datepicker']").each(function(){
        var $this = $(this),
            placeholder = $this.attr("placeholder");
        $this.mask('09/09/0000', {placeholder: placeholder? placeholder :"MM/DD/YYYY"});
    });
}
$.getUrlVars = function() {
    if (!window.location.search) {
        return({});   // return empty object
    }
    var parms = {};
    var temp;
    var items = window.location.search.slice(1).split("&");   // remove leading ? and split
    for (var i = 0; i < items.length; i++) {
        temp = items[i].split("=");
        if (temp[0]) {
            if (temp.length < 2) {
                temp.push("");
            }
            parms[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
        }
    }
    return(parms);
};
function encodeHtmlEntity(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};
// global!!
function showLoadingDialog(load) {
    var loadingWrapper = $("<div class='loadingWrapper'/>");
    var loader = $("<div/>");
    loader.append($("#loader").html());
    loadingWrapper.append(loader);
    $("body").append(loadingWrapper);

    if (load) {
        load();
    }
    return loader;
}


function isValidURL(url){
    var validURLRegExp = new RegExp("^(?:(?:https?|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))\\.?)(?::\\d{2,5})?(?:[/?#]\\S*)?$", "i");
    return validURLRegExp.exec(url);
}

// global!!
function removeLoadingDialog() {
    $(".loadingWrapper").remove();
}
	
// global!! 
function resizeGrid(gridSelector) {
    var gridElement = $(gridSelector),
        dataArea = gridElement.find(".k-grid-content"),
        gridHeight = gridElement.innerHeight(),
        otherElements = gridElement.children().not(".k-grid-content"),
        otherElementsHeight = 0;
    otherElements.each(function () {
        otherElementsHeight += $(this).outerHeight();
    });
    dataArea.height(gridHeight - otherElementsHeight);
}

jQuery.download = function(url, data, method) {
    //url and data options required
    if (url && data) {
        //data can be string of parameters or array/object
        data = typeof data == 'string' ? data : jQuery.param(data);
        //split params into form inputs
        var inputs = '';
        jQuery.each(data.split('&'), function() {
            var pair = this.split('=');
            inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
        });
        //send request
        jQuery('<form action="' + url + '" method="' + method + '">' + inputs + '</form>')
		.appendTo('body').submit().remove();
    }
};

jQuery.expr[':'].Contains = function(a, i, m) {
	  return jQuery(a).text().toUpperCase()
	      .indexOf(m[3].toUpperCase()) >= 0;
};

$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (!this.value) return;
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

//Returns an array of 12 summed total holdings per month
$.parseHoldingChartData = function(data) {
    var arr = [null,null,null,null,null,null,null,null,null,null,null,null];
    var monthArr = ['january', 'february', 'march','april','may','june','july','august','september','october','november','december'];
    $.each(data, function(i, fund) {
        $.each(monthArr, function(y, month) {
            if (fund[month] !== null && arr[y] !== null) arr[y] = arr[y] + fund[month];
            if (fund[month] !== null && arr[y] === null) arr[y] = fund[month];
        });
    });
    return arr;
};

// global!!
function valueFormatSelector(e) {
    if (e.value < 1000000 && e.value != 0) {
        return kendo.format('{0:C1}', e.value / 1000000) + "M"
    } else {
        return kendo.format('{0:C1}', e.value / 1000000) + "M"
    }
}


//
// Date
// ====
//

// ES5 15.9.5.43
// http://es5.github.com/#x15.9.5.43
// This function returns a String value represent the instance in time
// represented by this Date object. The format of the String is the Date Time
// string format defined in 15.9.1.15. All fields are present in the String.
// The time zone is always UTC, denoted by the suffix Z. If the time value of
// this object is not a finite Number a RangeError exception is thrown.
var negativeDate = -62198755200000,
    negativeYearString = "-000001";
if (
    !Date.prototype.toISOString ||
    (new Date(negativeDate).toISOString().indexOf(negativeYearString) === -1)
) {
    Date.prototype.toISOString = function toISOString() {
        var result, length, value, year, month;
        if (!isFinite(this)) {
            throw new RangeError("Date.prototype.toISOString called on non-finite value.");
        }

        year = this.getUTCFullYear();

        month = this.getUTCMonth();
        // see https://github.com/kriskowal/es5-shim/issues/111
        year += Math.floor(month / 12);
        month = (month % 12 + 12) % 12;

        // the date time string format is specified in 15.9.1.15.
        result = [month + 1, this.getUTCDate(),
            this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()];
        year = (
            (year < 0 ? "-" : (year > 9999 ? "+" : "")) +
            ("00000" + Math.abs(year))
            .slice(0 <= year && year <= 9999 ? -4 : -6)
        );

        length = result.length;
        while (length--) {
            value = result[length];
            // pad months, days, hours, minutes, and seconds to have two
            // digits.
            if (value < 10) {
                result[length] = "0" + value;
            }
        }
        // pad milliseconds to have three digits.
        return (
            year + "-" + result.slice(0, 2).join("-") +
            "T" + result.slice(2).join(":") + "." +
            ("000" + this.getUTCMilliseconds()).slice(-3) + "Z"
        );
    };
}


// ES5 15.9.5.44
// http://es5.github.com/#x15.9.5.44
// This function provides a String representation of a Date object for use by
// JSON.stringify (15.12.3).
var dateToJSONIsSupported = false;
try {
    dateToJSONIsSupported = (
        Date.prototype.toJSON &&
        new Date(negativeDate).toJSON().indexOf(negativeYearString) !== -1 &&
        Date.prototype.toJSON.call({ // generic
            toISOString: function () {
                return true;
            }
        })
    );
} catch (e) {
    console.log(e);
}
if (typeof Date.prototype.toJSON !== 'function') {

    Date.prototype.toJSON = function () {

        return isFinite(this.valueOf())
            ? this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z'
            : null;
    };

    String.prototype.toJSON      =
        Number.prototype.toJSON  =
        Boolean.prototype.toJSON = function () {
            return this.valueOf();
        };
}

// ES5 15.9.4.2
// http://es5.github.com/#x15.9.4.2
// based on work shared by Daniel Friesen (dantman)
// http://gist.github.com/303249
if (!Date.parse || "Date.parse is buggy") {
    // XXX global assignment won't work in embeddings that use
    // an alternate object for the context.
    Date = (function(NativeDate) {

        // Date.length === 7
        function Date(Y, M, D, h, m, s, ms) {
            var length = arguments.length;
            if (this instanceof NativeDate) {
                var date = length == 1 && String(Y) === Y ? // isString(Y)
                    // We explicitly pass it through parse:
                    new NativeDate(Date.parse(Y)) :
                    // We have to manually make calls depending on argument
                    // length here
                    length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) :
                    length >= 6 ? new NativeDate(Y, M, D, h, m, s) :
                    length >= 5 ? new NativeDate(Y, M, D, h, m) :
                    length >= 4 ? new NativeDate(Y, M, D, h) :
                    length >= 3 ? new NativeDate(Y, M, D) :
                    length >= 2 ? new NativeDate(Y, M) :
                    length >= 1 ? new NativeDate(Y) :
                                  new NativeDate();
                // Prevent mixups with unfixed Date object
                date.constructor = Date;
                return date;
            }
            return NativeDate.apply(this, arguments);
        };

        // 15.9.1.15 Date Time String Format.
        var isoDateExpression = new RegExp("^" +
            "(\\d{4}|[\+\-]\\d{6})" + // four-digit year capture or sign +
                                      // 6-digit extended year
            "(?:-(\\d{2})" + // optional month capture
            "(?:-(\\d{2})" + // optional day capture
            "(?:" + // capture hours:minutes:seconds.milliseconds
                "T(\\d{2})" + // hours capture
                ":(\\d{2})" + // minutes capture
                "(?:" + // optional :seconds.milliseconds
                    ":(\\d{2})" + // seconds capture
                    "(?:(\\.\\d{1,}))?" + // milliseconds capture
                ")?" +
            "(" + // capture UTC offset component
                "Z|" + // UTC capture
                "(?:" + // offset specifier +/-hours:minutes
                    "([-+])" + // sign capture
                    "(\\d{2})" + // hours offset capture
                    ":(\\d{2})" + // minutes offset capture
                ")" +
            ")?)?)?)?" +
        "$");

        var months = [
            0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365
        ];

        function dayFromMonth(year, month) {
            var t = month > 1 ? 1 : 0;
            return (
                months[month] +
                Math.floor((year - 1969 + t) / 4) -
                Math.floor((year - 1901 + t) / 100) +
                Math.floor((year - 1601 + t) / 400) +
                365 * (year - 1970)
            );
        }

        function toUTC(t) {
            return Number(new NativeDate(1970, 0, 1, 0, 0, 0, t));
        }

        // Copy any custom methods a 3rd party library may have added
        for (var key in NativeDate) {
            Date[key] = NativeDate[key];
        }

        // Copy "native" methods explicitly; they may be non-enumerable
        Date.now = NativeDate.now;
        Date.UTC = NativeDate.UTC;
        Date.prototype = NativeDate.prototype;
        Date.prototype.constructor = Date;

        // Upgrade Date.parse to handle simplified ISO 8601 strings
        Date.parse = function parse(string) {
            var match = isoDateExpression.exec(string);
            if (match) {
                // parse months, days, hours, minutes, seconds, and milliseconds
                // provide default values if necessary
                // parse the UTC offset component
                var year = Number(match[1]),
                    month = Number(match[2] || 1) - 1,
                    day = Number(match[3] || 1) - 1,
                    hour = Number(match[4] || 0),
                    minute = Number(match[5] || 0),
                    second = Number(match[6] || 0),
                    millisecond = Math.floor(Number(match[7] || 0) * 1000),
                    // When time zone is missed, local offset should be used
                    // (ES 5.1 bug)
                    // see https://bugs.ecmascript.org/show_bug.cgi?id=112
                    isLocalTime = Boolean(match[4] && !match[8]),
                    signOffset = match[9] === "-" ? 1 : -1,
                    hourOffset = Number(match[10] || 0),
                    minuteOffset = Number(match[11] || 0),
                    result;
                if (
                    hour < (
                        minute > 0 || second > 0 || millisecond > 0 ?
                        24 : 25
                    ) &&
                    minute < 60 && second < 60 && millisecond < 1000 &&
                    month > -1 && month < 12 && hourOffset < 24 &&
                    minuteOffset < 60 && // detect invalid offsets
                    day > -1 &&
                    day < (
                        dayFromMonth(year, month + 1) -
                        dayFromMonth(year, month)
                    )
                ) {
                    result = (
                        (dayFromMonth(year, month) + day) * 24 +
                        hour +
                        hourOffset * signOffset
                    ) * 60;
                    result = (
                        (result + minute + minuteOffset * signOffset) * 60 +
                        second
                    ) * 1000 + millisecond;
                    if (isLocalTime) {
                        result = toUTC(result);
                    }
                    if (-8.64e15 <= result && result <= 8.64e15) {
                        return result;
                    }
                }
                return NaN;
            }
            return NativeDate.parse.apply(this, arguments);
        };

        return Date;
    })(Date);
}

// ES5 15.9.4.4
// http://es5.github.com/#x15.9.4.4
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}

if (typeof Date.prototype.toString != 'function') {
  Date.prototype.toString = function () {
    var result, length, value;
    if (!isFinite(this)) {
      throw new RangeError;
    }
    // See ES 5.1 section 15.9.1.15 for the ISO 8601 date time string format.
    result = [this.getUTCFullYear(), this.getUTCMonth() + 1, this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()];
    length = result.length;
    while (length--) {
      value = result[length];
      // Months, dates, hours, minutes, and seconds should have two digits.
      if (value < 10) {
        result[length] = '0' + value;
      }
    }
    // Milliseconds should have three digits.
    return result.slice(0, 3).join('-') + 'T' + result.slice(3).join(':') + '.' + ('000' + value.getUTCMilliseconds()).slice(-3) + 'Z';
  };
  Date.prototype.toJSON = function () {
    return isFinite(this) ? this.toISOString() : null;
  };
}

if (typeof kendo !== 'undefined') {
    kendo.data.binders.selectedView = kendo.data.Binder.extend({
        refresh: function () {
            var selectedView = this.bindings["selectedView"].get();
            $(this.element).children().hide();
            var children = $(this.element).children();
           $(children[selectedView]).show();
            $(window).trigger("resize");
        }
    });

    kendo.data.binders.isActive = kendo.data.Binder.extend({
        refresh: function () {
            var activeView = this.bindings["isActive"].get();
            var parent = $(this.element).parent();
            //var index = parent.find(this.element.localName).index($(this.element));
            var index = $(this.element).index()

            if (activeView == index) {
                $(this.element).addClass("active");
            } else {
                $(this.element).removeClass("active");
            }
        }
    });

    kendo.data.binders.hasDocument = kendo.data.Binder.extend({
        refresh: function () {
            var id = this.bindings["hasDocument"].get();
            if (id == null) {
                $(this.element).hide();
            } else {
                $(this.element).show();
            }
        }
    });

    kendo.data.binders.stringEnabled = kendo.data.Binder.extend({
        refresh: function () {
            var string = this.bindings["stringEnabled"].get();
            var value = $(this.element).attr("data-value");
            if (value != undefined) {
                if (string == value) {
                    $(this.element).removeAttr("disabled");
                } else {
                    $(this.element).attr("disabled", "disabled");
                }
            } else {
                if (string == "true") {
                    $(this.element).removeAttr("disabled");
                } else {
                    $(this.element).attr("disabled", "disabled");
                }
            }
        }
    });

    kendo.data.binders.reverseEnabled = kendo.data.Binder.extend({
        refresh: function () {
            var value = this.bindings["reverseEnabled"].get();
            if (value == "true" || value == true) {
                $(this.element).attr("disabled", "disabled");
            } else {
                $(this.element).removeAttr("disabled");
            }
        }
    });
}