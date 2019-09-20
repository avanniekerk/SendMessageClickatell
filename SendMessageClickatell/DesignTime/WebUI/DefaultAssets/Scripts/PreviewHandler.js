//Authenticate the Agile Point User
var AuthenticateUser = function (domain, userName, password, callback) {
    if (domain && userName && password && Config.AgilePointServiceURL) {
        Config.AuthorizationDetails = "Basic " + Base64.encode(domain + "\\" + userName + ":" + password);

        $.ajax({
            url: Config.AgilePointServiceURL + "Admin/GetRegisterUser?appID=EM-Redesign&locale=en-US",
            headers: {
                "Authorization": Config.AuthorizationDetails,
                "Access-Control-Allow-Headers": "*"
            },
            type: 'POST',
            data: JSON.stringify({ userName: domain + '\\' + userName }),
            async: true,
            processData: false,
            contentType: "application/json",
            dataType: "json",
            success: function (data, status) {
                if (data) {
                    if (callback && typeof callback == "function") callback("success");
                    EnableDisableAuthorizationDetails(true);
                    $(".AuthDetailsControls").css({ "opacity": "1" }).attr("disabled", false);
                	alert("Connection success");
 }
            },
            error: function (xhr, status, error) {
                EnableDisableAuthorizationDetails(false);
                alert("Please make sure the provided 'Agilepoint Server URL' or 'Domain Name ' or 'User Name' or 'Password' is correct");
            }
        });
    }
};

//Enable or disable authentication controls.
var EnableDisableAuthorizationDetails = function (isEnable) {
    if (isEnable) {
        $("#txtAuthorization").val(Config.AuthorizationDetails);
        $(".AuthDetailsControls").css({ "opacity": ".6" }).attr("disabled", true);
    }
    else {
        Config.AuthorizationDetails = "";

        $("#txtAuthorization").text("");
        $(".AuthDetailsControls").css({ "opacity": "1" }).attr("disabled", false);
    }
}

//Load the Process Data Panel : Read from a predefined JSON and loads the value.
// Assets/SchemaJSON.json

//$.get("../Assets/SchemaJSON.json", function (response) {

var InitializeKendoTreeView = function (Id, FieldName, FieldValue, JSON) {
    if (!($("#" + Id).data("kendoTreeView"))) {
        $("#" + Id).kendoTreeView({
            dataTextField: FieldName,
            dataValueField: FieldValue,
            template: "<span title='#=item." + FieldValue + "#'>#=item." + FieldName + "#</span>",
            dragAndDrop: true,
            drag: function (e) {
                SetDropStatus(e);
            },
            drop: function (e) {
                HandleNodeDrop(e, Id);
                e.setValid(false);
                delete treeview;
            },
            dataSource: Object.keys(JSON).length == 0 ? [] : [JSON]
        });
    }
    else {
        $("#" + Id).data("kendoTreeView").setDataSource(Object.keys(JSON).length == 0 ? [] : [JSON]);
    }
};

$.get("../Assets/SchemaJSON.json", function (response) {
    //Process Data
    InitializeKendoTreeView("processVariablesTree", "name", "name", response[0]);

    //Form Data
    InitializeKendoTreeView("createTreeView", "name", "name", response[1]);

    //Datasources Panel
 //   InitializeKendoTreeView("dataSourceTreeView", "name", "name", response[2]);

    //System Data
  //  InitializeKendoTreeView("variablesTree", "text", "text", response[3]);

    //Global Variables panel
   // InitializeKendoTreeView("globalVariablesTree", "text", "text", response[4]);
});

