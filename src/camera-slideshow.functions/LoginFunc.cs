using System.Net;
using System.Text;
using camera_slideshow.functions.Authentication;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace camera_slideshow.functions;

public class LoginFunc
{
	private readonly IConfiguration _configuration;
	private readonly GenerateJWTToken _generateJwtToken;
	private readonly ILogger _logger;

	public LoginFunc(ILoggerFactory loggerFactory, IConfiguration configuration, GenerateJWTToken generateJwtToken)
	{
		_configuration = configuration;
		_generateJwtToken = generateJwtToken;
		_logger = loggerFactory.CreateLogger<LoginFunc>();
	}

	[Function("LoginFunc")]
	public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "auth")] HttpRequestData request, [Microsoft.Azure.Functions.Worker.Http.FromBody] UserCredentials userCredentials,
		FunctionContext executionContext)
	{
		if (string.IsNullOrWhiteSpace(userCredentials.Token)) return request.CreateResponse(HttpStatusCode.BadRequest);
		
		var base64EncodedBytes = Convert.FromBase64String(userCredentials.Token);
		var userToken = Encoding.UTF8.GetString(base64EncodedBytes);
		
		if (_configuration["Client_Secret"] != userToken) return request.CreateResponse(HttpStatusCode.BadRequest);
		
		var token = _generateJwtToken.GenerateToken(userCredentials.Token);
		var response = request.CreateResponse(HttpStatusCode.OK);
		await response.WriteAsJsonAsync(new { Token = token });
		
		return response;
	}

	public record UserCredentials(string Token);
}