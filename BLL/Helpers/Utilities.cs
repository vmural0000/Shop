using System;
using System.IO;
using AspNet.Security.OpenIdConnect.Primitives;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace BLL.Helpers
{
    public static class Utilities
    {
        public static string ModelToJson(object model)
        {
            return JsonConvert.SerializeObject(model);
        }

        public static T JsonToModel<T>(string json)
        {
            return JsonConvert.DeserializeObject<T>(json);
        }



        public static string GetUserId(ClaimsPrincipal user)
        {
            return user.FindFirst(OpenIdConnectConstants.Claims.Subject)?.Value?.Trim();
        }

        public static string[] GetRoles(ClaimsPrincipal identity)
        {
            return identity.Claims
                .Where(c => c.Type == OpenIdConnectConstants.Claims.Role)
                .Select(c => c.Value)
                .ToArray();
        }

        public static async Task<string> Email()
        {
            string recepientName = "QickApp Tester"; //         <===== Put the recepient's name here
            string recepientEmail = "vmural@hotmail.com"; //   <===== Put the recepient's email here

            string message = EmailTemplates.GetTestEmail(recepientName, DateTime.UtcNow);

            (bool success, string errorMsg) response = await EmailSender.SendEmailAsync(recepientName, recepientEmail, "Test Email from QuickApp", message);

            if (response.success)
                return "Success";

            return "Error: " + response.errorMsg;
        }
    }
}
