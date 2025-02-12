// Core types for the Code Review MCP
export var ExpertType;
(function (ExpertType) {
    ExpertType["Language"] = "language";
    ExpertType["Security"] = "security";
    ExpertType["Performance"] = "performance";
    ExpertType["Architecture"] = "architecture";
    ExpertType["Testing"] = "testing";
    ExpertType["Documentation"] = "documentation";
    ExpertType["Style"] = "style";
})(ExpertType || (ExpertType = {}));
export var IssueType;
(function (IssueType) {
    IssueType["Security"] = "security";
    IssueType["Performance"] = "performance";
    IssueType["Style"] = "style";
    IssueType["Architecture"] = "architecture";
    IssueType["Documentation"] = "documentation";
    IssueType["Testing"] = "testing";
    IssueType["Maintainability"] = "maintainability";
})(IssueType || (IssueType = {}));
export var IssueSeverity;
(function (IssueSeverity) {
    IssueSeverity["Critical"] = "critical";
    IssueSeverity["High"] = "high";
    IssueSeverity["Medium"] = "medium";
    IssueSeverity["Low"] = "low";
    IssueSeverity["Info"] = "info";
})(IssueSeverity || (IssueSeverity = {}));
export var SuggestionType;
(function (SuggestionType) {
    SuggestionType["Refactoring"] = "refactoring";
    SuggestionType["Performance"] = "performance";
    SuggestionType["Security"] = "security";
    SuggestionType["Testing"] = "testing";
    SuggestionType["Documentation"] = "documentation";
    SuggestionType["Architecture"] = "architecture";
})(SuggestionType || (SuggestionType = {}));
