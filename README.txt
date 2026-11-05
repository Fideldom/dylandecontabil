DYLANDE CONTABIL — FRONTEND ORGANIZADO

Estrutura ASP.NET Core MVC .NET 8.

REGRAS DE ORGANIZAÇÃO
- Views (.cshtml): apenas estrutura Razor/HTML e chamadas de View/Tag Helpers.
- wwwroot/css: estilos visuais separados por responsabilidade.
- wwwroot/js: comportamento e interações separados por página.
- Controllers: fluxo de navegação.
- Models/Services: reservados para a fase de backend e regras contabilísticas.

NOTA
Esta versão ainda usa dados demonstrativos no frontend. A persistência, autenticação, permissões e validação contabilística serão ligadas ao backend na próxima fase.
