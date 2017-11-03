using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Workers.Messaging.Jobs
{
    public class EmailJob
    {
        //public static string NoReplyMail { get; private set; } = Config.Get<string>("noreplyMail");
        //public static string ReplyMail { get; private set; } = Config.Get<string>("replyMail");
        //public static string AdminMail { get; private set; } = Config.Get<string>("adminMail");
        //public static string SupportMail { get; private set; } = Config.Get<string>("supportMail");

        //private readonly SendGridAPIClient sendGridClient;
        //private readonly IStorageProvider storageProvider;

        //public EmailJob(SendGridAPIClient sendGridClient, 
        //    IStorageProvider storageProvider)
        //{
        //    this.sendGridClient = sendGridClient;
        //    this.storageProvider = storageProvider;
        //}


        //public async Task ExecuteAsync([QueueTrigger(Constants.EmailQueueName)] EmailModel emailModel, TextWriter logger)
        //{
        //    logger.WriteLine("Email");

        //    var mail = await ProcessAsync(emailModel);

        //    logger.WriteLine("REQUEST");
        //    logger.WriteLine(JsonConvert.SerializeObject(mail));

        //    dynamic response = await sendGridClient.client.mail.send.post(requestBody: mail.Get());

        //    logger.WriteLine("RESPONSE");
        //    logger.WriteLine(JsonConvert.SerializeObject(response));
        //}

        //private async Task<Mail> ProcessAsync(EmailModel emailModel)
        //{

        //    // FROM IS DEFAULT NOREPLY
        //    emailModel.From = new Email(NoReplyMail, "101Ed NoReply");
            
        //    // IF ATTACHMENT EXISTS, CREATE IT
        //    for(int i = 0; i < emailModel.MailAttachments.Count(); i++)
        //    {
        //        var containerName = emailModel.MailAttachments[i].Split('|')[0];
        //        var fileName = emailModel.MailAttachments[i].Split('|')[1];

        //        var cloudBlob = await this.storageProvider.GetFileAsync(containerName, fileName);

        //        var stream = await cloudBlob.OpenReadAsync();

        //        var attachment = new Attachment()
        //        {
        //            Content = Convert.ToBase64String(ReadToEnd(stream)),
        //            Filename = fileName
        //        };

        //        emailModel.AddAttachment(attachment);
        //    }

        //    // CONTENT MUST EXIST
        //    if(emailModel.Contents.Count == 0)
        //    {
        //        emailModel.Contents.Add(new Content("text/html", "NO_CONTENT"));
        //    }

        //    switch (emailModel.MailTemplate)
        //    {
        //        //default:
        //        //    throw new Exception("Mail does not contain supported template. Discarding mail.");

        //        case "ADMIN_MAIL":
                    
        //            for (int i = 0; i < emailModel.Personalization.Count; i++)
        //            {
        //                emailModel.Personalization[i].Tos = ReplyMail.Split(';').Select(a => new Email(a)).ToList();
        //            }

        //            emailModel.TemplateId = Config.Get<string>("adminEmailTemplate");
        //            break;

        //        case "CERTIFICATES_MAIL":

        //            for (int i = 0; i < emailModel.Personalization.Count; i++)
        //            {
        //                emailModel.Personalization[i].Bccs = ReplyMail.Split(';').Select(a => new Email(a)).ToList();
        //            }

        //            emailModel.TemplateId = Config.Get<string>("certificatesEmailTemplate");
        //            break;

        //        case "ORDER_MAIL":

        //            // Order emails are intercepted and sent to admins
        //            for (int i = 0; i < emailModel.Personalization.Count; i++)
        //            {
        //                emailModel.Personalization[i].Bccs = ReplyMail.Split(';').Select(a => new Email(a)).ToList();
        //            }

        //            emailModel.TemplateId = Config.Get<string>("basicOrderEmailTemplate");
        //            break;

        //        case "REGISTRATION_CONFIRMATION_MAIL":

        //            emailModel.From = new Email(ReplyMail, "101Ed");

        //            emailModel.TemplateId = Config.Get<string>("registrationConfirmationEmailTemplate");
        //            break;

        //        case "DEFICIENCY_MAIL":
        //            emailModel.From = new Email(SupportMail, "101ED Support");

        //            emailModel.TemplateId = Config.Get<string>("deficiencyMailTemplate");

        //            break;
        //    }
            
        //    for (int i = 0; i < emailModel.Personalization.Count; i++)
        //    {
        //        if (EdEnvironment.IsDev)
        //        {
        //            emailModel.Personalization[i].Tos = AdminMail.Split(';').Select(a => new Email(a)).ToList();
        //        }
        //    }
            
        //    return emailModel;  
        //}

        //private static byte[] ReadToEnd(System.IO.Stream stream)
        //{
        //    long originalPosition = 0;

        //    if (stream.CanSeek)
        //    {
        //        originalPosition = stream.Position;
        //        stream.Position = 0;
        //    }

        //    try
        //    {
        //        byte[] readBuffer = new byte[4096];

        //        int totalBytesRead = 0;
        //        int bytesRead;

        //        while ((bytesRead = stream.Read(readBuffer, totalBytesRead, readBuffer.Length - totalBytesRead)) > 0)
        //        {
        //            totalBytesRead += bytesRead;

        //            if (totalBytesRead == readBuffer.Length)
        //            {
        //                int nextByte = stream.ReadByte();
        //                if (nextByte != -1)
        //                {
        //                    byte[] temp = new byte[readBuffer.Length * 2];
        //                    Buffer.BlockCopy(readBuffer, 0, temp, 0, readBuffer.Length);
        //                    Buffer.SetByte(temp, totalBytesRead, (byte)nextByte);
        //                    readBuffer = temp;
        //                    totalBytesRead++;
        //                }
        //            }
        //        }

        //        byte[] buffer = readBuffer;
        //        if (readBuffer.Length != totalBytesRead)
        //        {
        //            buffer = new byte[totalBytesRead];
        //            Buffer.BlockCopy(readBuffer, 0, buffer, 0, totalBytesRead);
        //        }
        //        return buffer;
        //    }
        //    finally
        //    {
        //        if (stream.CanSeek)
        //        {
        //            stream.Position = originalPosition;
        //        }
        //    }
        //}
    }
}
