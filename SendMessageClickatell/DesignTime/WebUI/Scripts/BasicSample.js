BasicSample = function () {
    var JSON = { Data: { Properties: [] } };
    var emptyList = [];
    var $dtDatetime = $("#dtDatetime");

    var droppableTextBoxId = ["txtHTMLDivElement"], droppableTextBoxProperties = ["htmldivelementproperty"];
    var dataSource = [{ Name: "Option 1", Value: "Option1" }, { Name: "Option 2", Value: "Option2" }];

    //Binding the dropdown with inline datasource
    Utility.DropdownBindWithLable("#ddDropdownInline", dataSource, "Name", "Value");

    //Binding a dropdown with a empty list
    Utility.DropdownBindWithLable("#ddDropdownDataBind", emptyList, "Name", "Value");

    //Setting a current datetime to the date picker control
    var dateTimePicker = $dtDatetime.kendoDateTimePicker({ value: new Date() }).data("kendoDateTimePicker");
    $("#dtDatetime").attr("readonly", true);

    //TODO : This method is called when the page is loading. All the control initilization and localization are handled here.     
    function LoadFunctions() {
        LoadAccessToken();
        Utility.SetLocale();

        $(".DivPlaceHolder").attr("data-placeholder", Utility.GetLocaleString("DataPlaceHolder"));
    };

    //Example 1: Load the Access token 
    var LoadAccessToken = function () {
        Utility.LoadAppTokens(Config.sharePointType).done(function (response) {
            Utility.DropdownBindWithLable("#ddDropdownDataBind", response, "Name", "Value");
        });
    };

    //Example 2: Validate Textbox Control
    var ValidateTextBox = function (controlId, errorControlId, ControlName) {
        var controlType = "textbox", errorMsg = "";

        errorMsg = Utility.GetLocaleString("TextBoxNullExceptionPrefix") + Utility.GetLocaleString(ControlName);
        if (!Validate.ValidateIsNullOrEmpty(controlId, errorControlId, controlType, errorMsg)) {
            return false;
        };
        return true;
    };

    //Example 3: Validate HTML Div Element
    var ValidateCustAttr = function (controlId, errorControlId, ControlName) {
        var controlType = "customattribute", errorMsg = "";
        errorMsg = Utility.GetLocaleString("TextBoxNullExceptionPrefix") + Utility.GetLocaleString(ControlName);
        if (!Validate.ValidateIsNullOrEmpty(controlId, errorControlId, controlType, errorMsg)) {
            return false;
        };
        return true;
    };

    //Onload Method
    function OnLoad(JSON) {
        Utility.BindDataToControls(JSON);

        JSON.Data.Properties.forEach(function (pair) {
            (pair.Name == "dtdatetime") && ($dtDatetime.data("kendoDateTimePicker").value(pair.Value));
            if (droppableTextBoxId.indexOf(pair.Name) !== -1) {
                var id = pair.Name
                var textBoxContents = pair.Value.split(";");
                var value = textBoxContents[0];
                var title = textBoxContents[1];
                var color = textBoxContents[2];
                $("#" + id).html("");

                if (value == "") {
                }
                else {
                    $("#" + id).text("");
                    $("#" + id).append('<span class="k-textbox k-button k-space-right tagSpan" contenteditable="false" title="' + title + '" >' + value + '<a id="deletebox" onClick="BasicSample.Remove(this)" class="k-icon k-delete"></a></span>')
                    $("#" + id).attr("contentEditable", false);
                }
            }
        });
    };

    //Method used for calling all the validate functions before submiting.
   //This would return true if all the validations are passed.
    function OnValidate() {
        $('.k-invalid-msg').css('display', 'none');
        var validflag = true;

        validflag = validflag ? ValidateTextBox("txtTextBox1", "errorTextBox1", "TextBox1") : false;
        validflag = validflag ? ValidateTextBox("txtTextBox2", "errorTextBox2", "TextBox2") : false;
        validflag = validflag ? ValidateTextBox("txtTextBox3", "errorTextBox3", "TextBox3") : false;
        validflag = validflag ? ValidateTextBox("txtTextBox4", "errorTextBox4", "TextBox4") : false;
        validflag = validflag ? ValidateTextBox("txtTextBox5", "errorTextBox5", "TextBox5") : false;
        return validflag;
    };

    //TODO
    //This method would be called when you click on 'Finish' or 'Next' button click of the configuration dialogue.
    //Assign values to the custom AgilePart dll properties for runtime.
    function OnSubmit() {
        JSON = { Data: { Properties: [] } };

        //Textbox
        var TextBoxValue1 = $("#txtTextBox1").val();
        Utility.AddDataToJSONOnSubmit(JSON, "txttextbox1", TextBoxValue1);
        Utility.AddDataToJSONOnSubmit(JSON, "txtTextBox1", TextBoxValue1);
        //Textbox
        var TextBoxValue2 = $("#txtTextBox2").val();
        Utility.AddDataToJSONOnSubmit(JSON, "txttextbox2", TextBoxValue2);
        Utility.AddDataToJSONOnSubmit(JSON, "txtTextBox2", TextBoxValue2);
        //Textbox
        var TextBoxValue3 = $("#txtTextBox3").val();
        Utility.AddDataToJSONOnSubmit(JSON, "txttextbox3", TextBoxValue3);
        Utility.AddDataToJSONOnSubmit(JSON, "txtTextBox3", TextBoxValue3);
        //Textbox
        var TextBoxValue4 = $("#txtTextBox4").val();
        Utility.AddDataToJSONOnSubmit(JSON, "txttextbox4", TextBoxValue4);
        Utility.AddDataToJSONOnSubmit(JSON, "txtTextBox4", TextBoxValue4);
        //Textbox
        var TextBoxValue5 = $("#txtTextBox5").val();
        Utility.AddDataToJSONOnSubmit(JSON, "txttextbox5", TextBoxValue5);
        Utility.AddDataToJSONOnSubmit(JSON, "txtTextBox5", TextBoxValue5);


        //HTML Div Element
        for (var i = 0; i < droppableTextBoxId.length; i++) {
            var id = droppableTextBoxId[i];
            var property = droppableTextBoxProperties[i];
            var nodeText;
            var nodeValue;
            var spanColor;

            if ($($("#" + id).children()).length == 1) {
                nodeText = $($("#" + id).children()[0]).text();
                nodeValue = $($("#" + id).children()[0]).attr('title');
                spanColor = $($("#" + id).children()[0]).css("background-color");
            }
            else {
                nodeText = "";
                nodeValue = "";
                spanColor = "";
            }
            Utility.AddDataToJSONOnSubmit(JSON, id, nodeText + ";" + nodeValue + ";" + spanColor);
            Utility.AddDataToJSONOnSubmit(JSON, property, nodeValue);
        }

          
        return JSON;
    };

    //TODO
    //Method to create span on 'blur' of 'div element'.
    $('.textBox').blur(function (e) {
        if (!(this.children.length !== 0 && this.children[0].tagName == "SPAN")) {
            if ((this.textContent.trim() == "") || (this.innerHTML == "<br>")) {
                this.innerHTML = "";
                this.setAttribute("contentEditable", true);
            }
            else {
                var appendText = '<span class="k-textbox k-button k-space-right tagSpan" contenteditable="false" title="' + this.textContent + '" style="width:auto;">' + this.textContent + '<a id="deletebox" onClick="BasicSample.Remove(this)" class="k-icon k-delete"></a></span>';
                this.innerHTML = "";
                $(this).append(appendText);
            }
        }

        if (this.children.length !== 0 && this.children[0].tagName == "SPAN") {
            $(".k-invalid-msg").css("display", "none");
            this.setAttribute("contentEditable", false);
        }
    });

    //Remove custom attribute span from div element //TODO
    function Remove(obj) {
        var id = $(obj).closest("div").attr("id");
        $('#' + id).attr("contentEditable", !$('#' + id).hasClass("customAttr"));
        $('#' + id).text("");
        $(obj).closest('span').remove();
    };

    LoadFunctions();

    return {
        OnLoad: OnLoad,
        OnSubmit: OnSubmit,
        LoadFunctions: LoadFunctions,
        OnValidate: OnValidate,
        Remove: Remove
    }
}();