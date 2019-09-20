Utility = function () {
    "use strict";
    var NameField = "";
    var isEditDiv = false;

    //Set the Locale for HTML page
    function SetLocale(callBack) {
        var lang = Config.languageCode ? Config.languageCode : "en-US";
        i18n.init({ "resStore": eval(window.pageNamespace_Res), lng: lang }, function (t) {
            $('.i8n').i18n();
            $("#i8n").css("display", "block");
        });
    };

    //Set locale placeholder for grid
    function SetDynamicLocale(callBack) {
        var lang = Config.languageCode ? Config.languageCode : "en-US";
        i18n.init({ "resStore": eval(window.pageNamespace_Res), lng: lang }, function (t) {
            $('.dynamic_i18n').i18n();
        });
    };

    //Returns the locale string for the key value
    function GetLocaleString(property) {
        var language = Config.languageCode ? Config.languageCode : "en-US";
        var ConfigPage;
        var localeString;

        try {
            ConfigPage = eval("" + pageNamespace + "_Res");
            localeString = ConfigPage[language]["translation"][property]
        }
        catch (e) {
            ConfigPage = eval(pageNamespace_Res);
            localeString = ConfigPage[language]["translation"][property]
        }
        return localeString;
    };

    //Set the values for the Shape Properties as Name Value Pair
    function AddDataToJSONOnSubmit(configJSON, name, value) {
        configJSON.Data.Properties.push({ "Name": name, "Value": value });
    }
    
    //Bind a dropdown with the input data without any default value.
    function DropdownBind(dropDownName, dataSource, textfield, valueField, IsSort, IsLocale) {
        dataSource = SortDataSurce(dataSource, textfield, valueField, IsSort, IsLocale);
        $(dropDownName).kendoDropDownList({
            dataTextField: textfield,
            dataValueField: valueField,
            dataSource: dataSource
        });
    }

    //Bind a dropdown with the input data with 'Select' as a default value.
    function DropdownBindWithLable(dropDownName, dataSource, textfield, valueField, IsSort, IsLocale) {
        dataSource = SortDataSurce(dataSource, textfield, valueField, IsSort, IsLocale);

        if (dataSource.length > 0) {
            $(dropDownName).kendoDropDownList({
                dataTextField: textfield,
                dataValueField: valueField,
                dataSource: dataSource,
                optionLabel: Utility.GetLocaleString("select")
            }).select(0);
        } else {
            var obj = {}, emptydataSource = [];

            obj[valueField] = "";
            obj[textfield] = Utility.GetLocaleString("select");
            emptydataSource.push(obj);
            DropdownBind(dropDownName, emptydataSource, textfield, valueField, false, IsLocale);
        }
    };

    //Function used to retrieve the Access Tokens. We have to Pass the Smart Data type names.
    //You can find the smart datatype names in Config.js file.
    function LoadAppTokens(type) {
        var deferred = jQuery.Deferred();
        var connectionStringGlobalList = [];

        if (type != "" && type != undefined) {
            var Globalurl = Config.AgilePointServiceURL + Config.getAppSettingEntriesByAppNameSDTName + Config.globalApplication + type;
            var APIObject = { url: Globalurl, methodType: 'GET' };

            APIHandler.apiCall(APIObject, function (e) {
                if (e != undefined && e != null && e.GetAppSettingEntriesByAppNameSDTNameResult && e.GetAppSettingEntriesByAppNameSDTNameResult.length > 0) {
                    connectionStringGlobalList = getAppTokensXML(e, type);
                }
                deferred.resolve(connectionStringGlobalList);
            });
        }
        else {
            deferred.resolve(connectionStringGlobalList);
        }

        return deferred.promise();
    };

    //Function used to parse the Access Token XML based on token type
    function getAppTokensXML(response, type) {
        var connectionStringList = [];

        for (var i = 0; i < response.GetAppSettingEntriesByAppNameSDTNameResult.length; i++) {
            var attrName = response.GetAppSettingEntriesByAppNameSDTNameResult[i].Key;
            var appName = response.GetAppSettingEntriesByAppNameSDTNameResult[i].AppName;
            var xmldoc = $.parseXML(response.GetAppSettingEntriesByAppNameSDTNameResult[i].Value);

            switch (type) {
                case Config.dataBaseDataType:
                    var ConnectionString = $(xmldoc).find("ConnectionString").text();
                    var dbType = $(xmldoc).find("DBVendor").text();
                    connectionStringList.push({ Name: attrName, Value: attrName + "^" + appName + "^" + ConnectionString, DBType: dbType });
                    break;

                case Config.sharePointType:
                    var UserName = $(xmldoc).find("UserName").text();
                    var SiteCollection = $(xmldoc).find("SPWebApplicationUrl").text();
                    connectionStringList.push({ Name: attrName, Value: attrName + "^" + appName + "^" + SiteCollection, UserName: UserName });
                    break;

                case Config.WCFServiceType:
                    var bindingname = $(xmldoc).find("SelectedBinding").text();
                    var endpointName = $(xmldoc).find("SelectedEndPoint").text();
                    var generateMsg = $(xmldoc).find("IsGenerateMessageContract").text();
                    var WcfUrl = $(xmldoc).find("WcfUrl").text();
                    connectionStringList.push({ Name: attrName, Value: attrName + "^" + appName, IsGenerateMessageContract: generateMsg, url: WcfUrl, bindName: bindingname, endpointName: endpointName });
                    break;

                case Config.WSEServiceType:
                    var WSEUrl = $(xmldoc).find("WebServiceUrl").text();
                    var SecuritySoapHeader = $(xmldoc).find("SOAPHeader").text();
                    var CustomHeaderAttributes = [];
                    var custAttr = ($(xmldoc).find("Headers")) && $(xmldoc).find("Headers").children();

                    for (var count = 0; count < custAttr.length; count = count + 2) {
                        CustomHeaderAttributes.push({ "Name": $($(xmldoc).find("Headers").children()[count]).text(), "Value": $($(xmldoc).find("Headers").children()[count + 1]).text() })
                    }

                    var ClientSSLCertificate = [];
                    var clientCert = ($(xmldoc).find("clientCertificate")) && $(xmldoc).find("clientCertificate").children();

                    for (var index = 0; index < clientCert.length; index = index + 2) {
                        ClientSSLCertificate.push({ "Name": $($(xmldoc).find("clientCertificate").children()[index]).text(), "Value": $($(xmldoc).find("clientCertificate").children()[index + 1]).text() });
                    }
                    connectionStringList.push({ Name: attrName, Value: attrName + "^" + appName, url: WSEUrl, customHeader: '', securitySoapHeader: SecuritySoapHeader, customHeaderAttributes: CustomHeaderAttributes, clientSSLCertificate: ClientSSLCertificate });
                    break;

                case Config.yammer:
                    var NetworkName = $(xmldoc).find("NetworkName").text();
                    connectionStringList.push({ Name: attrName, Value: attrName + "^" + appName + "^" + NetworkName });
                    break;

                case Config.DocuSign:
                    var authURL = $(xmldoc).find("AuthURL").text();
                    connectionStringList.push({ Name: attrName, Value: attrName + "^" + appName + "^" + authURL });
                    break;

                case Config.salesForceDataType:
                    var InstanceName = $(xmldoc).find("InstanceName").text();
                    connectionStringList.push({ Name: attrName, Value: attrName + "^" + appName, InstanceName: InstanceName });
                    break;

                case Config.salesForceDataType:  //For SalesForce Chatter
                    var InstanceName = $(xmldoc).find("InstanceName").text();
                    connectionStringList.push({ Name: attrName, Value: attrName + "^" + appName, InstanceName: InstanceName });
                    break;

                case Config.restType:
                    var xmldoc = $(response.GetAppSettingEntriesByAppNameSDTNameResult[i].Value);
                    var restServerURL = $(xmldoc).find("RuntimeURL").text();
                    var action = $(xmldoc).find("HttpMethod").text();
                    var accept = $(xmldoc).find("Accept").text();
                    var protocol = $(xmldoc).find("Protocol").text();
                    var runtimePayload = $(xmldoc).find("RuntimePayload").text();
                    var contentType = $(xmldoc).find("ContentType").text();
                    var requestTimeout = $(xmldoc).find("RequestTimeout").text();
                    var readWriteTimeout = $(xmldoc).find("ReadWriteTimeout").text();
                    var serializedHeader = $(xmldoc).find("SerializedHeader").text();
                    var requestHeader = [];

                    var reqHdrAttr = ($(xmldoc).find("RequestHeader")) && $(xmldoc).find("RequestHeader");//.children();

                    if (reqHdrAttr.length > 0) {
                        var nameValueArray = $($(xmldoc).find("RequestHeader").text()).children();

                        for (var count = 0; count <= nameValueArray.length - 1; count++) {

                            var name = $($(nameValueArray[count]).children()[0]).text();
                            var value = $($(nameValueArray[count]).children()[1]).text();
                            requestHeader.push({ "Name": name, "Value": value });
                        }
                    }
                    var isOAuth = $(xmldoc).find("IsOAuth").text();
                    var oAuthApplicationName = $(xmldoc).find("OAuthApplicationName").text();
                    var oAuthApplicationType = $(xmldoc).find("OAuthApplicationType").text();
                    var oAuthApplicationKey = $(xmldoc).find("OAuthApplicationKey").text();
                    var headerPrefix = $(xmldoc).find("HeaderPrefix").text();

                    connectionStringList.push({
                        Name: attrName, Value: attrName + "^" + appName,
                        RestServerURL: restServerURL,
                        Action: action,
                        Accept: accept,
                        ContentType: contentType,
                        RequestTimeout: requestTimeout,
                        ReadWriteTimeout: readWriteTimeout,
                        SerializedHeader: serializedHeader,
                        RequestHeader: requestHeader,
                        IsOAuth: isOAuth,
                        OAuthApplicationName: oAuthApplicationName,
                        OAuthApplicationType: oAuthApplicationType,
                        OAuthApplicationKey: oAuthApplicationKey,
                        HeaderPrefix: headerPrefix,
                        Protocol: protocol,
                        RuntimePayload: runtimePayload
                    });
                    break;

                case Config.AgilePointID:
                    var domainName = $(xmldoc).find("DomainName").text();
                    var userName = $(xmldoc).find("UserName").text();
                    var useSystemAccount = $(xmldoc).find("UseSystemAccount").text();
                    var entryID = response.GetAppSettingEntriesByAppNameSDTNameResult[i].ID;

                    connectionStringList.push({ Name: attrName, Value: attrName + "^" + appName, DomainName: domainName, UserName: userName, EntryID: entryID, UseSystemAccount: useSystemAccount });
                    break;

                default:
                    connectionStringList.push({ Name: attrName, Value: attrName + "^" + appName });
                    break;
            }
        }

        return connectionStringList;
    }

    //Bind the values to controls on page load
    function BindDataToControls(retrieveJSON) {
        var retrieveData = retrieveJSON.Data ? retrieveJSON.Data.Properties : retrieveJSON;

        $(retrieveData).each(function (index, obj) {
            var element = document.getElementById(obj.Name);

            if (element) {
                if (element.tagName == "INPUT" || element.tagName == "TEXTAREA") {
                    if ($("#" + obj.Name).data("kendoNumericTextBox")) {
                        $("#" + obj.Name).data("kendoNumericTextBox").value(obj.Value);
                    }
                    else if ($("#" + obj.Name).data("kendoComboBox")) {
                        var combobox = $("#" + obj.Name).data("kendoComboBox");
                        combobox.value(obj.Value);
                        for (var i = 0; i < combobox.options.dataSource.length; i++) {
                            if (combobox.options.dataSource[i].Name == obj.Value || combobox.options.dataSource[i].Value == obj.Value) {
                                combobox.select(i);
                                break;
                            }
                        }
                    }
                    else if (typeof obj.Value == "boolean") {
                        element.checked = obj.Value;
                    }
                    else {
                        element.value = obj.Value;
                    }
                }
                else if (element.tagName == "SELECT") {
                    if ($("#" + obj.Name).data("kendoDropDownList")) {
                        var selectedItem = obj.Value, length = element.options.length
                        for (var i = 0; i < length; i++) {
                            if ((element.options[i].text == selectedItem) || (element.options[i].value == selectedItem)) {
                                var dropDown = $("#" + obj.Name).data("kendoDropDownList");
                                dropDown.select(i);
                                break;
                            }
                        }
                    }
                    else if ($("#" + obj.Name).data("kendoComboBox")) {
                        var combobox = $("#" + obj.Name).data("kendoComboBox");
                        combobox.value(obj.Value);
                        for (var i = 0; i < combobox.options.dataSource.length; i++) {
                            if (combobox.options.dataSource[i].Name == obj.Value || combobox.options.dataSource[i].Value == obj.Value) {
                                combobox.select(i);
                                break;
                            }
                        }
                    }
                }
            }

        });
    }

    //Function would sort the datasource values in alphabetical order
    var SortDataSurce = function (dataSource, textfield, valueField, IsSort, IsLocale) {
        if (IsSort != false) {
            NameField = (IsLocale != true) ? textfield : valueField;

            dataSource = dataSource.sort(function (x, y) {
                return x[NameField].localeCompare(y[NameField]);
            });
        }
        return dataSource;
    };

    //Function to allow edit mode on double click of Custom Attribute.
    var EditDivSpanContent = function (Element) {
        if (!$(Element).hasClass("customAttr") && !$(Element).hasClass("textBoxDisabled")) {
            isEditDiv = true;
            var DivContent = "";

            $(Element).removeClass('replace');
            DivContent = $($(Element).children()[0]).attr('title');
            $(Element.children).remove();
            $(Element).attr("contentEditable", true);
            $(Element).append(DivContent);
            $(Element).focus();
        }
    };

    //Function to retain the span after editing of Custom Attribute.
    var BlurDivSpanContent = function (Element) {
        var DivContent = "";
        $(Element).addClass('replace');

        if (isEditDiv) {
            if ((Element.children.length !== 0 && Element.children[0].tagName == "SPAN")) {
                DivContent = $($(Element).children()[0]).attr('title');
                $($(Element).children()[0]).remove();
                DivContent = $(Element).text() + DivContent;
                $(Element).text(DivContent);
                $(Element).attr("contentEditable", true);
                $(Element).focus();
            }
        }

        isEditDiv = false;
        DivContent = "";
    };

    $('div').on("dblclick", '.DivPlaceHolder', function (e) {
        EditDivSpanContent(this);
    });

    $('div').on("blur", '.DivPlaceHolder', function (e) {
        BlurDivSpanContent(this);
    });

    $('div').on("keydown", '.DivPlaceHolder', function (event) {
        if ((this.children.length !== 0 && $(this.children)[0].tagName == "SPAN") || event.keyCode == 13) {
            this.blur();
            return false;
        }
    });

    return {
        SetLocale: SetLocale,
        AddDataToJSONOnSubmit: AddDataToJSONOnSubmit,
        DropdownBind: DropdownBind,
        DropdownBindWithLable: DropdownBindWithLable,
        LoadAppTokens: LoadAppTokens,
        BindDataToControls: BindDataToControls,
        GetLocaleString: GetLocaleString,
        getAppTokensXML: getAppTokensXML,
        SetDynamicLocale: SetDynamicLocale,
        SortDataSurce: SortDataSurce
    }
}();