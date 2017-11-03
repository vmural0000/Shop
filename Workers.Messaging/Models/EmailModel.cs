using System.Collections.Generic;
using Newtonsoft.Json;

namespace Workers.Messaging.Models
{
    public class EmailModel
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public bool IsHtml { get; set; }

        [JsonProperty("template")]
        public string MailTemplate { get; set; }

        [JsonProperty("attachment_list")]
        public List<string> MailAttachments { get; set; }
    }
}
