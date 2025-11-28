using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using the_kern.com.Models;
using the_kern.com.Services;

namespace the_kern.com.Pages.Api
{
    public class AutomataTestModel : PageModel
    {
        private readonly DFASimulator _simulator;
        public AutomataTestModel(DFASimulator simulator)
        {
            _simulator = simulator;
        }

        public IActionResult OnPost([FromBody] TestStringRequest request)
        {
            if (request?.Dfa == null || request.Input == null)
            {
                return BadRequest(new { error = "Invalid request" });
            }

            var result = _simulator.SimulateString(request.Dfa, request.Input);
            return new JsonResult(result);
        }
    }
}