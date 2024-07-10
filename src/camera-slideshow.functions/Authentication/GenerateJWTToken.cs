using JWT;
using JWT.Algorithms;
using JWT.Serializers;
using Microsoft.Extensions.Configuration;

namespace camera_slideshow.functions.Authentication;

public class GenerateJWTToken
{
	private readonly IConfiguration _configuration;
	private readonly IJwtAlgorithm _algorithm;
	private readonly IJsonSerializer _serializer;
	private readonly IBase64UrlEncoder _base64Encoder;
	private readonly IJwtEncoder _jwtEncoder;
	
	public GenerateJWTToken(IConfiguration configuration)
	{
		_configuration = configuration;
		// JWT specific initialization.
		_algorithm = new HMACSHA256Algorithm();
		_serializer = new JsonNetSerializer();
		_base64Encoder = new JwtBase64UrlEncoder();
		_jwtEncoder = new JwtEncoder(_algorithm, _serializer, _base64Encoder);
	}
	
	public string GenerateToken(string token)
	{
		var claims = new Dictionary<string, object>
		{
			{"token", token}
		};
		
		var jwtToken = _jwtEncoder.Encode(claims, _configuration["Jwt"]);

		return jwtToken;
	}
}