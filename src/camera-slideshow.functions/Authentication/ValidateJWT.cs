using JWT.Algorithms;
using JWT.Builder;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace camera_slideshow.functions.Authentication;

public class ValidateJWT
{
	public bool IsValid { get; }
	public string Username { get; }
	
	public ValidateJWT(ILogger logger, IConfiguration configuration, HttpRequestData request)
	{
		// Check if we have a header.
		if (!request.Headers.Contains("Authorization"))
		{
			logger.LogError("No authorization header found.");
			IsValid = false;

			return;
		}

		var authorizationHeader = request.Headers.GetValues("Authorization").FirstOrDefault();

		// Check if the value is empty.
		if (string.IsNullOrEmpty(authorizationHeader))
		{
			logger.LogError("Authorization header is empty.");
			IsValid = false;

			return;
		}

		// Check if we can decode the header.
		IDictionary<string, object> claims = null;

		try
		{
			if (authorizationHeader.StartsWith("Bearer"))
			{
				authorizationHeader = authorizationHeader.Substring(7);
			}

			logger.LogTrace(authorizationHeader);
			// Validate the token and decode the claims.
			claims = JwtBuilder.Create()
				.WithAlgorithm(new HMACSHA256Algorithm())
				.WithSecret(configuration["Jwt"])
				.MustVerifySignature()
				.Decode<IDictionary<string, object>>(authorizationHeader);
		}
		catch (Exception exception)
		{
			logger.LogError(exception, "Failed to decode JWT token., {token}", authorizationHeader);
			IsValid = false;

			return;
		}

		// Check if we have user claim.
		if (!claims.ContainsKey("token"))
		{
			logger.LogError("No user claim found in JWT token.");
			IsValid = false;

			return;
		}

		IsValid = true;
		Username = Convert.ToString(claims["token"]);
	}
}