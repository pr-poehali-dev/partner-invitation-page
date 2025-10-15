import { useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [counterparties, setCounterparties] = useState<Counterparty[]>([
    {
      id: "1",
      companyName: "ООО Транспортная Компания",
      inn: "7701234567",
      status: "active",
    },
    {
      id: "2",
      companyName: "ИП Сергеев И.П.",
      inn: "771234567890",
      status: "invited",
    },
    {
      id: "3",
      companyName: "ООО Строительная Группа",
      inn: "7712345678",
      status: "pending",
    },
  ]);

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
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-card border-r border-border transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-lg font-semibold text-primary">ПИБНАЯ</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Icon name="Menu" size={20} />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant="default"
            className="w-full justify-start gap-3"
            size={sidebarOpen ? "default" : "icon"}
          >
            <Icon name="Building2" size={20} />
            {sidebarOpen && <span>Контрагенты</span>}
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            size={sidebarOpen ? "default" : "icon"}
          >
            <Icon name="FileText" size={20} />
            {sidebarOpen && <span>Документы</span>}
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            size={sidebarOpen ? "default" : "icon"}
          >
            <Icon name="Settings" size={20} />
            {sidebarOpen && <span>Настройки</span>}
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
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

          {/* Search and Upload */}
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
              <input
                id="file-upload"
                type="file"
                accept=".txt,.csv,.xlsx"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>

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

          {filteredCounterparties.length === 0 && (
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
