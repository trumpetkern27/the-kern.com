using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace the_kern.com.Pages;

public class AutomataModel : PageModel
{
    private readonly ILogger<AutomataModel> _logger;

    public AutomataModel(ILogger<AutomataModel> logger)
    {
        _logger = logger;
    }

    public void OnGet()
    {

    }
}
