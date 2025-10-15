import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";

interface Counterparty {
  id: string;
  companyName: string;
  inn: string;
  status: "pending" | "invited" | "active";
}

const Index = () => {
  const [secondarySidebarOpen, setSecondarySidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("invite");
  const [searchQuery, setSearchQuery] = useState("");
  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([
    "ООО Ромашка",
    "7728562345",
    "Яндекс"
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const menuSections = [
    { id: "invite", label: "+ Пригласить контрагентов", icon: "UserPlus" },
    { id: "your", label: "Ваши контрагенты", icon: "Users", count: counterparties.filter(c => c.status === "active").length },
    { id: "invited-you", label: "Пригласили вас", icon: "UserCheck", count: 0 },
    { id: "invited-by-you", label: "Приглашённые вами", icon: "Send", count: counterparties.filter(c => c.status === "invited").length },
    { id: "blocked", label: "Заблокированные", icon: "Ban", count: 0 },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast.success(`Файл "${file.name}" загружен`);
    }
  };

  const handleInvite = (id: string) => {
    setCounterparties((prev) =>
      prev.map((cp) => (cp.id === id ? { ...cp, status: "invited" } : cp))
    );
    toast.success("Приглашение отправлено");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      toast.success(`Файл "${file.name}" загружен`);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    // Добавляем в историю только если длина >= 3 символов и не пустая строка
    if (value.trim().length >= 3 && !searchHistory.includes(value.trim())) {
      setSearchHistory(prev => [value.trim(), ...prev].slice(0, 5)); // Оставляем только последние 5
    }
  };

  const filteredCounterparties = counterparties.filter(
    (cp) =>
      cp.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cp.inn.includes(searchQuery)
  );

  const getStatusBadge = (status: Counterparty["status"]) => {
    const statusConfig = {
      pending: { label: "Ожидает", variant: "outline" as const },
      invited: { label: "Приглашен", variant: "secondary" as const },
      active: { label: "Активен", variant: "default" as const },
    };
    return statusConfig[status];
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Primary Sidebar */}
      <aside className="w-20 bg-primary text-white border-r border-primary/20 flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-white/10">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center font-bold text-lg">
            П
          </div>
        </div>

        <nav className="flex-1 py-4 flex flex-col items-center space-y-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 bg-white/10 relative"
            title="Контрагенты"
          >
            <Icon name="Building2" size={20} />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            title="Документы"
          >
            <Icon name="FileText" size={20} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            title="Настройки"
          >
            <Icon name="Settings" size={20} />
          </Button>
        </nav>
      </aside>

      {/* Secondary Sidebar */}
      <aside
        className={`${
          secondarySidebarOpen ? "w-72" : "w-0"
        } bg-card border-r border-border transition-all duration-300 flex flex-col overflow-hidden`}
      >
        <div className="h-16 px-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Контрагенты</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSecondarySidebarOpen(false)}
          >
            <Icon name="PanelLeftClose" size={18} />
          </Button>
        </div>

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {menuSections.map((section, index) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "ghost"}
              className={`w-full justify-start gap-3 text-left h-11 ${
                index === 0 ? "font-semibold" : ""
              }`}
              onClick={() => setActiveSection(section.id)}
            >
              <Icon name={section.icon as any} size={18} />
              <span className="flex-1 truncate text-sm">{section.label}</span>
              {section.count !== undefined && section.count > 0 && (
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                  {section.count}
                </Badge>
              )}
            </Button>
          ))}
        </nav>
      </aside>

      {/* Toggle button when secondary sidebar is closed */}
      {!secondarySidebarOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-20 top-4 z-50 shadow-md border border-border bg-card"
          onClick={() => setSecondarySidebarOpen(true)}
        >
          <Icon name="ChevronRight" size={20} />
        </Button>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        <div className="max-w-5xl mx-auto p-8">
          {/* Empty State */}
          {counterparties.length === 0 && (
            <div
              className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className={`text-center space-y-8 transition-all duration-300 ${isDragging ? 'scale-95 opacity-50' : ''}`}>
                {/* Simple Icon */}
                <div className="relative w-32 h-32 mx-auto">
                  <div className="w-full h-full bg-primary/10 rounded-3xl flex items-center justify-center">
                    <Icon name="Upload" size={48} className="text-primary" />
                  </div>
                </div>

                {/* Title and Description */}
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold text-foreground">
                    Приглашение контрагентов
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    Перетащите файл со списком ИНН или воспользуйтесь поиском
                  </p>
                </div>

                {/* Search Input */}
                <div className="max-w-md mx-auto">
                  <div className="relative">
                    <Icon
                      name="Search"
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      placeholder="Поиск по названию или ИНН"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-14 text-base"
                    />
                  </div>
                </div>

                {/* Upload Button */}
                <div className="flex gap-3 justify-center">
                  <Button
                    size="lg"
                    className="gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Icon name="Upload" size={20} />
                    Загрузить файл
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2"
                    onClick={() => {
                      setCounterparties([
                        {
                          id: "demo-1",
                          companyName: "ООО Транспортная Компания",
                          inn: "7701234567",
                          status: "active",
                        },
                        {
                          id: "demo-2",
                          companyName: "ИП Сергеев И.П.",
                          inn: "771234567890",
                          status: "invited",
                        },
                        {
                          id: "demo-3",
                          companyName: "ООО Строительная Группа",
                          inn: "7712345678",
                          status: "pending",
                        },
                      ]);
                      toast.success("Демо-данные загружены");
                    }}
                  >
                    <Icon name="Sparkles" size={20} />
                    Показать пример
                  </Button>
                </div>

                {/* Search History */}
                {searchHistory.length > 0 && (
                  <div className="max-w-2xl mx-auto mt-12">
                    <div className="p-6 bg-muted/30 rounded-3xl border border-border">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon name="History" size={18} className="text-primary" />
                          </div>
                          <h3 className="font-semibold text-base text-foreground">
                            Искали ранее
                          </h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 h-9 text-xs hover:text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            setSearchHistory([]);
                            toast.success("История очищена");
                          }}
                        >
                          <Icon name="Trash2" size={14} />
                          Очистить
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2.5">
                        {searchHistory.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => setSearchQuery(item)}
                            className="px-5 py-2.5 bg-background border border-border rounded-full text-sm font-medium text-foreground hover:border-primary hover:bg-primary/5 hover:text-primary transition-all flex items-center gap-2 group shadow-sm hover:shadow"
                          >
                            <Icon name="Search" size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                            <span>{item}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Drag Overlay */}
              {isDragging && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/5 backdrop-blur-sm border-4 border-dashed border-primary rounded-2xl m-8">
                  <div className="text-center">
                    <Icon name="Upload" size={64} className="text-primary mx-auto mb-4" />
                    <p className="text-xl font-semibold text-primary">
                      Отпустите файл для загрузки
                    </p>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.csv,.xlsx"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          )}

          {/* With Content */}
          {counterparties.length > 0 && (
            <>
              {/* Sticky Header with Search */}
              <div className="sticky top-0 bg-background z-10 pb-6 mb-6">
                {/* Compact header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 relative group">
                    {/* Floating label */}
                    {!searchQuery && (
                      <div className="absolute left-4 -top-2 px-2 bg-background text-xs text-muted-foreground group-focus-within:text-primary transition-colors z-10">
                        Поиск контрагентов
                      </div>
                    )}
                    <Icon
                      name="Search"
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                    />
                    <Input
                      placeholder="Введите название компании или ИНН..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-4 h-14 text-base border-2 rounded-2xl focus-visible:ring-0 focus-visible:border-primary transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Icon name="X" size={18} />
                      </button>
                    )}
                  </div>
                  
                  <Button
                    size="lg"
                    className="gap-2 h-14 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Icon name="Plus" size={20} />
                    Добавить
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.csv,.xlsx"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>

                {/* Results counter */}
                {filteredCounterparties.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Icon name="CheckCircle2" size={16} className="text-primary" />
                    <span>
                      Найдено: <strong className="text-foreground">{filteredCounterparties.length}</strong> из {counterparties.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Counterparties Grid */}
              <div className="grid grid-cols-1 gap-4">
                {filteredCounterparties.map((counterparty, index) => (
                  <div
                    key={counterparty.id}
                    className="group relative bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Status indicator line */}
                    <div className={`absolute left-0 top-5 bottom-5 w-1 rounded-r-full ${
                      counterparty.status === 'active' ? 'bg-primary' :
                      counterparty.status === 'invited' ? 'bg-secondary' :
                      'bg-muted'
                    }`} />

                    <div className="flex items-start gap-4 ml-3">
                      {/* Avatar with initial */}
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                          <span className="text-lg font-bold text-primary">
                            {counterparty.companyName.charAt(0)}
                          </span>
                        </div>
                        {/* Status dot */}
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${
                          counterparty.status === 'active' ? 'bg-green-500' :
                          counterparty.status === 'invited' ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-foreground mb-1 truncate group-hover:text-primary transition-colors">
                              {counterparty.companyName}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Icon name="FileText" size={14} />
                                {counterparty.inn}
                              </span>
                            </div>
                          </div>

                          <Badge 
                            variant={getStatusBadge(counterparty.status).variant}
                            className="flex-shrink-0"
                          >
                            {getStatusBadge(counterparty.status).label}
                          </Badge>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                          {counterparty.status === "pending" && (
                            <Button
                              size="sm"
                              className="gap-2 flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInvite(counterparty.id);
                              }}
                            >
                              <Icon name="Send" size={14} />
                              Отправить приглашение
                            </Button>
                          )}
                          
                          {counterparty.status !== "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2 flex-1"
                            >
                              <Icon name="Eye" size={14} />
                              Просмотр
                            </Button>
                          )}

                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="gap-2"
                          >
                            <Icon name="MoreHorizontal" size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredCounterparties.length === 0 && (
                <Card className="p-12 text-center">
                  <Icon
                    name="Search"
                    size={48}
                    className="mx-auto mb-4 text-muted-foreground"
                  />
                  <p className="text-muted-foreground">
                    Контрагенты не найдены
                  </p>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;