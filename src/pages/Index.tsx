import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [secondarySidebarOpen, setSecondarySidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("invite");
  const [searchQuery, setSearchQuery] = useState("");
  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const menuSections = [
    { id: "invite", label: "+ Пригласить контрагентов", icon: "UserPlus" },
    { id: "your", label: "Ваши контрагенты", icon: "Users", count: 0 },
    { id: "invited-you", label: "Пригласили вас", icon: "UserCheck", count: 0 },
    { id: "invited-by-you", label: "Приглашённые вами", icon: "Send", count: 0 },
    { id: "blocked", label: "Заблокированные", icon: "Ban", count: 0 },
  ];

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
    <div className="flex h-screen bg-background relative">
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

        <div className="p-2 border-t border-white/10">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            title="Профиль"
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-xs font-semibold">
              ЮР
            </div>
          </Button>
        </div>
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

        <div className="p-4 border-t border-border bg-muted/30">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="space-y-1">
              <div className="text-xl font-bold text-foreground">{counterparties.length}</div>
              <div className="text-xs text-muted-foreground">Всего</div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-primary">
                {counterparties.filter(c => c.status === "active").length}
              </div>
              <div className="text-xs text-muted-foreground">Активные</div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-muted-foreground">
                {counterparties.filter(c => c.status === "pending").length}
              </div>
              <div className="text-xs text-muted-foreground">Ожидают</div>
            </div>
          </div>
        </div>
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
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Приглашение контрагентов
            </h2>
            <p className="text-muted-foreground">
              Управляйте списком контрагентов и отправляйте приглашения
            </p>
          </div>

          {/* Search and Upload - only show when there are counterparties */}
          {counterparties.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Icon
                  name="Search"
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Поиск по названию или ИНН"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <label htmlFor="file-upload">
                <Button variant="outline" className="gap-2 cursor-pointer" asChild>
                  <span>
                    <Icon name="Upload" size={20} />
                    Загрузить список ИНН
                  </span>
                </Button>
              </label>
            </div>
          )}
          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            accept=".txt,.csv,.xlsx"
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* Counterparties List */}
          <div className="space-y-4">
            {filteredCounterparties.map((counterparty) => (
              <Card
                key={counterparty.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <Icon name="Building2" size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {counterparty.companyName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          ИНН: {counterparty.inn}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={getStatusBadge(counterparty.status).variant}
                    >
                      {getStatusBadge(counterparty.status).label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                    >
                      <Icon name="Eye" size={16} />
                      Просмотр
                    </Button>
                    {counterparty.status === "pending" && (
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={() => handleInvite(counterparty.id)}
                      >
                        <Icon name="Send" size={16} />
                        Отправить приглашение
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCounterparties.length === 0 && counterparties.length === 0 && (
            <div 
              className="relative min-h-[600px] flex items-center justify-center overflow-hidden"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Animated background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-300 ${
                isDragging 
                  ? 'from-primary/20 via-primary/10 to-primary/20' 
                  : 'from-primary/5 via-background to-primary/10 animate-pulse'
              }`} />
              
              {/* Floating shapes */}
              <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite]" />
              <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-[pulse_5s_ease-in-out_infinite]" />
              <div className="absolute top-40 right-40 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-[pulse_6s_ease-in-out_infinite]" />

              {/* Drag overlay */}
              {isDragging && (
                <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm z-20 flex items-center justify-center border-4 border-dashed border-primary/50 m-8 rounded-3xl">
                  <div className="text-center animate-[scale-in_0.2s_ease-out]">
                    <Icon name="Upload" size={80} className="text-primary mx-auto mb-4 animate-bounce" />
                    <p className="text-2xl font-bold text-primary">Отпустите файл для загрузки</p>
                  </div>
                </div>
              )}

              {/* Main content */}
              <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8 px-4">
                {/* Icon cluster */}
                <div className="relative w-48 h-48 mx-auto mb-8">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                  <div className="absolute inset-4 bg-card rounded-full shadow-2xl flex items-center justify-center border-4 border-primary/30">
                    <div className="relative">
                      <Icon name="Users" size={64} className="text-primary animate-[scale-in_0.5s_ease-out]" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-[scale-in_0.7s_ease-out]">
                        <Icon name="Plus" size={16} className="text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Orbiting icons */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_20s_linear_infinite]">
                    <div className="w-12 h-12 bg-card rounded-full shadow-lg flex items-center justify-center border-2 border-primary/20">
                      <Icon name="Building2" size={20} className="text-primary" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 animate-[spin_20s_linear_infinite] [animation-delay:10s]">
                    <div className="w-12 h-12 bg-card rounded-full shadow-lg flex items-center justify-center border-2 border-primary/20">
                      <Icon name="FileText" size={20} className="text-primary" />
                    </div>
                  </div>
                </div>

                {/* Text content */}
                <div className="space-y-4 animate-[fade-in_0.8s_ease-out]">
                  <h3 className="text-4xl font-bold text-foreground">
                    Начните работу с контрагентами
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                    Загрузите список ИНН или начните поиск, чтобы пригласить компании к сотрудничеству
                  </p>
                </div>

                {/* Drag and Drop Zone */}
                <div 
                  className="border-2 border-dashed border-primary/30 rounded-3xl p-12 bg-card/50 backdrop-blur-sm hover:border-primary/60 hover:bg-card/70 transition-all cursor-pointer group animate-[fade-in_1s_ease-out]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon name="Upload" size={40} className="text-primary" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Icon name="Plus" size={14} className="text-white" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-foreground mb-1">
                        Перетащите файл сюда или нажмите для выбора
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Поддерживаются форматы: .txt, .csv, .xlsx
                      </p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative animate-[fade-in_1.1s_ease-out]">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-4 text-muted-foreground">или</span>
                  </div>
                </div>

                {/* Demo button */}
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-3 text-base px-8 py-6 hover:bg-primary hover:text-white transition-all hover:scale-105 animate-[fade-in_1.2s_ease-out]"
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
                  Попробовать с демо-данными
                </Button>

                {/* Feature highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mt-12 animate-[fade-in_1.3s_ease-out]">
                  <div className="p-6 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl border border-border/50 text-left group hover:shadow-lg transition-all">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Icon name="Zap" size={20} className="text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">Быстрая загрузка</h4>
                    <p className="text-sm text-muted-foreground">Массовое добавление контрагентов из файла</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl border border-border/50 text-left group hover:shadow-lg transition-all">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Icon name="ShieldCheck" size={20} className="text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">Безопасно</h4>
                    <p className="text-sm text-muted-foreground">Проверка и валидация всех данных</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl border border-border/50 text-left group hover:shadow-lg transition-all">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Icon name="BarChart3" size={20} className="text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">Аналитика</h4>
                    <p className="text-sm text-muted-foreground">Отслеживание статусов и истории</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {filteredCounterparties.length === 0 && counterparties.length > 0 && (
            <Card className="p-12 text-center">
              <Icon
                name="Search"
                size={48}
                className="mx-auto mb-4 text-muted-foreground"
              />
              <p className="text-muted-foreground">
                Контрагенты не найдены. Попробуйте изменить запрос или загрузите
                новый список.
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;