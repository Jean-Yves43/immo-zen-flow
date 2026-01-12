import { useState } from "react";
import {
  Euro,
  Calendar,
  CreditCard,
  Shield,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Badge } from "../../../components/Badge";
import { RadioGroup, RadioGroupItem } from "../../../components/RadioGroup";
import { Label } from "../../../components/Label";
import { toast } from "../../../hooks/UseToast";

export default function TenantPaiements() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsPaid(true);
    toast({
      title: "Paiement effectué ! 🎉",
      description: "Votre loyer de janvier 2024 a été payé avec succès.",
    });
  };

  if (isPaid) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-border/50 shadow-large overflow-hidden">
          <div className="bg-gradient-to-br from-success to-secondary p-8 text-center text-white">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 animate-scale-in">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold mb-2 animate-fade-up">
              Paiement réussi !
            </h1>
            <p className="text-white/90 animate-fade-up animation-delay-100">
              Merci pour votre paiement
            </p>
          </div>
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-2 animate-fade-up animation-delay-200">
              <p className="text-3xl font-bold text-foreground">850,00 €</p>
              <p className="text-muted-foreground">Loyer - Février 2024</p>
            </div>
            <div className="space-y-3 animate-fade-up animation-delay-300">
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Référence</span>
                <span className="font-medium">#PAY-2024-0125</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">
                  {new Date().toLocaleDateString("fr-FR")}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Méthode</span>
                <span className="font-medium">Carte bancaire</span>
              </div>
            </div>
            <div className="flex gap-3 animate-fade-up animation-delay-400">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsPaid(false)}
              >
                Retour
              </Button>
              <Button className="flex-1 bg-secondary hover:bg-secondary-light">
                Télécharger le reçu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Paiements</h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos paiements de loyer en toute sécurité
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Summary */}
        <Card className="lg:col-span-2 border-border/50 shadow-soft animate-fade-up">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Euro className="w-5 h-5 text-secondary" />
              Récapitulatif du paiement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Amount Card */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/80">Montant à payer</span>
                <Badge className="bg-white/20 text-white hover:bg-white/30">
                  Février 2024
                </Badge>
              </div>
              <p className="text-4xl font-bold mb-2">850,00 €</p>
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="w-4 h-4" />
                <span>Échéance : 1er février 2024</span>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Loyer de base</span>
                <span className="font-medium">750,00 €</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Charges</span>
                <span className="font-medium">100,00 €</span>
              </div>
              <div className="flex justify-between py-3 text-lg">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-primary">850,00 €</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">
                Méthode de paiement
              </h3>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-3"
              >
                <div
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    paymentMethod === "card"
                      ? "border-secondary bg-secondary/5"
                      : "border-border hover:border-secondary/50"
                  }`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <RadioGroupItem value="card" id="card" />
                  <Label
                    htmlFor="card"
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Carte bancaire</p>
                      <p className="text-sm text-muted-foreground">
                        Visa, Mastercard, CB
                      </p>
                    </div>
                  </Label>
                </div>
                <div
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    paymentMethod === "sepa"
                      ? "border-secondary bg-secondary/5"
                      : "border-border hover:border-secondary/50"
                  }`}
                  onClick={() => setPaymentMethod("sepa")}
                >
                  <RadioGroupItem value="sepa" id="sepa" />
                  <Label
                    htmlFor="sepa"
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Euro className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium">Virement SEPA</p>
                      <p className="text-sm text-muted-foreground">
                        Prélèvement automatique
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Pay Button */}
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full h-14 text-lg bg-secondary hover:bg-secondary-light shadow-glow transition-all hover:scale-[1.02]"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Traitement en cours...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Payer maintenant
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Security Info */}
        <Card className="border-border/50 shadow-soft h-fit animate-fade-up animation-delay-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5 text-success" />
              Paiement sécurisé
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Vos informations de paiement sont protégées par un cryptage SSL
              256 bits.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                <span>Transactions cryptées</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                <span>Données protégées</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                <span>Confirmation instantanée</span>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Propulsé par Stripe
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}