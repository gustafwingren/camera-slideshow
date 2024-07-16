using System.Collections.Generic;
using System.Net;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using camera_slideshow.functions.Authentication;
using HttpMultipartParser;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace camera_slideshow.functions;

public class UploadFunc
{
	private readonly IConfiguration _configuration;
	private readonly ILogger _logger;

	public UploadFunc(ILoggerFactory loggerFactory, IConfiguration configuration)
	{
		_configuration = configuration;
		_logger = loggerFactory.CreateLogger<UploadFunc>();
	}

	[Function("UploadFunc")]
	public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Function, "post", Route = "upload")] HttpRequestData req,
		FunctionContext executionContext)
	{
		// Check if we have authentication info.
		var auth = new ValidateJWT(_logger, _configuration, req);

		if (!auth.IsValid)
		{
			return req.CreateResponse(HttpStatusCode.Unauthorized); // No authentication info.
		}

		var parsedFormBody =  await MultipartFormDataParser.ParseAsync(req.Body);
		var file = parsedFormBody.Files[0];

		var blobContainerClient = new BlobContainerClient(_configuration["AzureBlobStorage"], "wedding");
		var blob = blobContainerClient.GetBlobClient(Guid.NewGuid().ToString());
		await blob.UploadAsync(file.Data);
		await blob.SetHttpHeadersAsync(new BlobHttpHeaders() { ContentType = file.ContentType });
		
		return req.CreateResponse(HttpStatusCode.OK);
	}
}