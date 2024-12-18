using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace ProfileApiExample
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var profile = new
            {
                journeyMapIds = "",
                dataLabels = "test; demo",
                crmRefId = "crm-123",
                primaryAvatar = "https://i.pinimg.com/236x/e1/6c/70/e16c704fc0b655e553dd7a1a8a00475d.jpg",
                primaryEmail = "thomas@dgvdigital.com",
                secondaryEmails = "",
                primaryPhone = "0903880048",
                secondaryPhones = "",
                firstName = "Trieu Test",
                updateByKey = "primaryPhone"
            };


            var url = "https://leocdp.example.com/api/profile/save";

            // Load the configuration from appsettings.json
            var config = LoadConfiguration();

            // Read tokenKey and tokenValue from config
            var tokenKey = config["ApiSettings:tokenKey"];
            var tokenValue = config["ApiSettings:tokenValue"];
            if (tokenKey != null && tokenValue != null)
            {
                var response = await SendDictDataToApi(url, profile, tokenKey, tokenValue);
                Console.WriteLine(await response.Content.ReadAsStringAsync());
            }

        }

        static async Task<HttpResponseMessage> SendDictDataToApi(string url, object dictData, string tokenKey, string tokenValue)
        {
            using (var client = new HttpClient())
            {
                var json = JsonSerializer.Serialize(dictData);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                // Set User-Agent header
                client.DefaultRequestHeaders.UserAgent.ParseAdd("CDPClient/1.0 (Windows NT 10.0; .NET 8.0; CDPAPI/1.0)");

                // Add headers to client (except Content-Type)
                client.DefaultRequestHeaders.Add("tokenkey", tokenKey);
                client.DefaultRequestHeaders.Add("tokenvalue", tokenValue);

                // Make the POST request
                Console.WriteLine($"Sending POST request to {url}");
                string contentString = await content.ReadAsStringAsync();
                Console.WriteLine(contentString);

                var response = await client.PostAsync(url, content);
                return response;
            }
        }

        static IConfiguration LoadConfiguration()
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(AppContext.BaseDirectory)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

            return builder.Build();
        }
    }
}
