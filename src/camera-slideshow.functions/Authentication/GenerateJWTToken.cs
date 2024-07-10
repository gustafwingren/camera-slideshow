using JWT.Algorithms;
using JWT.Builder;
using Microsoft.Extensions.Configuration;

namespace camera_slideshow.functions.Authentication;

public class GenerateJWTToken
{
	private readonly IConfiguration _configuration;
	
	public GenerateJWTToken(IConfiguration configuration)
	{
		_configuration = configuration;
	}
	
	public string GenerateToken(string token)
	{
		var jwtToken = JwtBuilder.Create()
			.WithAlgorithm(new HMACSHA256Algorithm())
			.WithSecret(_configuration["Jwt"])
			.AddClaim("token", token)
			.Encode(token);
		
		return jwtToken;
	}
}