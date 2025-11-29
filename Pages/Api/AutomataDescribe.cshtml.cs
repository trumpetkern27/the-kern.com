using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using the_kern.com.Models;
using the_kern.com.Services;

namespace the_kern.com.Pages.Api
{
    [IgnoreAntiforgeryToken]
    public class AutomataDescribeModel : PageModel
    {
        private readonly DFAAnalyzer _analyzer;

        public AutomataDescribeModel(DFAAnalyzer analyzer)
        {
            _analyzer = analyzer;
        }


        
        public IActionResult OnPost([FromBody] DescribeLanguageRequest request)
        {   
            Console.WriteLine("AutomataDescribe called");
            Console.WriteLine($"Request is null: {request == null}");
            Console.WriteLine($"DFA is null: {request?.Dfa == null}");
            Console.WriteLine($"Nodes count: {request?.Dfa?.Nodes?.Count}");
            
            if (request?.Dfa == null)
            {
                Console.WriteLine("Returning BadRequest");
                return BadRequest(new { error = "Invalid request - DFA is null" });
            }

            var result = _analyzer.DescribeLanguage(request.Dfa);
            return new JsonResult(result);
        }
    }
}