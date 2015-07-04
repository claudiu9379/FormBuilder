using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
//using System.Web.Script.Serialization;
using System.IO;
using Newtonsoft.Json;

namespace ESB.Utils.Serializers
{
    public static class JSONHelper
    {
        public static string ToJSON(this object obj)
        {
            return JsonConvert.SerializeObject(obj);
        }

        public static T JsonDeserialize<T>(this string json)
        {
            return JsonConvert.DeserializeObject<T>(json);
        }

        public static T Clone<T>(this object obj)
        {
            string json = obj.ToJSON();
            return json.JsonDeserialize<T>();
        }
    }

}
