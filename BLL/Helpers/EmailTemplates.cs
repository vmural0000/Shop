using System;

namespace BLL.Helpers
{
    public static class EmailTemplates
    {
        private static string _emailTemplate;

        public static string GetTestEmail(string recepientName, DateTime testDate)
        {
            string emailMessage = _emailTemplate
                .Replace("{user}", recepientName)
                .Replace("{testDate}", testDate.ToString());

            return emailMessage;
        }
    }
}
