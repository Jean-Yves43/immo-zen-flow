import { Search, MapPin, Bed, Euro, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyFilters } from "@/pages/Louer";

interface PropertySearchProps {
  filters: PropertyFilters;
  setFilters: (filters: PropertyFilters) => void;
}

const locations = [
  "Paris",
  "Lyon",
  "Marseille",
  "Bordeaux",
  "Toulouse",
  "Nantes",
  "Nice",
  "Strasbourg",
  "Montpellier",
  "Lille",
];

const propertyTypes = [
  "Appartement",
  "Maison",
  "Studio",
  "Loft",
  "Duplex",
  "Villa",
];

export const PropertySearch = ({ filters, setFilters }: PropertySearchProps) => {
  const updateFilter = (key: keyof PropertyFilters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <section className="relative pt-24 pb-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary opacity-95" />
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Recherche de Biens
          </h1>
          <p className="text-white/80 text-lg">
            Trouvez le logement idéal parmi notre sélection de biens
          </p>
        </div>

        {/* Search Filters */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Location */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Localisation
              </label>
              <Select
                value={filters.location}
                onValueChange={(value) => updateFilter("location", value)}
              >
                <SelectTrigger className="bg-white/90 border-0 h-12">
                  <SelectValue placeholder="Toutes les villes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc.toLowerCase()}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Property Type */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium flex items-center gap-2">
                <Home className="w-4 h-4" />
                Type de bien
              </label>
              <Select
                value={filters.propertyType}
                onValueChange={(value) => updateFilter("propertyType", value)}
              >
                <SelectTrigger className="bg-white/90 border-0 h-12">
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bedrooms */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium flex items-center gap-2">
                <Bed className="w-4 h-4" />
                Chambres
              </label>
              <div className="flex gap-2">
                <Select
                  value={filters.bedroomsMin}
                  onValueChange={(value) => updateFilter("bedroomsMin", value)}
                >
                  <SelectTrigger className="bg-white/90 border-0 h-12">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Min</SelectItem>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filters.bedroomsMax}
                  onValueChange={(value) => updateFilter("bedroomsMax", value)}
                >
                  <SelectTrigger className="bg-white/90 border-0 h-12">
                    <SelectValue placeholder="Max" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Max</SelectItem>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium flex items-center gap-2">
                <Euro className="w-4 h-4" />
                Prix / mois
              </label>
              <div className="flex gap-2">
                <Select
                  value={filters.priceMin}
                  onValueChange={(value) => updateFilter("priceMin", value)}
                >
                  <SelectTrigger className="bg-white/90 border-0 h-12">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Min</SelectItem>
                    {[300, 500, 700, 1000, 1500, 2000].map((price) => (
                      <SelectItem key={price} value={price.toString()}>
                        {price}€
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filters.priceMax}
                  onValueChange={(value) => updateFilter("priceMax", value)}
                >
                  <SelectTrigger className="bg-white/90 border-0 h-12">
                    <SelectValue placeholder="Max" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Max</SelectItem>
                    {[500, 700, 1000, 1500, 2000, 3000, 5000].map((price) => (
                      <SelectItem key={price} value={price.toString()}>
                        {price}€
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <Button className="w-full h-12 bg-secondary hover:bg-secondary-light text-secondary-foreground font-semibold gap-2 shadow-lg">
                <Search className="w-5 h-5" />
                Rechercher
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
