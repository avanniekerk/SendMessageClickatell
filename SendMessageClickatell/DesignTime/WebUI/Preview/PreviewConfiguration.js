//Variable declaration
var folder = "";
var viewPort;

$ConfigurationDiv = $("#ConfigurationDiv");

//Supported Languages
var LocaleLang = [
    { "Name": "Chinese Simplified", "Value": "zh-CN" },
    { "Name": "Chinese Traditional", "Value": "zh-TW" },
    { "Name": "English", "Value": "en-US" },
    { "Name": "French", "Value": "fr" },
    { "Name": "German", "Value": "de-DE" },
    { "Name": "Japanese", "Value": "ja-JP" },
    { "Name": "Spanish", "Value": "es" },
	{ "Name": "Japanese(ja)", "Value": "ja" },
    { "Name": "Spanish(es-Es)", "Value": "es-ES" },
    { "Name": "Catalan", "Value": "ca" },
    { "Name": "Dutch", "Value": "nl" },
    { "Name": "Danish", "Value": "da" },
    { "Name": "Arabic", "Value": "ar" },
    { "Name": "Belarusian", "Value": "be" },
    { "Name": "Greek", "Value": "el" },
    { "Name": "Hebrew", "Value": "he" },
    { "Name": "Korean", "Value": "ko" },
    { "Name": "Russian (Russia)", "Value": "ru-RU" }
]

$(document).ready(function () {
    $("#MainDiv").removeClass("hiddenPageload");

    $("#fileupload").bind("change", function (e) {
        $("#txtHTMLPath").val("HTML/" + e.target.files[0].name);
    });

    $("#getpath").bind("click", function () {
        $("#fileupload").click();
    });

    $("#MainDiv").removeClass("hiddenPageload");
    $("#uploadfile").bind("change", function (e) {
      
        $("#txtHTMLPath").val("HTML/" +  e.target.files[0].name);
    });
    viewPort = $("#horizontal").kendoSplitter({
        panes: [
            { collapsible: false },
            { collapsible: true, resizable: false, size: "25%" }
        ],
        collapse: function () {
            Collapse();

        },
        expand: function () {
            Expand();
        }
    }).data('kendoSplitter');

    $('#horizontal').on('click', '.k-collapsed-icon', function () { Expand(); });

    $('#horizontal').on('click', '.right-header-icon', function () { Collapse(); });

    Collapse();

    $("#MainControlDiv").css("display", "inline-block");

    $ConfigurationDiv.css("display", "none");
    Utility.DropdownBind("#ddLanguage", LocaleLang, "Name", "Value");

    $("#ddLanguage").data("kendoDropDownList").value("en-US");
    $(".MasterControlDiv").center(true);
    Onload();
});

//Align the preview window to middle of the page
jQuery.fn.center = function (parent) {
    if (parent) {
        parent = this.parent();
    } else {
        parent = window;
    }

    var _Top = (($(parent).height() - this.outerHeight()) / 2) + $(parent).scrollTop();
    var _left = (($(parent).width() - this.outerWidth()) / 2) + $(parent).scrollLeft();

    $(".MasterControlDiv").css({
        "top": _Top > 0 ? (_Top + "px") : "0px",
        "left": _left > 10 ? (_left + "px") : "0px"
    });

    return this;
}

$(window).on("resize", function () {
    $(".MasterControlDiv").center(true);

    if ($ConfigurationDiv.css("display") != "none") {
        Collapse();
    }
});

$("#windowBtnPreview").on("click", function () {

    Config.ConfigWindow = Config.getCookie("ConfigWindow");

    if (Config.ConfigWindow == "") {
        CheckUserAuth();
    }

    if (OnValidate()) {
        folder = "../" + $("#txtHTMLPath").val();
        
        $("#applicationTree").accordion({
            heightStyle: "fill"
        });

        if (folder.length > 0) {
            LoadProcessData().done(function () {
                $.get(folder, function (response) {
                    if (response.length > 0) {
                        var htmlContent = response;
                        $("#htmlDiv").html("");
                        var data = htmlContent;
                        var jsfiles = [];
                        var parser = new DOMParser();
                        window.pageNamespace = parser.parseFromString(response, "text/html").body.getAttribute('data-onload');
                        jsfiles.push({ FileName: "../Locale/" + Config.languageCode + "/" + window.pageNamespace + "." + Config.languageCode + ".json", DataType: "json" });

                        $.get(jsfiles[0].FileName, function (response) {
                            if (response) {
                                window.pageNamespace_Res = JSON.parse('{ "' + Config.languageCode + '": { "translation": ' + JSON.stringify(response) + '}}');
                            }

                            $("#htmlDiv").append(htmlContent);
                            $ConfigurationDiv.css("display", "inline-block");
                            $("#MainControlDiv").css("display", "none");
                        });
                    }
                });
            });
        }
    }
});

$("#windowBtnCANCEL").on("click", function () {
    $("#htmlDiv").html("");
    $("#MainControlDiv").css("display", "inline-block");
    $ConfigurationDiv.css("display", "none");
});

