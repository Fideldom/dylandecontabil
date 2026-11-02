using Microsoft.AspNetCore.Mvc;

namespace DylandeContabil.Controllers;

public class HomeController : Controller
{
    public IActionResult Login() => View();

    // Frontend demo only: no real authentication or company data is processed.
    [HttpGet]
    public IActionResult Dashboard(string empresa = "RAZCOF — Comércio e Prestação de Serviços")
    {
        ViewBag.Empresa = empresa;
        return View();
    }

    [HttpGet]
    public IActionResult Module(string id)
    {
        ViewBag.Empresa = Request.Query["empresa"].FirstOrDefault()
            ?? "RAZCOF — Comércio e Prestação de Serviços";
        ViewBag.Module = id ?? "Módulo";
        return View();
    }
}
