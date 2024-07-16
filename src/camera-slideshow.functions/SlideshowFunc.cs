using System.Collections.Generic;
using System.Net;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using camera_slideshow.functions.Authentication;
using Google.Protobuf.Compiler;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace camera_slideshow.functions;

public class SlideshowFunc
{
	private readonly IConfiguration _configuration;
	private readonly ILogger _logger;

	public SlideshowFunc(ILoggerFactory loggerFactory, IConfiguration configuration)
	{
		_configuration = configuration;
		_logger = loggerFactory.CreateLogger<SlideshowFunc>();
	}

	[Function("SlideshowFunc")]
	public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "post", Route = "slideshow")] HttpRequestData req,
		FunctionContext executionContext)
	{// Check if we have authentication info.
		var auth = new ValidateJWT(_logger, _configuration, req);

		if (!auth.IsValid)
		{
			return new UnauthorizedResult();
		}

		var parsedBody = await System.Text.Json.JsonSerializer.DeserializeAsync<Payload>(req.Body);

		var blobContainerClient = new BlobContainerClient(_configuration["AzureBlobStorage"], "wedding");
		var blobPages = blobContainerClient.GetBlobsAsync(BlobTraits.None, BlobStates.None, null, executionContext.CancellationToken)
			.AsPages();

		var files = new List<(string Name, string ContentType)>();
		
		await foreach (var blobPage in blobPages)
		{
			files.AddRange(blobPage.Values.Select(x => (x.Name, x.Properties.ContentType)));
		}

		var rnd = new Random();
		var filesWithoutExcluded = files.Where(x => !parsedBody.ExcludeGuids.Contains(x.Name)).ToList();
		var fileToDownload = filesWithoutExcluded.ElementAt(rnd.Next(filesWithoutExcluded.Count));
		var blobClient = blobContainerClient.GetBlobClient(fileToDownload.Name);
		
		using var ms = new MemoryStream();
		await blobClient.DownloadToAsync(ms);

		return new FileContentResult(ms.ToArray(), fileToDownload.ContentType)
		{
			FileDownloadName = fileToDownload.Name,
		};
	}

	public record Payload(IEnumerable<string> ExcludeGuids);
}