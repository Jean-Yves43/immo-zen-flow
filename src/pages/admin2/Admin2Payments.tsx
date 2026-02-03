import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  DollarSign,
  Wallet,
  Key,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Settings,
  Shield,
} from "lucide-react";

const paymentMethods = [
  { id: 1, name: "Carte Bancaire (Stripe)", type: "stripe", status: "active", transactions: 12450, volume: "€1,245,000", fee: "2.9% + 0.30€" },
  { id: 2, name: "PayPal", type: "paypal", status: "inactive", transactions: 0, volume: "€0", fee: "3.4% + 0.35€" },
  { id: 3, name: "Virement Bancaire", type: "bank", status: "active", transactions: 3420, volume: "€890,000", fee: "0.5€/transaction" },
  { id: 4, name: "Prélèvement SEPA", type: "sepa", status: "active", transactions: 8920, volume: "€678,000", fee: "0.35€/transaction" },
];

const transactions = [
  { id: "TXN001", date: "2024-01-15 14:32", user: "Jean Dupont", amount: 1250, method: "Carte Bancaire", status: "completed" },
  { id: "TXN002", date: "2024-01-15 13:15", user: "Marie Martin", amount: 890, method: "Virement", status: "completed" },
  { id: "TXN003", date: "2024-01-15 12:45", user: "Pierre Durand", amount: 1500, method: "Prélèvement", status: "pending" },
  { id: "TXN004", date: "2024-01-15 11:20", user: "Sophie Bernard", amount: 2100, method: "Carte Bancaire", status: "completed" },
  { id: "TXN005", date: "2024-01-15 10:05", user: "Luc Petit", amount: 750, method: "Carte Bancaire", status: "failed" },
];

