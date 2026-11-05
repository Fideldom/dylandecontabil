using Microsoft.AspNetCore.Mvc;

namespace DylandeContabil.Controllers;

public class HomeController : Controller
{
    private static readonly Dictionary<string, string> Modules = new(StringComparer.OrdinalIgnoreCase)
    {
        ["Plano de Contas"] = "PlanoContas",
        ["Lançamentos"] = "Lancamentos",
        ["Diário Geral"] = "DiarioGeral",
        ["Razão Geral"] = "RazaoGeral",
        ["Balancetes"] = "Balancetes",
        ["Regularizações"] = "Regularizacoes",
        ["Apuramento"] = "Apuramento",
        ["Demonstrações Financeiras"] = "DemonstracoesFinanceiras",
        ["Definições"] = "Definicoes"
    };

    public IActionResult Login() => View();

    [HttpGet]
    public IActionResult Dashboard(string? empresa = null)
    {
        ViewBag.Empresa = empresa ?? "DYLANDE — Prestação de Serviços e Comércio";
        ViewBag.Module = "Visão geral";
        return View();
    }

    [HttpGet]
    public IActionResult Module(string? id, string? empresa = null)
    {
        ViewBag.Empresa = empresa ?? "DYLANDE — Prestação de Serviços e Comércio";
        ViewBag.Module = id ?? "Visão geral";

        if (id is not null && Modules.TryGetValue(id, out var view))
            return View(view);

        return View("Module");
    }
}
