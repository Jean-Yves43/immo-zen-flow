import { Heart, Bed, Bath, Maximize, Camera, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Property {
  id: number;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: number;
  type: string;
  featured: boolean;
  forSale?: boolean;
}

interface PropertyCardProps {
  property: Property;
  delay?: number;
  isSale?: boolean;
}

export const PropertyCard = ({ property, delay = 0, isSale = false }: PropertyCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/property/${property.id}`);
  };

  return (
    <article
      onClick={handleCardClick}
      className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-up border border-border/50 cursor-pointer"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Placeholder gradient - replace with real image */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
              <Maximize className="w-8 h-8" />
            </div>
            <span className="text-sm">{property.area}m²</span>
          </div>
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Photo count badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 text-white px-2.5 py-1 rounded-lg text-sm backdrop-blur-sm">
          <Camera className="w-4 h-4" />
          <span>x{property.images}</span>
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
            isFavorite
              ? "bg-red-500 text-white"
              : "bg-white/90 text-muted-foreground hover:bg-white hover:text-red-500"
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
        </button>

        {/* Featured badge */}
        {property.featured && (
          <Badge className="absolute bottom-3 left-3 bg-secondary text-secondary-foreground">
            À la une
          </Badge>
        )}

        {/* Click to explore overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-white/90 text-foreground px-4 py-2 rounded-lg font-medium shadow-lg">
            Cliquer pour explorer
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Property details */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-primary" />
            <span>{property.bedrooms} Chambre{property.bedrooms > 1 ? "s" : ""}</span>
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

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {property.title}
        </h3>

        {/* Address */}
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <MapPin className="w-4 h-4" />
          {property.address}
        </p>

        {/* Price and Type */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Badge variant="outline" className="font-normal">
            {property.type}
          </Badge>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">
              {isSale ? `${property.price.toLocaleString()}€` : `${property.price}€`}
            </span>
            {!isSale && <span className="text-muted-foreground text-sm">/mois</span>}
          </div>
        </div>
      </div>
    </article>
  );
};
