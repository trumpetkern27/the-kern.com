using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Markdig;

namespace the_kern.com.Pages;

public class BlogModel : PageModel
{
    private readonly ILogger<BlogModel> _logger;

    public BlogModel(ILogger<BlogModel> logger)
    {
        _logger = logger;
    }

    public void OnGet()
    {

    }
}

public static class MarkdownHelper
{
    private static readonly MarkdownPipeline _pipeline =
        new MarkdownPipelineBuilder()
            .UseAdvancedExtensions()
            .Build();
    public static string ToHtml(string markdown)
    {
        return Markdown.ToHtml(markdown, _pipeline);
    }
}