import { Heart, Bed, Bath, Maximize, Camera, MapPin } from "lucide-react";
import { Badge } from "../../../components/Badge";
import { useState, useEffect } from "react";

/**
 * Composant PropertyCard
 * ----------------------
 * Affiche une carte de bien immobilier avec :
 * - image (placeholder ici)
 * - informations clés (chambres, SDB, surface)
 * - prix, type
 * - badge "À la une"
 * - bouton favori
 */
export const PropertyCard = ({ property, delay = 0 }) => {
  // État local pour gérer le favori
  const [isFavorite, setIsFavorite] = useState(false);

  /**
   * Log au montage du composant
   * Utile pour vérifier les données reçues
   */
  useEffect(() => {
    console.log("📦 PropertyCard mounted");
    console.log("➡️ Property data:", property);
    console.log("⏱️ Animation delay:", delay);
  }, [property, delay]);

  /**
   * Gestion du clic sur le bouton favori
   */
  const handleToggleFavorite = () => {
    setIsFavorite((prev) => {
      const newValue = !prev;
      console.log(
        newValue
          ? `❤️ Property ${property.id} ajoutée aux favoris`
          : `💔 Property ${property.id} retirée des favoris`,
      );
      return newValue;
    });
  };

  return (
    <article
      className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-up border border-border/50"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* ================= IMAGE / VISUEL ================= */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Dégradé placeholder (image à remplacer plus tard) */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/30" />

        {/* Surface du bien */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
              <Maximize className="w-8 h-8" />
            </div>
            <span className="text-sm">{property.area}m²</span>
          </div>
        </div>

        {/* Overlay sombre au hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Nombre de photos */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 text-white px-2.5 py-1 rounded-lg text-sm backdrop-blur-sm">
          <Camera className="w-4 h-4" />
          <span>x{property.images}</span>
        </div>

        {/* Bouton favori */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
            isFavorite
              ? "bg-red-500 text-white"
              : "bg-white/90 text-muted-foreground hover:bg-white hover:text-red-500"
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
        </button>

        {/* Badge "À la une" */}
        {property.featured && (
          <Badge className="absolute bottom-3 left-3 bg-secondary text-secondary-foreground">
            À la une
          </Badge>
        )}

        {/* Overlay d'action */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-white/90 text-foreground px-4 py-2 rounded-lg font-medium shadow-lg">
            Cliquer pour explorer
          </span>
        </div>
      </div>

      {/* ================= CONTENU ================= */}
      <div className="p-5">
        {/* Infos rapides */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-primary" />
            <span>
              {property.bedrooms} Chambre{property.bedrooms > 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-primary" />
            <span>{property.bathrooms} SdB</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Maximize className="w-4 h-4 text-primary" />
            <span>{property.area}m²</span>
          </div>
        </div>

        {/* Titre */}
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {property.title}
        </h3>

        {/* Adresse */}
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <MapPin className="w-4 h-4" />
          {property.address}
        </p>

        {/* Prix & type */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Badge variant="outline" className="font-normal">
            {property.type}
          </Badge>

          <div className="text-right">
            <span className="text-2xl font-bold text-primary">
              {property.price}€
            </span>
            <span className="text-muted-foreground text-sm">/mois</span>
          </div>
        </div>
      </div>
    </article>
  );
};
