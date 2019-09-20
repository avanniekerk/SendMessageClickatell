Config = function () {
    "use strict";

    var AgilePointServiceURL = '';
    var authVal = "";
    var ConfigWindow = {};
    var languageCode = "en-US";
    var AuthorizationDetails = "";
    var globalApplication = "Global App Token"

    //Extension for Shapes
    var getCustomAttributes = "Workflow/GetCustomAttrsByID/GLOBAL:{F09E4B16-466D-41a7-8EC2-0936D9D5DDE1}?appID=EM-Redesign&locale=en-US";
    var getAppSettingEntriesByAppNameSDTName = "Extension/GetAppSettingEntriesByAppNameSDTName/";
    var getEnumValues = "Extension/GetEnumValues";
    var convertXsdToJSON = "Extension/ConvertXsdToJSON";

    //To get Access Tokens
    var boxType = "/Box";
    var sharePointType = "/SharePoint";
    var dataBaseDataType = "/Database";
    var salesForceDataType = "/Salesforce";
    var netSuite = "/NetSuite";
    var dynamics = "/MSDynamicsCRM";
    var oneDrive = "/OneDrive";
    var dropboxType = "/Dropbox";
    var googleDriveType = "/GoogleDrive";
    var yammer = "/Yammer";
    var WCFServiceType = "/WCF Service";
    var WSEServiceType = "/Web Service";
    var activedirectoryType = "/ActiveDirectory";
    var exchangeserverType = "/ExchangeServer";
    var RestType = "/REST Service";
    var lync = "/Lync";
    var DocuSign = "/DocuSign";
    var eSignatureType = "/Sertifi";
    var AgilePointID = "/AgilePointAccount";
    var AnonymousAccessType = "/AnonymousAccess";
    var OracleDataType = "/OracleCRM";

    //Create a cookie for the Master Page information
    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        }
        document.cookie = name + "=" + value + expires;
        // document.cookie = cname + "=" + cvalue + "; ";
    }

    //Returns the cookie information and load in the master page if the cookie exists
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');

        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);

            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }

        return "";
    }

    return {
        AgilePointServiceURL: AgilePointServiceURL,
        authVal: authVal,
        languageCode: languageCode,
        ConfigWindow: ConfigWindow,

        convertXsdToJSON: convertXsdToJSON,

        globalApplication: globalApplication,
        getCustomAttributes: getCustomAttributes,
        getAppSettingEntriesByAppNameSDTName: getAppSettingEntriesByAppNameSDTName,
        getEnumValues: getEnumValues,
        boxType: boxType,
        sharePointType: sharePointType,
        dataBaseDataType: dataBaseDataType,
        salesForceDataType: salesForceDataType,
        netSuite: netSuite,
        dynamics: dynamics,
        oneDrive: oneDrive,
        dropboxType: dropboxType,
        googleDriveType: googleDriveType,
        yammer: yammer,
        WCFServiceType: WCFServiceType,
        WSEServiceType: WSEServiceType,
        activedirectoryType: activedirectoryType,
        exchangeserverType: exchangeserverType,
        restType: RestType,
        lync: lync,
        DocuSign: DocuSign,
        eSignatureType: eSignatureType,
        AgilePointID: AgilePointID,
        AnonymousAccessType: AnonymousAccessType,
        oracleDataType: OracleDataType,

        setCookie: setCookie,
        getCookie: getCookie
    }
}();