$("#windowBtnTest").on("click", function () {
    CheckUserAuth();
});

$("#windowBtnReset").on("click", function () {
    EnableDisableAuthorizationDetails(false);
    $("#txtDomainName,#txtUserName,#txtPassword,#txtAuthorization").val("");
    Config.setCookie("ConfigWindow", "", -1);
});

$("#windowBtnOK").on("click", function () {
    if (pageNamespace && eval(pageNamespace.trim())["OnValidate"]()) {
        eval(pageNamespace.trim())["OnSubmit"]();
    }
});

//Expanding Process Data Panel
function Expand() {
    var splitter = $('#horizontal').find('.k-splitbar');

    splitter.removeClass('k-collapsed');
    viewPort.expand("#right-pane");
    SetDataProcessNiceScroll();
}

//Collapsing Process Data Panel
function Collapse() {
    var splitter = $('#horizontal').find('.k-splitbar');

    splitter.addClass('k-collapsed');
    viewPort.collapse("#right-pane");

    window.setTimeout(function () {
        splitter.html("");
        splitter.append('<span class="k-collapsed-icon"></span><span class="k-collapsed-text">Process Data</span>');
    }, 100)

    $('#horizontal').find('.k-splitbar').show();
    SetDataProcessNiceScroll();
}

function SetDataProcessNiceScroll() {
    if ($(".DataPanelTree").getNiceScroll().length > 0) {
        $(".DataPanelTree").getNiceScroll().resize();
    } else {
        $(".DataPanelTree").niceScroll({ horizrailenabled: false });
    }
};

function OnValidate() {
    $('.k-invalid-msg').css('display', 'none');
    var validflag = true;

    validflag = validflag ? ValidateTextBox("txtHTMLPath", "errorHTMLPath", "TextBox") : false;
    return validflag;
};

var ValidateTextBox = function (controlId, errorControlId, ControlName) {
    var controlType = "textbox", errorMsg = "";
    errorMsg = "Please enter HTML Path";

    if (!Validate.ValidateIsNullOrEmpty(controlId, errorControlId, controlType, errorMsg)) {
        return false;
    };

    return true;
};

var CheckUserAuth = function () {
    Config.ConfigWindow = Config.getCookie("ConfigWindow");
    if (Config.ConfigWindow == "") {
        var domain = ($("#txtDomainName").val()).trim(),
            userName = $("#txtUserName").val().trim(),
            password = $("#txtPassword").val().trim(),
            serviceURL = $("#txtAPServerURL").val().trim();
        if (!serviceURL.endsWith('/')) {
            serviceURL = serviceURL + '/';
        }
        Config.AgilePointServiceURL = (domain && userName && password) ? serviceURL : '';
        
        AuthenticateUser(domain, userName, password, function (status) {
            if (status == "success") {
                Config.ConfigWindow = {
                    "DomainName": domain,
                    "UserName": userName,
                    "ServiceURL": Config.AgilePointServiceURL,
                    "Authorization": Config.AuthorizationDetails
                };
                Config.setCookie("ConfigWindow", JSON.stringify(Config.ConfigWindow));
            }
        });
    }
};

var Onload = function () {
    Config.languageCode = Config.getCookie("Locale") ? Config.getCookie("Locale") : "en-US";
    $("#ddLanguage").data("kendoDropDownList").value(Config.languageCode);
    SetLanguage();
    Config.ConfigWindow = Config.getCookie("ConfigWindow") ? Config.getCookie("ConfigWindow") : {};
    if (Config.ConfigWindow != "" && Object.keys(Config.ConfigWindow).length != 0) {
        Config.ConfigWindow = JSON.parse(Config.ConfigWindow);

        $("#txtDomainName").val(Config.ConfigWindow["DomainName"]);
        $("#txtUserName").val(Config.ConfigWindow["UserName"]);
        $("#txtAPServerURL").val(Config.ConfigWindow["ServiceURL"]);

        Config.AgilePointServiceURL = Config.ConfigWindow["ServiceURL"];
        Config.AuthorizationDetails = Config.ConfigWindow["Authorization"];
        (Config.AuthorizationDetails) && EnableDisableAuthorizationDetails(true);
    }
};

$("#ddLanguage").on("change", function () {
    Config.languageCode = $("#ddLanguage").val();
    Config.setCookie("Locale", Config.languageCode);
    SetLanguage();
});

//TODO : Set selected locale to Master page
function SetLanguage(callBack) {
    var lang = Config.languageCode;
    var MasterLocale = "";

    //$.get('/Locale/' + lang + '/MasterPage.json?', function (response) {

    $.get("PreviewConfiguration.json", function (response) {
        if (response) {
            MasterLocale = JSON.parse('{ "' + Config.languageCode + '": { "translation": ' + JSON.stringify(response) + '}}');
            i18n.init({ lng: lang, "resStore": eval(MasterLocale), }, function (t) { $('.Langi8n').i18n(); });
        }
    });
};