//Create a formatted div element, when we drag the variable in the HTML DIV Element
var SetDropStatus = function (node) {
    var dropTarget = node.dropTarget;
    if ($(dropTarget).hasClass("dropTarget") || $(dropTarget).hasClass("textBox") || $(dropTarget).hasClass("noXpath") || $(dropTarget).hasClass("textBoxSP") || $(dropTarget).hasClass("xpath") || $(dropTarget).hasClass("append") || $(dropTarget).hasClass("RepeatedPathDB") || $(dropTarget).hasClass("treeNode")) {
        node.setStatusClass('k-add');
    }
    else if (($(dropTarget).hasClass("k-grid-content") || $(dropTarget).find(".k-grid-content").length == 1) && !($(dropTarget).hasClass("noDroppable"))) {
        node.setStatusClass('k-add');
    }
};

//Append the custom attribute in a Text area while drag and drop a X-Path from the data panel in the cursor position.
var InsertAtPosition = function (element, text) {
    if (document.selection) {
        element.focus();
        var sel = document.selection.createRange();
        sel.text = text;
        element.focus();
    }
    else if (element.selectionStart || element.selectionStart === 0) {
        var startPos = element.selectionStart;
        var endPos = element.selectionEnd;
        var scrollTop = element.scrollTop;
        element.value = element.value.substring(0, startPos) + text + element.value.substring(endPos, element.value.length);
        element.focus();
        element.selectionStart = startPos + text.length;
        element.selectionEnd = startPos + text.length;
        element.scrollTop = scrollTop;
    }
    else {
        element.value += text;
        element.focus();
    }
};

