using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using the_kern.com.Models;
using the_kern.com.Services;

namespace the_kern.com.Pages.Api
{
    public class AutomataDescribeModel : PageModel
    {
        private readonly DFAAnalyzer _analyzer;

        public AutomataDescribeModel(DFAAnalyzer analyzer)
        {
            _analyzer = analyzer;
        }

        public IActionResult OnPost([FromBody] DescribeLanguageRequest request)
        {
            if (request?.Dfa == null)
            {
                return BadRequest(new { error = "Invalid request" });
            }

            var result = _analyzer.DescribeLanguage(request.Dfa);
            return new JsonResult(result);
        }
    }
}