// src/features/gestionnaire-dashboard/components/SearchFilterBar.jsx
import { Search, Filter } from "lucide-react";
import { Card, CardContent } from "../../../components/Card";
import { Input } from "../../../components/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/Select";

export function SearchFilterBar({ 
  searchQuery, 
  onSearchChange, 
  filters = [],
  placeholder = "Rechercher..."
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={placeholder}
              className="pl-10" 
              value={searchQuery} 
              onChange={(e) => onSearchChange(e.target.value)} 
            />
          </div>
          {filters.map((filter, index) => (
            <Select 
              key={index}
              value={filter.value} 
              onValueChange={filter.onChange}
            >
              <SelectTrigger className={filter.width || "w-[180px]"}>
                {filter.showIcon && <Filter className="h-4 w-4 mr-2" />}
                <SelectValue placeholder={filter.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}