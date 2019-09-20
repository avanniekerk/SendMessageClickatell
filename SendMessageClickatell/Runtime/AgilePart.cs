using System;
using System.ComponentModel;
using Ascentn.Workflow.Base;
using System.Collections;

using System.IO;
using System.Net;

namespace SendMessageClickatell
{
    /// <summary>
    /// This class is AgilePart runtime class that will be invoked by AgilePoint Server.
    /// </summary>
    [AgilePart("Put name here")]
    public class MyAgilePart : WFAgilePart
    {
        [
        Description("Put description here"),
        AgilePartDescriptor(typeof(MyAgilePartDescriptor))
        ]
        public void SendMessageClickatell(
                            WFProcessInstance pi,
                            WFAutomaticWorkItem w,
                            IWFAPI api,
                            NameValue[] parameters)
        {
            try
            {
                Hashtable ht = ToHashtable(parameters);

                #region SetBasicSampleProperties

                string APIKey = ht["txttextbox1"] as string;
                string NumberTo = ht["txttextbox2"] as string;
                string Message = ht["txttextbox3"] as string;
                string OutputVariableNameResponse = ht["txttextbox4"] as string;
                string OutputVariableNameMessageID = ht["txttextbox5"] as string;
                #endregion

                #region send message
                try
                {
                    var httpWebRequest = (HttpWebRequest)WebRequest.Create("https://platform.clickatell.com/wa/messages");
                    httpWebRequest.ContentType = "application/json";
                    httpWebRequest.Accept = "application/json";
                    httpWebRequest.Headers.Add("Authorization", APIKey);
                    httpWebRequest.AuthenticationLevel = System.Net.Security.AuthenticationLevel.None;

                    httpWebRequest.Method = "POST";

                    string messageID = Guid.NewGuid().ToString();



					Logger.WriteLine( @Message );
					Message = Message.Replace( "\n", "\\n" );
					Logger.WriteLine( @Message );
					Message = Message.Replace( "/", "//" );
					Logger.WriteLine( @Message );

					using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                    {
                        string json = "{ \"messages\": [ { \"to\": \"" + NumberTo + "\",\"content\": \"" + @Message + "\",\"clientMessageId\": \"" + messageID + "\"}]}";

                        streamWriter.Write(json);
                        streamWriter.Flush();
                        streamWriter.Close();
                    }

                    var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
                    using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                    {
                        var result = streamReader.ReadToEnd();
                        api.SetCustomAttr(pi.WorkObjectID, OutputVariableNameResponse, result);
                    }

                    api.SetCustomAttr(pi.WorkObjectID, OutputVariableNameMessageID, messageID);

                }
                catch (WebException ex)
                {
                    Logger.WriteLine("||||||||||||||||||||||");
                    Logger.WriteLine("Exception");
                    Logger.WriteLine(ex.Message);
                    Logger.WriteLine("||||||||||||||||||||||");
                    api.SetCustomAttr(pi.WorkObjectID, OutputVariableNameResponse, ex.Message);

                    using (WebResponse response = ex.Response)
                    {
                        var httpResponse = (HttpWebResponse)response;

                        using (Stream data = response.GetResponseStream())
                        {
                            StreamReader sr = new StreamReader(data);

 
                            Logger.WriteLine(sr.ReadToEnd());
   

                            throw new Exception(sr.ReadToEnd());
                        }
                    }
                }

                #endregion

                
                if (w.Synchronous) MarkSuccess(api, pi, w, parameters);
            }
            catch (Exception ex)
            {
                Logger.WriteLine("||||||||||||||||||||||");
                Logger.WriteLine("Exception");
                Logger.WriteLine(ex.Message);
                Logger.WriteLine("||||||||||||||||||||||");
                 

                HandleException(api, pi, w, parameters, ex);
            }
        }



    }
}