//Set customattribute on drag and drop of variable from the Tree View panel based on tree view type
var ManageNodeDrop = function (e, id) {
    var treeView = $("#" + id).data("kendoTreeView");
    var isFromModelData = false, isRepeatable = false;
    var sourceNode = e.sourceNode, dropTarget = e.dropTarget;
    var nodeText = "", nodeValue = "", nodeXpath = "", nodeType = "string", expression = "", sourceTreeRoot = "";
    var draggedData = treeView.dataItem(e.sourceNode);
    var ObjdropTarget = $(dropTarget);
    nodeText = draggedData.name || draggedData.text;
    nodeValue = draggedData.xPath || draggedData.text;

    DragDropInputElement = function () {
        var appendText = "";
        var targetValue = ObjdropTarget.val();
        switch (true) {
            case ObjdropTarget.hasClass("nonCustomXpath"):
                appendText = nodeValue;
                break;
            case ObjdropTarget.hasClass("xpath"):
            case !ObjdropTarget.hasClass("RepeatedPathDB"):
                appendText = nodeXpath;
                break;
            default: appendText = "$" + nodeText;
        }
        switch (true) {
            case ObjdropTarget.hasClass("repeating"):
                if (isRepeatable) {
                    var targetID = ObjdropTarget.attr("id")
                    if (targetID == "txtRepeatingXpathTable" || targetID == "txtRepeatingXpathSP" || targetID == "txtFieldGroup") {
                        repeatingParentNode = nodeText;
                        $("#hiddenRepeating").val(nodeText);
                    }
                    ObjdropTarget.val(appendText);
                    ObjdropTarget.blur();
                }
                break;
            case ObjdropTarget.hasClass("append"):
                ObjdropTarget.val(targetValue + appendText);
                ObjdropTarget.blur();
                break;
            case ObjdropTarget.hasClass("multiple"):
                ObjdropTarget.val(targetValue + appendText + ',');
                ObjdropTarget.blur();
                break;
            case ObjdropTarget.hasClass("multipleSemiColon"):
                ObjdropTarget.val(targetValue + appendText + ';');
                ObjdropTarget.blur();
                break;
            case ObjdropTarget.hasClass("SPtextArea"):
                if (nodeType == "string") {
                    ObjdropTarget.val(targetValue + "'" + appendText + "'");
                }
                else {
                    ObjdropTarget.val(targetValue + appendText);
                }
                ObjdropTarget.blur();
                break;
            case ObjdropTarget.hasClass("getDataType"):
                ObjdropTarget.attr("dataType", nodeType);
                ObjdropTarget.val(appendText);
                ObjdropTarget.blur();
                break;
            default:
                ObjdropTarget.val(appendText);
                ObjdropTarget.blur();
        }
    };

    switch (id) {
        case "createTreeView":
            isFromModelData = true;
            sourceTreeRoot = "FormData";
            break;
        case "processVariablesTree":
            isFromModelData = true;
            sourceTreeRoot = "ModelData"
            expression = treeView.dataItem(e.sourceNode).Expression;
            expression = expression == undefined ? "" : expression.replace(/"/g, 'dquote');

            break;
        case "dataSourceTreeView":
            isFromModelData = false;
            expression = treeView.dataItem(e.sourceNode).Expression;
            expression = expression == undefined ? "" : expression.replace(/"/g, 'dquote');
            sourceTreeRoot = "DataSource"
            break;
        case "variablesTree":
        case "globalVariablesTree":
            sourceTreeRoot = "SystemData";
            break;
    }

    if (draggedData.minOccurs == "0") isRepeatable = true;
    nodeXpath = "${" + nodeValue + "}";
    if (draggedData.typeAttr) nodeType = draggedData.typeAttr;

    if (ObjdropTarget.hasClass("dropTarget")) {
        if (dropTarget.tagName == "INPUT" || dropTarget.tagName == "TEXTAREA") {
            var targetValue = ObjdropTarget.val();
            switch (true) {
                case ObjdropTarget.hasClass("currentPosition"):
                    InsertAtPosition(dropTarget, nodeXpath);
                    break;
                case ObjdropTarget.hasClass("append"):
                    ObjdropTarget.val(targetValue + nodeXpath);
                    break;
                case ObjdropTarget.hasClass("multiple"):
                    ObjdropTarget.val(targetValue + nodeXpath + ',');
                    break;
                case ObjdropTarget.hasClass("multipleSemiColon"):
                    ObjdropTarget.val(targetValue + nodeXpath + ';');
                    break;
                default: ObjdropTarget.val(nodeXpath);
            }
        }
    }

    switch (true) {
        case ObjdropTarget.hasClass("treeNode"):
            DragDropInputElement();
            break;
        case ObjdropTarget.hasClass("noXpath"):
            ObjdropTarget.val(nodeText);
            ObjdropTarget.blur();
            break;
        case ObjdropTarget.hasClass("textBox"):
            var spanTitle = nodeXpath;
            if (ObjdropTarget.hasClass("xpath")) spanTitle = nodeValue;
            var spanHtml = '<span DataType="' + nodeType + '" repeatable="' + isRepeatable + '" FromModelData="' + isFromModelData + '" FromData="' + sourceTreeRoot + '" treeViewID="' + id + '" sourceNode="' + $(sourceNode).attr('id') + '" class="k-textbox k-button k-space-right tagSpan" contenteditable="false" title="' + spanTitle + '" >' + nodeText + '<a id="deletebox" onClick="' + pageNamespace + '.Remove(this)" class="k-icon k-delete"></a></span>';
            if (ObjdropTarget.hasClass("replace")) ObjdropTarget.html("");
            ObjdropTarget.append(spanHtml);
            ObjdropTarget.attr("contentEditable", false);
            ObjdropTarget.blur()
            break;
        case ObjdropTarget.hasClass("textBoxSP"):
            var spanHtml = "";
            var spanTitle = nodeXpath;

            if ((id == "createTreeView") && (nodeType == "string")) {
                spanTitle = "'" + nodeXpath + "'";
            }
            else if (id == "processVariablesTree" || id == "dataSourceTreeView") {
                spanTitle = "${" + nodeText + "}";
            }
            spanHtml = '<span FromModelData="' + isFromModelData + '" treeViewID="' + id + '" sourceNode="' + $(sourceNode).attr('id') + '" class="k-textbox k-button k-space-right tagSpan" contenteditable="false" title="' + spanTitle + '" >' + nodeText + '<a id="deletebox" onClick="' + pageNamespace + '.Remove(this)" class="k-icon k-delete"></a></span>';
            if (ObjdropTarget.hasClass("replace")) ObjdropTarget.html("");
            ObjdropTarget.append(spanHtml);
            ObjdropTarget.attr("contentEditable", false);
            ObjdropTarget.blur();
            break;
        case ObjdropTarget.hasClass("DIV"):
            var targetId = "";
            if (ObjdropTarget.hasClass("k-grid")) targetId = dropTarget.id;
            else {
                targetId = ObjdropTarget.parents("div.k-grid[data-role='grid']")[0].id;
            }
            var dataSource = $("#" + targetId).data("kendoGrid").dataSource, isDuplicate = false;
            var userSrc = "../DefaultAssets/Images/UsersU.png", roleSrc = "../DefaultAssets/Images/RolesS.png", groupSrc = "../DefaultAssets/Images/GroupsS.png";

            $(dataSource.data()).each(function (index, data) {
                if (data.Title.toLowerCase() == nodeXpath.toLowerCase()) {
                    isDuplicate = true;
                    return;
                }
            });

            if (!isDuplicate) {
                eval("" + pageNamespace + "").columncount++;
                if (id == "variablesTree" && nodeText.toLowerCase() == "processinitiator") {
                    userSrc = "../DefaultAssets/Images/UsersU.png";
                    roleSrc = "../DefaultAssets/Images/UsersR.png";
                    groupSrc = "../DefaultAssets/Images/UsersG.png";
                }
                null == document.getElementById(treeView.text(sourceNode)) && dataSource.add({
                    Title: nodeXpath,
                    Details: nodeText,
                    Domain: nodeXpath,
                    DataType: nodeType == undefined ? "${}" : "${" + nodeType + "}",
                    ImageURL: "../DefaultAssets/Images/Variable.png",
                    columncount: eval("" + pageNamespace + "").columncount,
                    UserURL: userSrc,
                    RoleURL: roleSrc,
                    GroupURL: groupSrc,
                    fromModelData: isFromModelData,
                    type: "2",
                    Expression: expression == undefined ? "Enter Value/Expression" : expression,
                })
            }
            break;
    }


};

//Validate drag drop for a control
var HandleNodeDrop = function (node, id) {
    var dropTarget = $(node.dropTarget);
    if (dropTarget.hasClass("textBox") || dropTarget.hasClass("dropTarget") || dropTarget.hasClass("treeNode") || dropTarget.hasClass("noXpath") || dropTarget.hasClass("textBoxSP")) {
        ManageNodeDrop(node, id);
    }
    else if ((dropTarget.hasClass("k-grid-content") || (dropTarget.hasClass("k-grid"))) && !(dropTarget.hasClass("noDroppable"))) {
        ManageNodeDrop(node, id);
    }
    node.setValid(false);
    delete treeview;
};

//API call to get Global Data & System Data.
var LoadProcessData = function () {
       var deferred = jQuery.Deferred();
    if (Config.AgilePointServiceURL) {
        var url = Config.AgilePointServiceURL + Config.getCustomAttributes;
        APIObject = { url: url, methodType: 'GET', contentType: "application/x-www-form-urlencoded" };
        APIHandler.apiCall(APIObject, function (response) {
            var parser = new DOMParser();
            var systemVariablesRoot = parser.parseFromString(eval(response).GetCustomAttrsByIDResult, "text/xml").childNodes[0];
            var globalData = [{ text: "Global Data", name: "Global Data", value: "Global Data", expanded: true, imageUrl: "../DefaultAssets/Images/Others/schema.png", items: [] }];
            if (systemVariablesRoot.childNodes) {
                $(systemVariablesRoot.childNodes).each(function (index, data) {
                    var name = data.getElementsByTagName('Name')[0].textContent;
                    var value = data.getElementsByTagName('Value')[0].textContent;
                    var item = { text: name, name: name, value: value, imageUrl: "../DefaultAssets/Images/Others/element.png" }
                    globalData[0].items.push(item);
                });
            };
            InitializeKendoTreeView("globalVariablesTree", "text", "text", globalData[0]);
            //deferred.resolve();
        });
        var ServiceURL = Config.AgilePointServiceURL + Config.getEnumValues;
        var jsonParameters = {
            url: ServiceURL, methodType: "POST", data: JSON.stringify({
                "enumName": "ProcessDesignerSystemToken",
                "localize": true
            })
        };
 
        APIHandler.apiCall(jsonParameters, function (response) {
            var systemDataVariables = response || [];
            var systemData = [{ text: "System Data", name: "System Data", value: "System Data", expanded: true, imageUrl: "../DefaultAssets/Images/Others/schema.png", items: [] }];
            if (systemDataVariables) {
                $(systemDataVariables).each(function (index, data) {
                    var name = data.Name;
                    var value = data.Value;
                    var item = { text: name, name: name, value: value, imageUrl: "../DefaultAssets/Images/Others/element.png" }
                    systemData[0].items.push(item);
                });
                InitializeKendoTreeView("variablesTree", "text", "text", systemData[0]);               
            }
            deferred.resolve("");
        });
    }
    else {
        systemVariablesRoot = "";
        deferred.resolve("");
    }
    return deferred.promise();
}

//Authenticate the Agile Point User
 
var AuthenticateUser = function (domain, userName, password, callback) {
    if (domain && userName && password && Config.AgilePointServiceURL) {
        Config.AuthorizationDetails = "Basic " + Base64.encode(domain + "\\" + userName + ":" + password);
 
        $.ajax({
            url: Config.AgilePointServiceURL + "Admin/GetRegisterUser?appID=EM-Redesign&locale=en-US",
            headers: {
                "Authorization": Config.AuthorizationDetails,
                "Access-Control-Allow-Headers": "*"
            },
            type: 'POST',
            data: JSON.stringify({ userName: domain + '\\' + userName }),
            async: true,
            processData: false,
            contentType: "application/json",
            dataType: "json",
            success: function (data, status) {
                if (data) {
                    if (callback && typeof callback == "function") callback("success");
                    EnableDisableAuthorizationDetails(true);
                }
            },
            error: function (xhr, status, error) {
                EnableDisableAuthorizationDetails(false);
                alert("Please make sure the provided 'Agilepoint Server URL' or 'Domain Name ' or 'User Name' or 'Password' is correct");
            }
        });
    }
};
 
//Enable or disable authentication controls.
var EnableDisableAuthorizationDetails = function (isEnable) {
    if (isEnable) {
        $("#txtAuthorization").val(Config.AuthorizationDetails);
        $(".AuthDetailsControls").css({ "opacity": ".6" }).attr("disabled", true);
    }
    else {
        Config.AuthorizationDetails = "";
 
        $("#txtAuthorization").text("");
        $(".AuthDetailsControls").css({ "opacity": "1" }).attr("disabled", false);
    }
}
 
//Load the Process Data Panel : Read from a predefined JSON and loads the value.
 
$.get("../Assets/SchemaJSON.json", function (response) {
 
    var InitializeKendoTreeView = function (Id, FieldName, FieldValue, JSON) {
 
        $("#" + Id).kendoTreeView({
            dataTextField: FieldName,
            dataValueField: FieldValue,
            template: "<span title='#=item." + FieldValue + "#'>#=item." + FieldName + "#</span>",
            dragAndDrop: true,
            drag: function (e) {
                SetDropStatus(e);
            },
            drop: function (e) {
                HandleNodeDrop(e, Id);
                e.setValid(false);
                delete treeview;
            },
            dataSource: Object.keys(response[0]).length == 0 ? [] : [JSON]
        });
 
 
 
 
 
    };
 
 
 
    //Process Data
    InitializeKendoTreeView("processVariablesTree", "name", "name", response[0]);
 
    //Form Data
    InitializeKendoTreeView("createTreeView", "name", "name", response[1]);
 
    //Datasources Panel
    InitializeKendoTreeView("dataSourceTreeView", "name", "name", response[2]);
 
    //System Data
    InitializeKendoTreeView("variablesTree", "text", "text", response[3]);
 
    //Global Variables panel
    InitializeKendoTreeView("globalVariablesTree", "text", "text", response[4]);
});
 
//Create a formatted div element, when we drag the variable in the HTML DIV Element
var SetDropStatus = function (node) {
    var dropTarget = node.dropTarget;
    if ($(dropTarget).hasClass("dropTarget") || $(dropTarget).hasClass("textBox") || $(dropTarget).hasClass("noXpath") || $(dropTarget).hasClass("textBoxSP") || $(dropTarget).hasClass("xpath") || $(dropTarget).hasClass("append") || $(dropTarget).hasClass("RepeatedPathDB") || $(dropTarget).hasClass("treeNode")) {
        node.setStatusClass('k-add');
    }
    else if (($(dropTarget).hasClass("k-grid-content") || $(dropTarget).find(".k-grid-content").length == 1) && !($(dropTarget).hasClass("noDroppable"))) {
        node.setStatusClass('k-add');
    }
};
 
//Append the custom attribute in a Text area while drag and drop a X-Path from the data panel in the cursor position.
var InsertAtPosition = function (element, text) {
    if (document.selection) {
        element.focus();
        var sel = document.selection.createRange();
        sel.text = text;
        element.focus();
    }
    else if (element.selectionStart || element.selectionStart === 0) {
        var startPos = element.selectionStart;
        var endPos = element.selectionEnd;
        var scrollTop = element.scrollTop;
        element.value = element.value.substring(0, startPos) + text + element.value.substring(endPos, element.value.length);
        element.focus();
        element.selectionStart = startPos + text.length;
        element.selectionEnd = startPos + text.length;
        element.scrollTop = scrollTop;
    }
    else {
        element.value += text;
        element.focus();
    }
};
 
//Set customattribute on drag and drop of variable from the Tree View panel based on tree view type
var ManageNodeDrop = function (e, id) {
    var treeView = $("#" + id).data("kendoTreeView");
    var isFromModelData = false, isRepeatable = false;
    var sourceNode = e.sourceNode, dropTarget = e.dropTarget;
    var nodeText = "", nodeValue = "", nodeXpath = "", nodeType = "string", expression = "", sourceTreeRoot = "";
    var draggedData = treeView.dataItem(e.sourceNode);
    var ObjdropTarget = $(dropTarget);
    nodeText = draggedData.name || draggedData.text;
    nodeValue = draggedData.xPath || draggedData.text;
 
    DragDropInputElement = function () {
        var appendText = "";
        var targetValue = ObjdropTarget.val();
        switch (true) {
            case ObjdropTarget.hasClass("nonCustomXpath"):
                appendText = nodeValue;
                break;
            case ObjdropTarget.hasClass("xpath"):
            case !ObjdropTarget.hasClass("RepeatedPathDB"):
                appendText = nodeXpath;
                break;
            default: appendText = "$" + nodeText;
        }
        switch (true) {
            case ObjdropTarget.hasClass("repeating"):
                if (isRepeatable) {
                    var targetID = ObjdropTarget.attr("id")
                    if (targetID == "txtRepeatingXpathTable" || targetID == "txtRepeatingXpathSP" || targetID == "txtFieldGroup") {
                        repeatingParentNode = nodeText;
                        $("#hiddenRepeating").val(nodeText);
                    }
                    ObjdropTarget.val(appendText);
                    ObjdropTarget.blur();
                }
                break;
            case ObjdropTarget.hasClass("append"):
                ObjdropTarget.val(targetValue + appendText);
                ObjdropTarget.blur();
                break;
            case ObjdropTarget.hasClass("multiple"):
                ObjdropTarget.val(targetValue + appendText + ',');
                ObjdropTarget.blur();
                break;
            case ObjdropTarget.hasClass("multipleSemiColon"):
                ObjdropTarget.val(targetValue + appendText + ';');
                ObjdropTarget.blur();
                break;
            case ObjdropTarget.hasClass("SPtextArea"):
                if (nodeType == "string") {
                    ObjdropTarget.val(targetValue + "'" + appendText + "'");
                }
                else {
                    ObjdropTarget.val(targetValue + appendText);
                }
                ObjdropTarget.blur();
                break;
            case ObjdropTarget.hasClass("getDataType"):
                ObjdropTarget.attr("dataType", nodeType);
                ObjdropTarget.val(appendText);
                ObjdropTarget.blur();
                break;
            default:
                ObjdropTarget.val(appendText);
                ObjdropTarget.blur();
        }
    };
 
    switch (id) {
        case "createTreeView":
            isFromModelData = true;
            sourceTreeRoot = "FormData";
            break;
        case "processVariablesTree":
            isFromModelData = true;
            sourceTreeRoot = "ModelData"
            expression = treeView.dataItem(e.sourceNode).Expression;
            expression = expression == undefined ? "" : expression.replace(/"/g, 'dquote');
 
            break;
        case "dataSourceTreeView":
            isFromModelData = false;
            expression = treeView.dataItem(e.sourceNode).Expression;
            expression = expression == undefined ? "" : expression.replace(/"/g, 'dquote');
            sourceTreeRoot = "DataSource"
            break;
        case "variablesTree":
        case "globalVariablesTree":
            sourceTreeRoot = "SystemData";
            break;
    }
 
    if (draggedData.minOccurs == "0") isRepeatable = true;
    nodeXpath = "${" + nodeValue + "}";
    if (draggedData.typeAttr) nodeType = draggedData.typeAttr;
 
    if (ObjdropTarget.hasClass("dropTarget")) {
        if (dropTarget.tagName == "INPUT" || dropTarget.tagName == "TEXTAREA") {
            var targetValue = ObjdropTarget.val();
            switch (true) {
                case ObjdropTarget.hasClass("currentPosition"):
                    InsertAtPosition(dropTarget, nodeXpath);
                    break;
                case ObjdropTarget.hasClass("append"):
                    ObjdropTarget.val(targetValue + nodeXpath);
                    break;
                case ObjdropTarget.hasClass("multiple"):
                    ObjdropTarget.val(targetValue + nodeXpath + ',');
                    break;
                case ObjdropTarget.hasClass("multipleSemiColon"):
                    ObjdropTarget.val(targetValue + nodeXpath + ';');
                    break;
                default: ObjdropTarget.val(nodeXpath);
            }
        }
    }
 
    switch (true) {
        case ObjdropTarget.hasClass("treeNode"):
            DragDropInputElement();
            break;
        case ObjdropTarget.hasClass("noXpath"):
            ObjdropTarget.val(nodeText);
            ObjdropTarget.blur();
            break;
        case ObjdropTarget.hasClass("textBox"):
            var spanTitle = nodeXpath;
            if (ObjdropTarget.hasClass("xpath")) spanTitle = nodeValue;
            var spanHtml = '<span DataType="' + nodeType + '" repeatable="' + isRepeatable + '" FromModelData="' + isFromModelData + '" FromData="' + sourceTreeRoot + '" treeViewID="' + id + '" sourceNode="' + $(sourceNode).attr('id') + '" class="k-textbox k-button k-space-right tagSpan" contenteditable="false" title="' + spanTitle + '" >' + nodeText + '<a id="deletebox" onClick="' + pageNamespace + '.Remove(this)" class="k-icon k-delete"></a></span>';
            if (ObjdropTarget.hasClass("replace")) ObjdropTarget.html("");
            ObjdropTarget.append(spanHtml);
            ObjdropTarget.attr("contentEditable", false);
            ObjdropTarget.blur()
            break;
        case ObjdropTarget.hasClass("textBoxSP"):
            var spanHtml = "";
            var spanTitle = nodeXpath;
 
            if ((id == "createTreeView") && (nodeType == "string")) {
                spanTitle = "'" + nodeXpath + "'";
            }
            else if (id == "processVariablesTree" || id == "dataSourceTreeView") {
                spanTitle = "${" + nodeText + "}";
            }
            spanHtml = '<span FromModelData="' + isFromModelData + '" treeViewID="' + id + '" sourceNode="' + $(sourceNode).attr('id') + '" class="k-textbox k-button k-space-right tagSpan" contenteditable="false" title="' + spanTitle + '" >' + nodeText + '<a id="deletebox" onClick="' + pageNamespace + '.Remove(this)" class="k-icon k-delete"></a></span>';
            if (ObjdropTarget.hasClass("replace")) ObjdropTarget.html("");
            ObjdropTarget.append(spanHtml);
            ObjdropTarget.attr("contentEditable", false);
            ObjdropTarget.blur();
            break;
        case ObjdropTarget.hasClass("DIV"):
            var targetId = "";
            if (ObjdropTarget.hasClass("k-grid")) targetId = dropTarget.id;
            else {
                targetId = ObjdropTarget.parents("div.k-grid[data-role='grid']")[0].id;
            }
            var dataSource = $("#" + targetId).data("kendoGrid").dataSource, isDuplicate = false;
            var userSrc = "../DefaultAssets/Images/UsersU.png", roleSrc = "../DefaultAssets/Images/RolesS.png", groupSrc = "../DefaultAssets/Images/GroupsS.png";
 
            $(dataSource.data()).each(function (index, data) {
                if (data.Title.toLowerCase() == nodeXpath.toLowerCase()) {
                    isDuplicate = true;
                    return;
                }
            });
 
            if (!isDuplicate) {
                eval("" + pageNamespace + "").columncount++;
                if (id == "variablesTree" && nodeText.toLowerCase() == "processinitiator") {
                    userSrc = "../DefaultAssets/Images/UsersU.png";
                    roleSrc = "../DefaultAssets/Images/UsersR.png";
                    groupSrc = "../DefaultAssets/Images/UsersG.png";
                }
                null == document.getElementById(treeView.text(sourceNode)) && dataSource.add({
                    Title: nodeXpath,
                    Details: nodeText,
                    Domain: nodeXpath,
                    DataType: nodeType == undefined ? "${}" : "${" + nodeType + "}",
                    ImageURL: "../DefaultAssets/Images/Variable.png",
                    columncount: eval("" + pageNamespace + "").columncount,
                    UserURL: userSrc,
                    RoleURL: roleSrc,
                    GroupURL: groupSrc,
                    fromModelData: isFromModelData,
                    type: "2",
                    Expression: expression == undefined ? "Enter Value/Expression" : expression,
                })
            }
            break;
    }
 
    
};
 
//Validate drag drop for a control
var HandleNodeDrop = function (node, id) {
    var dropTarget = $(node.dropTarget);
    if (dropTarget.hasClass("textBox") || dropTarget.hasClass("dropTarget") || dropTarget.hasClass("treeNode") || dropTarget.hasClass("noXpath") || dropTarget.hasClass("textBoxSP")) {
        ManageNodeDrop(node, id);
    }
    else if ((dropTarget.hasClass("k-grid-content") || (dropTarget.hasClass("k-grid"))) && !(dropTarget.hasClass("noDroppable"))) {
        ManageNodeDrop(node, id);
    }
    node.setValid(false);
    delete treeview;
};