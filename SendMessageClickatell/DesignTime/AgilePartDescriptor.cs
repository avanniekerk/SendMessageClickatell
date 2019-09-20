using System;
using System.ComponentModel;
using Ascentn.Workflow.Base;
using System.Collections;
using System.Collections.Generic;

namespace SendMessageClickatell
{

    public class MyAgilePartDescriptor : WFAgilePartDescriptor
    {
        #region Constructor

        public MyAgilePartDescriptor()
        {
            base.Synchronous = true;
            InitializeShapeProperties();
        }
        #endregion

        #region [ Exposed Properties ]

        #region BasicSamplePropertys

        /// <summary>
        /// Textnox API Key
        /// </summary>
        [
        Category("Custom Property"),
        Description("API Key")
        ]
        public string TxtTextBox1
        {
            get
            {
                object obj = base["txttextbox1"];
                if (obj == null) obj = string.Empty;
                return (string)obj;
            }
            set
            {
                base["txttextbox1"] = value;
            }
        }

        /// <summary>
        /// Textnox number to
        /// </summary>
        [
        Category("Custom Property"),
        Description("Phone Number to send to")
        ]
        public string TxtTextBox2
        {
            get
            {
                object obj = base["txttextbox2"];
                if (obj == null) obj = string.Empty;
                return (string)obj;
            }
            set
            {
                base["txttextbox2"] = value;
            }
        }

        /// <summary>
        /// Textnox Message
        /// </summary>
        [
        Category("Custom Property"),
        Description("Message")
        ]
        public string TxtTextBox3
        {
            get
            {
                object obj = base["txttextbox3"];
                if (obj == null) obj = string.Empty;
                return (string)obj;
            }
            set
            {
                base["txttextbox3"] = value;
            }
        }

        /// <summary>
        /// Output Variable Name
        /// </summary>
        [
        Category("Custom Property"),
        Description("Output Variable Name")
        ]
        public string TxtTextBox4
        {
            get
            {
                object obj = base["txttextbox4"];
                if (obj == null) obj = string.Empty;
                return (string)obj;
            }
            set
            {
                base["txttextbox4"] = value;
            }
        }

        /// <summary>
        /// Output Variable Name
        /// </summary>
        [
        Category("Custom Property"),
        Description("Output Variable Name")
        ]
        public string TxtTextBox5
        {
            get
            {
                object obj = base["txttextbox5"];
                if (obj == null) obj = string.Empty;
                return (string)obj;
            }
            set
            {
                base["txttextbox5"] = value;
            }
        }

        #endregion


        #endregion

        #region [ Validation methods ]

        public override void Validate()
        {
            // DO NOT REMOVE base.
            base.Validate();

            // put validation code here, throw exception if invalid
        }
        #endregion

        #region [ Initialize Shape Properties]

         

        public void SetBasicSampleProperties()
        {
            WFActivityMasterProperties textboxproperty1 = new WFActivityMasterProperties
            {
                Browsable = true,
                Id = "txttextbox1"
            };
            AddActivityProperties(textboxproperty1);

            WFActivityMasterProperties textboxproperty2 = new WFActivityMasterProperties
            {
                Browsable = true,
                Id = "txttextbox2"
            };
            AddActivityProperties(textboxproperty2);

            WFActivityMasterProperties textboxproperty3 = new WFActivityMasterProperties
            {
                Browsable = true,
                Id = "txttextbox3"
            };
            AddActivityProperties(textboxproperty3);

            WFActivityMasterProperties textboxproperty4 = new WFActivityMasterProperties
            {
                Browsable = true,
                Id = "txttextbox4"
            };
            AddActivityProperties(textboxproperty4);

            WFActivityMasterProperties textboxproperty5 = new WFActivityMasterProperties
            {
                Browsable = true,
                Id = "txttextbox5"
            };
            AddActivityProperties(textboxproperty5);
        }

        public void InitializeShapeProperties()
        {
            #region ShapeProperties Initialization

            //For BasicSample
            SetBasicSampleProperties();

            //For AdvanceSample
            // SetAdvanceSampleProperties();

            #endregion

            #region Activity Tab Initialization

            WFActivityTabProperties mytab1 = new WFActivityTabProperties()
            {

                ActiveIcon = "CustomAssets/Resources/Images/WizardPagination/AgilePartH.png",
                Icon = "CustomAssets/Resources/Images/WizardPagination/AgilePartN.png",
                Name = "My AgilePart Configuration",
                WebId = "B3BB802BF9C21AD0119959F6D71BEC3E",
                Type = WFAgileTabType.Default

            };
            InsertActivityTabAt(1, mytab1);

            #endregion
        }

        #endregion
    }
}
