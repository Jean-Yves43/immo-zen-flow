import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PropertySearch } from "@/components/properties/PropertySearch";
import { PropertyGridSale } from "@/components/properties/PropertyGridSale";
import { useState } from "react";

export interface PropertyFilters {
  location: string;
  bedroomsMin: string;
  bedroomsMax: string;
  priceMin: string;
  priceMax: string;
  propertyType: string;
}

const Vendre = () => {
  const [filters, setFilters] = useState<PropertyFilters>({
    location: "",
    bedroomsMin: "",
    bedroomsMax: "",
    priceMin: "",
    priceMax: "",
    propertyType: "",
  });
  const [sortBy, setSortBy] = useState("newest");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Section for Sales */}
        <section className="relative pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Biens à <span className="text-secondary">vendre</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trouvez la propriété de vos rêves parmi notre sélection de biens à vendre
            </p>
          </div>
        </section>
        <PropertySearch filters={filters} setFilters={setFilters} />
        <PropertyGridSale filters={filters} sortBy={sortBy} setSortBy={setSortBy} />
      </main>
      <Footer />
    </div>
  );
};

export default Vendre;
