using System;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Hangfire;
using MailKit.Net.Smtp;
using MimeKit;
using Workers.Messaging.Models;

namespace Workers.Messaging
{
    public class EmailSender
    {
        public static SmtpConfig Configuration;


        public static async Task SendEmail(string recepientEmail, string subject, string body, bool isHtml = true)
        {
            await Task.Run(() =>
            {
                try
                {
                    EmailModel mail = new EmailModel
                    {
                        To = recepientEmail,
                        Subject = subject,
                        Body = body,
                        IsHtml = isHtml
                    };

                    var config = Configuration;
                    if (config != null)
                        BackgroundJob.Enqueue(() => ExecuteAsync(mail, config));
                    else
                        throw new Exception("Email configuration is not valid");
                }
                catch (Exception ex)
                {
                    //Utilities.CreateLogger<EmailSender>().LogError(LoggingEvents.SEND_EMAIL, ex, "An error occurred whilst sending email");
                }
            });
        }


        public static async Task ExecuteAsync(EmailModel model, SmtpConfig config)
        {
            var from = new MailboxAddress(Configuration.Name, Configuration.EmailAddress);
            var to = new MailboxAddress(model.To);

            MimeMessage message = new MimeMessage();

            message.From.Add(from);
            message.To.Add(to);
            message.Subject = model.Subject;
            message.Body = model.IsHtml ? new BodyBuilder { HtmlBody = model.Body }.ToMessageBody() : new TextPart("plain") { Text = model.Body };

            using (var client = new SmtpClient())
            {
                if (!config.UseSsl)
                    client.ServerCertificateValidationCallback = (object sender2, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors) => true;

                await client.ConnectAsync(config.Host, config.Port, config.UseSsl).ConfigureAwait(false);
                client.AuthenticationMechanisms.Remove("XOAUTH2");

                if (!string.IsNullOrWhiteSpace(config.Username))
                    await client.AuthenticateAsync(config.Username, config.Password).ConfigureAwait(false);

                await client.SendAsync(message).ConfigureAwait(false);
                await client.DisconnectAsync(true).ConfigureAwait(false);
            }
        }
    }
}
