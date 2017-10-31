using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics;
using System.Threading.Tasks;

namespace BLL
{
    public class RequestResponseLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RequestResponseLoggingMiddleware> _logger;

        public RequestResponseLoggingMiddleware(RequestDelegate next, ILogger<RequestResponseLoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            //var user = Utilities.GetUserId(_httpContextAccessor.HttpContext.User.Clone());
            var startTime = DateTime.UtcNow;

            var watch = Stopwatch.StartNew();
            await _next.Invoke(context);
            watch.Stop();

            var logTemplate = @"
Client IP: {clientIP}
Request path: {requestPath}
Request path: {requestMethod}
Request content type: {requestContentType}
Request content length: {requestContentLength}
Start time: {startTime}
Duration: {duration}";

    
            //await _activityLog.Post(id);

            _logger.LogInformation(logTemplate,
               context.Connection.RemoteIpAddress.ToString(),
                context.Request.Path,
                context.Request.Method,
                context.Request.ContentType,
                context.Request.ContentLength,
                startTime,
                watch.ElapsedMilliseconds);
        }
    }

    public static class HttpContextExtensions
    {
        public static string GetClientIPAddress(this HttpContext context)
        {
            if (null == context)
            {
                throw new ArgumentNullException(nameof(context));
            }

            var connection = context.Features.Get<IHttpConnectionFeature>();
            return connection?.RemoteIpAddress?.ToString();
        }
    }
}

