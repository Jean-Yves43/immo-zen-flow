import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { PropertySearch } from "../components/PropertySearch";
import { PropertyGrid } from "../components/PropertyGrid";
import { useState } from "react";

const Louer = () => {
  const [filters, setFilters] = useState({
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