export default function Admin2Payments() {
  const [showApiKeys, setShowApiKeys] = useState<{ [key: string]: boolean }>({});
  const [isAddMethodOpen, setIsAddMethodOpen] = useState(false);
  const [isConfigureApiOpen, setIsConfigureApiOpen] = useState(false);

  const toggleApiKey = (id: string) => {
    setShowApiKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestion des Paiements</h1>
          <p className="text-slate-400 mt-1">Gérez les moyens de paiement et les transactions</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isConfigureApiOpen} onOpenChange={setIsConfigureApiOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-slate-700 gap-2">
                <Key className="w-4 h-4" />
                Configurer API
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Configuration des API de paiement</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                {/* Stripe */}
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Stripe</p>
                        <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">Connecté</Badge>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">Clé publique</label>
                      <Input className="bg-slate-900 border-slate-700 font-mono text-sm" placeholder="pk_live_..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">Clé secrète</label>
                      <div className="flex gap-2">
                        <Input
                          className="bg-slate-900 border-slate-700 font-mono text-sm"
                          type={showApiKeys["stripe"] ? "text" : "password"}
                          placeholder="sk_live_..."
                        />
                        <Button variant="ghost" size="icon" onClick={() => toggleApiKey("stripe")}>
                          {showApiKeys["stripe"] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">Webhook Secret</label>
                      <Input className="bg-slate-900 border-slate-700 font-mono text-sm" placeholder="whsec_..." />
                    </div>
                  </div>
                </div>

                {/* PayPal */}
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">PayPal</p>
                        <Badge className="bg-slate-500/20 text-slate-400 text-xs">Non connecté</Badge>
                      </div>
                    </div>
                    <Switch />
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">Client ID</label>
                      <Input className="bg-slate-900 border-slate-700 font-mono text-sm" placeholder="Client ID PayPal" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">Client Secret</label>
                      <Input className="bg-slate-900 border-slate-700 font-mono text-sm" type="password" placeholder="Client Secret" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" className="border-slate-700" onClick={() => setIsConfigureApiOpen(false)}>
                  Annuler
                </Button>
                <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500">
                  Sauvegarder
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddMethodOpen} onOpenChange={setIsAddMethodOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 gap-2">
                <Plus className="w-4 h-4" />
                Ajouter méthode
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle>Ajouter un moyen de paiement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Type de paiement</label>
                  <Select>
                    <SelectTrigger className="bg-slate-800 border-slate-700">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="card">Carte Bancaire</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank">Virement Bancaire</SelectItem>
                      <SelectItem value="sepa">Prélèvement SEPA</SelectItem>
                      <SelectItem value="crypto">Crypto-monnaie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Nom affiché</label>
                  <Input className="bg-slate-800 border-slate-700" placeholder="Carte Bancaire (Visa, Mastercard)" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Frais de transaction</label>
                  <Input className="bg-slate-800 border-slate-700" placeholder="2.9% + 0.30€" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <span className="text-slate-300">Activer immédiatement</span>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" className="border-slate-700" onClick={() => setIsAddMethodOpen(false)}>
                  Annuler
                </Button>
                <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500">
                  Ajouter
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Volume total</p>
                <p className="text-2xl font-bold text-white">€2,813,000</p>
                <div className="flex items-center gap-1 mt-1 text-emerald-400">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm">+12.5%</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/20">
                <DollarSign className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Transactions</p>
                <p className="text-2xl font-bold text-white">24,790</p>
                <div className="flex items-center gap-1 mt-1 text-emerald-400">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm">+8.3%</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/20">
                <RefreshCw className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Taux de réussite</p>
                <p className="text-2xl font-bold text-white">98.5%</p>
                <div className="flex items-center gap-1 mt-1 text-emerald-400">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm">+0.3%</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/20">
                <CheckCircle className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Échecs</p>
                <p className="text-2xl font-bold text-white">372</p>
                <div className="flex items-center gap-1 mt-1 text-red-400">
                  <ArrowDownRight className="w-4 h-4" />
                  <span className="text-sm">-15%</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-red-500/20">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="methods" className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="methods" className="data-[state=active]:bg-emerald-500">Moyens de paiement</TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-emerald-500">Transactions récentes</TabsTrigger>
        </TabsList>

        {/* Payment Methods */}
        <TabsContent value="methods">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-4 text-slate-400 font-medium">Méthode</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Type</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Statut</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Transactions</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Volume</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Frais</th>
                      <th className="text-right p-4 text-slate-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentMethods.map((method) => (
                      <tr key={method.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              method.type === "stripe" ? "bg-purple-500/20" :
                              method.type === "paypal" ? "bg-blue-500/20" :
                              method.type === "bank" ? "bg-emerald-500/20" :
                              "bg-orange-500/20"
                            }`}>
                              <CreditCard className={`w-4 h-4 ${
                                method.type === "stripe" ? "text-purple-400" :
                                method.type === "paypal" ? "text-blue-400" :
                                method.type === "bank" ? "text-emerald-400" :
                                "text-orange-400"
                              }`} />
                            </div>
                            <span className="text-white font-medium">{method.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300 capitalize">{method.type}</td>
                        <td className="p-4">
                          <Badge className={method.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-400"}>
                            {method.status === "active" ? "Actif" : "Inactif"}
                          </Badge>
                        </td>
                        <td className="p-4 text-white">{method.transactions.toLocaleString()}</td>
                        <td className="p-4 text-emerald-400 font-medium">{method.volume}</td>
                        <td className="p-4 text-slate-300">{method.fee}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Transactions */}
        <TabsContent value="transactions">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-4 text-slate-400 font-medium">ID</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Date</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Utilisateur</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Méthode</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Montant</th>
                      <th className="text-left p-4 text-slate-400 font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="p-4 text-slate-300 font-mono text-sm">{tx.id}</td>
                        <td className="p-4 text-slate-400">{tx.date}</td>
                        <td className="p-4 text-white">{tx.user}</td>
                        <td className="p-4 text-slate-300">{tx.method}</td>
                        <td className="p-4 text-emerald-400 font-medium">€{tx.amount.toLocaleString()}</td>
                        <td className="p-4">
                          <Badge className={
                            tx.status === "completed" ? "bg-emerald-500/20 text-emerald-400" :
                            tx.status === "pending" ? "bg-amber-500/20 text-amber-400" :
                            "bg-red-500/20 text-red-400"
                          }>
                            {tx.status === "completed" ? "Complété" : tx.status === "pending" ? "En attente" : "Échoué"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
