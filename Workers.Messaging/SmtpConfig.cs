using System;

namespace Workers.Messaging
{
    public class SmtpConfig
    {
        //public SmtpConfig(string host, int port, bool useSsl, string name, string username, string emailAddress, string password)
        //{
        //    Host = host ?? throw new ArgumentNullException(nameof(host));
        //    Port = port;
        //    UseSsl = useSsl;
        //    Name = name ?? throw new ArgumentNullException(nameof(name));
        //    Username = username ?? throw new ArgumentNullException(nameof(username));
        //    EmailAddress = emailAddress ?? throw new ArgumentNullException(nameof(emailAddress));
        //    Password = password ?? throw new ArgumentNullException(nameof(password));
        //}

        public string Host { get; set; }
        public int Port { get; set; }
        public bool UseSsl { get; set; }

        public string Name { get; set; }
        public string Username { get; set; }
        public string EmailAddress { get; set; }
        public string Password { get; set; }
    }
}