using AspNet.Security.OpenIdConnect.Primitives;
using System.Linq;
using System.Security.Claims;
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
    }
}
