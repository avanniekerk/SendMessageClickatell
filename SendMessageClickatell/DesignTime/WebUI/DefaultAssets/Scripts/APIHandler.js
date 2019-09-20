//For avoiding "No- Transport" error
//force cross-site scripting (as of jQuery 1.5)
jQuery.support.cors = true;

var APIHandler = {
    apiCall: function (jsonParameters, callBack) {
        var url = jsonParameters.url,
            data = "",
            methodType = jsonParameters.methodType,
            contentType = "application/json";
        if (jsonParameters.data) {
            if ((jsonParameters.data !== null) || (jsonParameters.data != "")) {
                data = jsonParameters.data;
            }
        }
        if (jsonParameters.contentType) {
            if ((jsonParameters.contentType !== null) || (jsonParameters.contentType != "")) {
                contentType = jsonParameters.contentType;
            }
        }
        if (Config.AuthorizationDetails) {
            jQuery.ajax({
                headers: { "Authorization": Config.AuthorizationDetails, "Access-Control-Allow-Headers": "*", "locale": Config.languageCode },
                url: url,
                async: false,
                cache: false,
                processData: false,
                contentType: contentType,
                dataType: "json",
                data: data,
                type: methodType,
                success: function (data, status) {
                    if (callBack instanceof Function) {
                        callBack(data);
                    }
                },
                error: function (errorObj) {
                    if (errorObj.status != 200) {
                        callBack(errorObj);
                    }
                    else {
                        callBack("Success", errorObj.responseText);
                    }
                }
            });
        }
    }
};