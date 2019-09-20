Validate = function () {
    "use strict";
    var errorIconString = '<span class="k-icon k-warning"></span>';
    var successIconString = '<span class="k-icon k-success"></span>';
    var numericRegularExpression = /^[0-9]*$/;
    var stringRegularExpression = /^[a-zA-Z0-9]+$/;
    var stringRegularExpressionwithQuote = /^["a-zA-Z0-9"]+$/; //For User Defined properties
    var decimalRegularExpression = /^[0-9.]*$/;
    var customAttrRegularExpression = /^\${[a-zA-Z0-9!@#\$%\^\&*\)\/\:(+=._-]+}$/;
    var emailRegularExpression = /[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/;
    var emailRegularExpression = /[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/;
    var urlRegularExpression = /^(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_=]*)?$/i;

    //Get the value of the control based on type. This is used for validation purpose.
    var GetControlValue = function (controlId, controlType) {
        var controlValue = null;

        switch (controlType.toLowerCase()) {
            case "textbox":
                controlValue = $("#" + controlId).val().trim();
                break;

            case "customattribute":
                var Control = typeof (controlId) == "string" ? $("#" + controlId) : $(controlId);
                if (Control.children().length == 1 && Control.children()[0].tagName == "SPAN") {
                    controlValue = $(Control.children()[0]).attr("title").trim();
                }
                else {
                    controlValue = "";
                }
                break;

            case "dropdown":
                if ($("#" + controlId + " option:selected").val() != undefined)
                    controlValue = $("#" + controlId + " option:selected").val().trim();
                else
                    controlValue = "";
                break;

            case "combobox":
                controlValue = $("#" + controlId).val().trim();
                break;
        }

        return controlValue;
    };

    //Method to display error message.
    var ManageErrorMessage = function (errorControlId, errorMessage, isValid) {
        if (errorMessage !== "") {
            if (!isValid) {
                $("#" + errorControlId).attr("title", errorMessage);
                $("#" + errorControlId).html(errorIconString + errorMessage);
                $("#" + errorControlId).css({ "display": "inline-block" });
            }
            else {
                $("#" + errorControlId).html("");
                $("#" + errorControlId).css({ "display": "none" });
            }
        }
    };

    //Method to display success message.
    var ManageSuccessMessage = function (successControlId, successMessage, isValid) {
        if (successMessage !== "") {
            if (isValid) {
                $("#" + successControlId).attr("title", successMessage);
                $("#" + successControlId).html(successIconString + successMessage);
                $("#" + successControlId).css({ "display": "inline-block" });
            }
            else {
                $("#" + successControlId).html("");
                $("#" + successControlId).css({ "display": "none" });
            }
        }
    };

    //Validate a contol for null or empty
    var ValidateIsNullOrEmpty = function (controlId, errorControlId, controlType, errorMessage) {
        var isNullorEmpty = false
        var controlValue = GetControlValue(controlId, controlType);

        if (controlValue == "" || controlValue == null) {
            isNullorEmpty = true;
        }

        ManageErrorMessage(errorControlId, errorMessage, !isNullorEmpty);
        return !isNullorEmpty;
    };

    //Valiate a contol if it have any special character, if user pass the custom value then we will validate against that value, else with the default value defined. 
    var ValidateSpecialCharacters = function (controlId, errorControlId, controlType, errorMessage, customSpecialCharacters) {
        var specialCharacters = ['>', '<', '&', '"', '@', '#', '?', "'"];

        if (customSpecialCharacters) {
            specialCharacters = customSpecialCharacters;
        }

        var hasSpecialCharacter = false;
        var controlValue = GetControlValue(controlId, controlType);

        $(specialCharacters).each(function (index, data) {
            if (controlValue.indexOf([data]) >= 0) {
                hasSpecialCharacter = true;
                return;
            }
        });

        ManageErrorMessage(errorControlId, errorMessage, !hasSpecialCharacter);
        return !hasSpecialCharacter;
    };

    //Validate control to allow only numeric values 
    var ValidateIsNumeric = function (controlId, errorControlId, controlType, errorMessage) {
        var isNumeric = true;
        var controlValue = GetControlValue(controlId, controlType);

        if (!numericRegularExpression.test(controlValue)) {
            isNumeric = false
        }

        ManageErrorMessage(errorControlId, errorMessage, isNumeric);
        return isNumeric;
    };

    //Validate control to allow only string values 
    var ValidateIsString = function (controlId, errorControlId, controlType, errorMessage) {
        var isString = true;
        var controlValue = GetControlValue(controlId, controlType);

        if (!stringRegularExpression.test(controlValue)) {
            isString = false
        }

        ManageErrorMessage(errorControlId, errorMessage, isString);
        return isString;
    };

    //Validate control to allow only decimal values 
    var ValidateIsDecimal = function (controlId, errorControlId, controlType, errorMessage) {
        var isDecimal = true;
        var controlValue = GetControlValue(controlId, controlType);

        if (!decimalRegularExpression.test(controlValue)) {
            isDecimal = false
        }

        ManageErrorMessage(errorControlId, errorMessage, isDecimal);
        return isDecimal;
    };

    //Validate control for given Maximum value
    var ValidateMaxValue = function (controlId, errorControlId, controlType, errorMessage, maxValue) {
        var maximumValue = maxValue;
        var isMaximum = false;
        var controlValue = parseInt(GetControlValue(controlId, controlType));

        if (controlValue > maximumValue) {
            isMaximum = true;
        }

        ManageErrorMessage(errorControlId, errorMessage, !isMaximum);
        return !isMaximum;
    };

    //Validate control for given Minimun value
    var ValidateMinValue = function (controlId, errorControlId, controlType, errorMessage, minValue) {
        var minimumValue = minValue;
        var isMinimum = false;
        var controlValue = parseInt(GetControlValue(controlId, controlType));

        if (controlValue < minimumValue) {
            isMinimum = true;
        }

        ManageErrorMessage(errorControlId, errorMessage, !isMinimum);
        return !isMinimum;
    };

    //Validate control for a valid custom attribute (HTML DIV Element)
    var ValidateCustomAttribute = function (controlId, errorControlId, controlType, errorMessage) {
        var isCustomAttr = true;
        var controlValue = GetControlValue(controlId, controlType);

        if (!customAttrRegularExpression.test(controlValue)) {
            isCustomAttr = false
        }

        ManageErrorMessage(errorControlId, errorMessage, isCustomAttr);
        return isCustomAttr;
    };

    //Validate control for a valid single Email ID
    var ValidateEmailId = function (controlId, errorControlId, controlType, errorMessage) {
        var isEmailValid = true;
        var controlValue = GetControlValue(controlId, controlType);

        if (!(emailRegularExpression.test(controlValue) || customAttrRegularExpression.test(controlValue))) {
            isEmailValid = false
        }

        ManageErrorMessage(errorControlId, errorMessage, isEmailValid);
        return isEmailValid;
    };

    //Validate control for a valid set of Email ID
    var ValidateEmailIds = function (controlId, errorControlId, controlType, errorMessage, seperator) {
        var isEmailValid = true;
        var controlValue = GetControlValue(controlId, controlType);
        var emailIdsList = controlValue.split(seperator);

        $(emailIdsList).each(function (index, mailId) {
            if (mailId == "") {
                if (!(index == emailIdsList.length - 1 || index == 0)) {
                    isEmailValid = false;
                }
            }
            else if (mailId !== "" && !(emailRegularExpression.test(mailId) || customAttrRegularExpression.test(mailId))) {
                isEmailValid = false;
            }
        })

        ManageErrorMessage(errorControlId, errorMessage, isEmailValid);
        return isEmailValid;
    };

    //Validate control for a valid Website
    var ValidateWebSiteURL = function (controlId, errorControlId, controlType, errorMessage) {
        var isURLValid = true;
        var controlValue = GetControlValue(controlId, controlType);

        if (!(urlRegularExpression.test(controlValue) || customAttrRegularExpression.test(controlValue))) {
            isURLValid = false
        }

        ManageErrorMessage(errorControlId, errorMessage, isURLValid);
        return isURLValid;
    };

    //Validate control to allow only string type without space
    var ValidateBlankSpace = function (controlId, errorControlId, controlType, errorMessage) {
        var isBlankSpace = false;
        var controlValue = GetControlValue(controlId, controlType).replace(/^\s+/, '').replace(/\s+$/, '');

        if (controlValue.search(" ") == -1) {
            isBlankSpace = true
        }

        ManageErrorMessage(errorControlId, errorMessage, isBlankSpace);
        return isBlankSpace;
    };

    //Validate a valid x-path format
    var ValidateXpathValue = function (controlValue, Classname) {
        var isValid = false;
        var myRegExp = /^(\${)(|[A-Za-z_:\/\-\s0-9()\\]+)(})+$/;
        var myRegExpXpath = /^(\/)(|[A-Za-z_:\/\-\s0-9()\\]+)$/;

        if (Classname == "xpath") {
            if (myRegExpXpath.test(controlValue)) {
                isValid = true;
            }
        }
        else if (customAttrRegularExpression.test(controlValue)) {
            isValid = true;
        }

        return isValid;
    };

    return {
        GetControlValue: GetControlValue,
        ManageErrorMessage: ManageErrorMessage,
        ManageSuccessMessage: ManageSuccessMessage,
        ValidateIsNullOrEmpty: ValidateIsNullOrEmpty,
        ValidateSpecialCharacters: ValidateSpecialCharacters,
        ValidateIsNumeric: ValidateIsNumeric,
        ValidateMaxValue: ValidateMaxValue,
        ValidateMinValue: ValidateMinValue,
        ValidateCustomAttribute: ValidateCustomAttribute,
        ValidateEmailId: ValidateEmailId,
        ValidateEmailIds: ValidateEmailIds,
        ValidateWebSiteURL: ValidateWebSiteURL,
        ValidateBlankSpace: ValidateBlankSpace,
        NumericRegularExpression: numericRegularExpression,
        StringRegularExpression: stringRegularExpression,
        DecimalRegularExpression: decimalRegularExpression,
        CustomAttrRegularExpression: customAttrRegularExpression,
        EmailRegularExpression: emailRegularExpression,
        UrlRegularExpression: urlRegularExpression,
        StringRegularExpressionwithQuote: stringRegularExpressionwithQuote,
        ValidateXpathValue: ValidateXpathValue
    };
}();