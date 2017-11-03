using System.IO;
using System.Threading.Tasks;
using Ed.Workers.Messaging.Models;
using Twilio;

namespace Workers.Messaging.Jobs
{
    public class SmsJob
    {
        private TwilioRestClient _twilioClient;

        public SmsJob(TwilioRestClient twilioClient)
        {
            _twilioClient = twilioClient;
        }


        public SmsJob()
        {
        }


        public async Task Execute()
        {
            string accountSid = "AC9f24c80e0b33a61557c97cf75fa45049";
            string authToken = "a9f81ece8213d9d1daa3688bc649fc1e";
            string serviceSid = "+1 845-245-6463 ";
            _twilioClient = new TwilioRestClient(accountSid, authToken);
            //var message = _twilioClient.SendMessage(smsModel.From, smsModel.To, smsModel.Message);
            var message = _twilioClient.SendMessage("+15005550006", "+380730088500", "Test");
            //await logger.WriteLineAsync(message.Sid);
        }

        public async Task Execute(SmsModel smsModel, TextWriter logger)
        {
            var message = _twilioClient.SendMessage(smsModel.From, smsModel.To, smsModel.Message);
            //await logger.WriteLineAsync(message.Sid);
        }
    }
}
