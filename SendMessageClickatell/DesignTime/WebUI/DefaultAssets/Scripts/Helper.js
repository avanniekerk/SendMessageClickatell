Helper = function () {
    "use strict";
    var stencilJSON;

    //To get static data based on language
    function GetStaticData(type) {
        var url = Config.AgilePointServiceURL;

        var languageCode = Config.languageCode ? Config.languageCode : "en-US";

        if (type == "LCID") {
            url += Config.getCustomAttributeForStaticList;
        }
        else {
            url += Config.getCustomAttributeForResourceList + ":" + languageCode;
        }
        var JSONObject = { "attrName": type }
        var jsonParameters = { url: url, methodType: "POST", data: JSON.stringify(JSONObject) };
        var returnData = [];

        APIHandler.apiCall(jsonParameters, function (response) {
            if (response && response.length > 0) {
                returnData = response;
            }
        });
        if (type == "LCID") {
            return returnData;
        }
        else {
            return eval(returnData.trim());
        }
    };

    //Static List Constants
    var getTimeList = "timeList";
    var getDelayTimeList = "delayTimeList";
    var getStateList = "stateList";
    var getNumList = "numList";
    var getBoolList = "boolList";
    var getTypes = "types";
    var getParameterTypes = "SPParameterType";
    var getDBTypes = "dbTypes";
    var getPropertyList = "propertyList";
    var getMonth = "Month";
    var getDays = "Days";
    var getSPConnectionString = "SPConnectionString";
    var getSPSiteCollection = "SPSiteCollection";
    var getSPSiteName = "SPSiteName";
    var getSPListName = "SPListName";
    var getSPFolderName = "SPFolderName";
    var getSPAbsoluteUrl = "SPAbsoluteUrl";
    var getTimeFormat = "timeFormat";
    var getOperationUnit = "operationUnit";
    var getOperators = "operators";
    var getCheckInTypes = "CheckInTypes";
    var getDocumentTemplates = "DocumentTemplates";
    var getSPListCategories = "SPListCategories";
    var getSfTaskRelatedTo = "SfTaskRelatedTo";
    var getSfTaskStatus = "SfTaskStatus";
    var getSfTaskPriority = "SfTaskPriority";
    var getParticipants = "Participants";
    var getProcInstCategories = "ProcInstCategories";
    var getModelDataTypes = "ModelDataTypes";
    var getDocSignType = "DocSignType";
    var getDCRMOwnerType = "DCRMOwnerType";
    var getDCRMConvertionType = "DCRMConvertionType";
    var getQueryCondition = "QueryCondition";
    var getSfQueryCondition = "SfQueryCondition";
    var getCamlContitonText = "CamlContitonText";
    var getCamlConditionNumber = "CamlConditionNumber";
    var getCamlConditionChoice = "CamlConditionChoice";
    var getCamlConditionBoolean = "CamlConditionBoolean";
    var getOCRMNoteType = "OCRMNoteType";
    var getRelativeOperationUnit = "RelativeOperationUnit";
    var getDateDiffReturnValue = "DateDiffReturnValue";

    try {
        //var stencilJSON = parent.ORYX.I18N.PropertyWindow.PROPERTYJSON;
        var stencilJSON = "";
    }
    catch (exception) {
    }

    //return Application ID
    function GetAppID() {
        // return parent.ORYX.I18N.PropertyWindow.AppID;
        return "";
    }

    //return Application name
    function GetAppName() {
        //return parent.ORYX.I18N.PropertyWindow.AppName;
        return "";
    }

    //return Process Group ID
    function GetGroupID() {
        //return parent.ORYX.I18N.PropertyWindow.ProcGroupID;
        return "";
    }

    function GetWorkPerformers() {
        return parent.ORYX.I18N.PropertyWindow.WorkPerformers;
    }

    function CreateNewUID() {
        var res = [], hex = '0123456789ABCDEF';

        for (var i = 0; i < 36; i++) res[i] = Math.floor(Math.random() * 0x10);

        res[14] = 4;
        res[19] = (res[19] & 0x3) | 0x8;

        for (var i = 0; i < 36; i++) res[i] = hex[res[i]];

        res[8] = res[13] = res[18] = res[23] = '-';

        return res.join('');
    };

    var GetDataModel = function () {
        $.get("Assets/Schema.xml", function (response) {
           var xsdData = new XMLSerializer().serializeToString(response);
            var schemaJSONString = ConvertXSDtoJSON(xsdData, "")["XmlString"];
            var processData, formData;
            if (schemaJSONString !== "") {
                var schemaJSON = JSON.parse(schemaJSONString);
                var processData = schemaJSON.items[0].items[0];
                var formData = schemaJSON.items[0].items[1];
            }
            return { "FormData": formData, "ProcessData": processData };
        });

    };

    var ConvertXSDtoJSON = function (xsdData, processGroupID) {
        var url = Config.AgilePointServiceURL + Config.convertXsdToJSON;
        var JSONObject = { "xsd": xsdData, "procgroupId": processGroupID };
        var responseData = {};
        Array.prototype.toJSON = undefined;
        var parametersJSON = { url: url, methodType: "POST", data: JSON.stringify(JSONObject) };
        APIHandler.apiCall(parametersJSON, function (response) {
            if (response.XmlString) {
                responseData = response;
            }
        });
        return responseData;
    };

    return {
        GetStaticData: GetStaticData,
        getTimeList: getTimeList,
        getDelayTimeList: getDelayTimeList,
        getStateList: getStateList,
        getNumList: getNumList,
        getBoolList: getBoolList,
        getTypes: getTypes,
        getParameterTypes: getParameterTypes,
        getDBTypes: getDBTypes,
        getPropertyList: getPropertyList,
        getMonth: getMonth,
        getDays: getDays,
        GetWorkPerformers: GetWorkPerformers,
        getSPConnectionString: getSPConnectionString,
        getSPSiteCollection: getSPSiteCollection,
        getSPSiteName: getSPSiteName,
        getSPFolderName: getSPFolderName,
        getSPAbsoluteUrl: getSPAbsoluteUrl,
        getTimeFormat: getTimeFormat,
        getOperationUnit: getOperationUnit,
        getOperators: getOperators,
        GetDataModel: GetDataModel,
        ConvertXSDtoJSON: ConvertXSDtoJSON,
        getCheckInTypes: getCheckInTypes,
        getSPListCategories: getSPListCategories,
        CreateNewUID: CreateNewUID,
        getSfTaskRelatedTo: getSfTaskRelatedTo,
        getSfTaskStatus: getSfTaskStatus,
        getSfTaskPriority: getSfTaskPriority,
        getParticipants: getParticipants,
        getProcInstCategories: getProcInstCategories,
        getModelDataTypes: getModelDataTypes,
        getDocumentTemplates: getDocumentTemplates,
        getDocSignType: getDocSignType,
        getDCRMOwnerType: getDCRMOwnerType,
        getDCRMConvertionType: getDCRMConvertionType,
        getQueryCondition: getQueryCondition,
        getSfQueryCondition: getSfQueryCondition,
        getCamlContitonText: getCamlContitonText,
        getCamlConditionNumber: getCamlConditionNumber,
        getCamlConditionChoice: getCamlConditionChoice,
        getCamlConditionBoolean: getCamlConditionBoolean,
        getOCRMNoteType: getOCRMNoteType,
        getRelativeOperationUnit: getRelativeOperationUnit,
        getDateDiffReturnValue: getDateDiffReturnValue,
        GetAppID: GetAppID,
        GetAppName: GetAppName,
        GetGroupID: GetGroupID
    };
}();