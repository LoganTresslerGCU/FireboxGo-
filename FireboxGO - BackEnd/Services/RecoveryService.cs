using MailKit.Net.Smtp;
using MimeKit;
using System;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace FireboxGo.Services
{
    public class RecoveryService
    {
        private string adminAddress = "letress7@gmail.com";
        private string adminPassword = "fjbvuuwocjwduvsd";

        public async Task<string> SendCodeAsync(string recipientEmail)
        {
            string code = GenerateSixDigitCode();

            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse(adminAddress));
            message.To.Add(MailboxAddress.Parse(recipientEmail));
            message.Subject = "Your Recovery Code";

            message.Body = new TextPart("html")
            {
                Text = $"<p>Your recovery code is: <strong>{code}</strong></p><p>This code will expire in 10 minutes.</p>"
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(adminAddress, adminPassword);
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);

            return code;
        }

        private string GenerateSixDigitCode()
        {
            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[4];
            rng.GetBytes(bytes);
            int number = BitConverter.ToInt32(bytes, 0) % 1_000_000;
            return Math.Abs(number).ToString("D6");
        }
    }
}
