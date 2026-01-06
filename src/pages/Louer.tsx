import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PropertySearch } from "@/components/properties/PropertySearch";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { useState } from "react";

export interface PropertyFilters {
  location: string;
  bedroomsMin: string;
  bedroomsMax: string;
  priceMin: string;
  priceMax: string;
  propertyType: string;
}

const Louer = () => {
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
        <PropertySearch filters={filters} setFilters={setFilters} />
        <PropertyGrid filters={filters} sortBy={sortBy} setSortBy={setSortBy} />
      </main>
      <Footer />
    </div>
  );
};

export default Louer;
