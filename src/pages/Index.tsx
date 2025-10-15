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
              {/* Header with Search */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Приглашение контрагентов
                </h2>
                
                <div className="flex gap-3">
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

                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Icon name="Upload" size={20} />
                    Загрузить файл
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.csv,.xlsx"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>

              {/* Counterparties List */}
              <div className="space-y-3">
                {filteredCounterparties.map((counterparty) => (
                  <Card
                    key={counterparty.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon name="Building2" size={20} className="text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-base">
                              {counterparty.companyName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              ИНН: {counterparty.inn}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Badge variant={getStatusBadge(counterparty.status).variant}>
                            {getStatusBadge(counterparty.status).label}
                          </Badge>

                          {counterparty.status === "pending" && (
                            <Button
                              size="sm"
                              className="gap-2"
                              onClick={() => handleInvite(counterparty.id)}
                            >
                              <Icon name="Send" size={16} />
                              Пригласить
                            </Button>
                          )}

                          <Button variant="ghost" size="icon">
                            <Icon name="MoreVertical" size={18} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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