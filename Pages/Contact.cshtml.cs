using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Net.Mail;

namespace the_kern.com.Pages;

public class ContactModel : PageModel
{
    private readonly IConfiguration _configuration;

    [BindProperty] public string Name { get; set; }
    [BindProperty] public string Email { get; set; }
    [BindProperty] public string Message { get; set;}

    public string ResultMessage { get; set; }

    private readonly ILogger<ContactModel> _logger;

    public ContactModel(ILogger<ContactModel> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    public void OnGet()
    {

    }

    public IActionResult OnPost()
    {
        try
        {
            var username = _configuration["Email:Username"];
            var password = _configuration["Email:Password"];
            var recipient = _configuration["Email:Recipient"];

            var mail = new MailMessage();
            mail.From = new MailAddress(username);
            mail.To.Add(recipient);
            mail.Subject = $"New contact from message from {Name}";
            mail.Body = $"From: {Name} ({Email})\n\n{Message}";

            using var smtp = new SmtpClient("smtp.gmail.com", 587);

                smtp.Credentials = new System.Net.NetworkCredential(username, password);
                smtp.EnableSsl = true;
                smtp.Send(mail);

            TempData["ResultMessage"] = "Your message has been sent.";
            Name = Email = Message = string.Empty;
            
        }
        catch (Exception ex)
        {
            TempData["ResultMessage"] = $"Error sending email: {ex.Message}";
        }
        return RedirectToPage();
    }

}