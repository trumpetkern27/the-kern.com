using Microsoft.AspNetCore.Mvc.RazorPages;
using Markdig;
using System.Text;
using System.Text.RegularExpressions;

namespace the_kern.com.Pages
{
    public class BlogModel : PageModel
    {
        private readonly ILogger<BlogModel> _logger;

        public List<BlogPost> BlogPosts { get; private set; } = new();

        public BlogModel(ILogger<BlogModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
            var postsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/files/post md");
            if (!Directory.Exists(postsDir)) return;

            var pipeline = new MarkdownPipelineBuilder()
                .UseAdvancedExtensions()
                .Build();

            foreach (var file in Directory.GetFiles(postsDir, "*.md").OrderByDescending(f => f))
            {
                var raw = System.IO.File.ReadAllText(file);

                // ✅ Use the improved method instead of Regex.Replace
                raw = MergeSoftLineBreaks(raw);

                var html = Markdown.ToHtml(raw, pipeline);
                var title = Path.GetFileNameWithoutExtension(file);

                BlogPosts.Add(new BlogPost
                {
                    Title = title,
                    HtmlContent = html
                });
            }
        }

        /// <summary>
        /// Merges single newlines inside paragraphs into spaces, preserving blank lines,
        /// list markers, and code blocks.
        /// </summary>
        private static string MergeSoftLineBreaks(string markdown)
        {
            var sb = new StringBuilder();
            var lines = markdown.Replace("\r", "").Split('\n');
            bool inCodeBlock = false;
            bool inTableBlock = false;

            for (int i = 0; i < lines.Length; i++)
            {
                string line = lines[i];
                string trimmed = line.Trim();

                // Detect start/end of fenced code block
                if (Regex.IsMatch(trimmed, "^```"))
                {
                    inCodeBlock = !inCodeBlock;
                    sb.AppendLine(line);
                    continue;
                }

                // Always keep code blocks or blank lines intact
                if (inCodeBlock || string.IsNullOrWhiteSpace(line))
                {
                    if (inTableBlock && string.IsNullOrWhiteSpace(line))
                        inTableBlock = false;

                    sb.AppendLine(line);
                    continue;
                }

                // Detect start or continuation of a Markdown table block
                if (Regex.IsMatch(trimmed, @"^\|.*\|$"))
                {
                    inTableBlock = true;
                    sb.AppendLine(line);
                    continue;
                }

                // If we're inside a table, preserve structure until a blank line
                if (inTableBlock)
                {
                    sb.AppendLine(line);
                    continue;
                }

                // Preserve newlines before lists, headers, or blockquotes
                if (Regex.IsMatch(trimmed, @"^([-*+]|[0-9]+\.)\s") ||
                    trimmed.StartsWith("#") ||
                    trimmed.StartsWith(">"))
                {
                    sb.AppendLine(line);
                    continue;
                }

                // Merge this line with the next if the next isn't blank
                string next = i + 1 < lines.Length ? lines[i + 1] : null;
                if (!string.IsNullOrWhiteSpace(next))
                    sb.Append(line.TrimEnd()).Append(' ');
                else
                    sb.AppendLine(line.TrimEnd());
            }

            return sb.ToString();
        }



        public class BlogPost
        {
            public string Title { get; set; } = "";
            public string HtmlContent { get; set; } = "";
        }
    }
}
