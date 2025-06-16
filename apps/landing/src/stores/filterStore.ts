// Zustand store for filter state management
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DateRange {
  start: Date;
  end: Date;
}

export interface FilterState {
  // Date range filter
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;

  // Category filters
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  toggleCategory: (category: string) => void;

  // Region filters
  selectedRegions: string[];
  setSelectedRegions: (regions: string[]) => void;
  toggleRegion: (region: string) => void;

  // Brand filters
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  toggleBrand: (brand: string) => void;

  // Price range filter
  priceRange: { min: number; max: number };
  setPriceRange: (range: { min: number; max: number }) => void;

  // Search filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Filter presets
  savedFilters: Array<{
    name: string;
    filters: {
      dateRange: DateRange;
      categories: string[];
      regions: string[];
      brands: string[];
      priceRange: { min: number; max: number };
      searchQuery: string;
    };
  }>;
  saveFilterPreset: (name: string) => void;
  loadFilterPreset: (preset: any) => void;
  deleteFilterPreset: (name: string) => void;

  // Clear functions
  clearAllFilters: () => void;
  clearCategoryFilters: () => void;
  clearRegionFilters: () => void;
  clearBrandFilters: () => void;

  // Active filter count
  getActiveFilterCount: () => number;

  // Filter validation
  isValidDateRange: () => boolean;
  isValidPriceRange: () => boolean;
}

const defaultDateRange: DateRange = {
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  end: new Date()
};

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      // Initial state
      dateRange: defaultDateRange,
      selectedCategories: [],
      selectedRegions: [],
      selectedBrands: [],
      priceRange: { min: 0, max: 10000 },
      searchQuery: '',
      savedFilters: [],

      // Date range actions
      setDateRange: (range) => set({ dateRange: range }),

      // Category actions
      setSelectedCategories: (categories) => set({ selectedCategories: categories }),
      toggleCategory: (category) => set((state) => ({
        selectedCategories: state.selectedCategories.includes(category)
          ? state.selectedCategories.filter(c => c !== category)
          : [...state.selectedCategories, category]
      })),

      // Region actions
      setSelectedRegions: (regions) => set({ selectedRegions: regions }),
      toggleRegion: (region) => set((state) => ({
        selectedRegions: state.selectedRegions.includes(region)
          ? state.selectedRegions.filter(r => r !== region)
          : [...state.selectedRegions, region]
      })),

      // Brand actions
      setSelectedBrands: (brands) => set({ selectedBrands: brands }),
      toggleBrand: (brand) => set((state) => ({
        selectedBrands: state.selectedBrands.includes(brand)
          ? state.selectedBrands.filter(b => b !== brand)
          : [...state.selectedBrands, brand]
      })),

      // Price range actions
      setPriceRange: (range) => set({ priceRange: range }),

      // Search actions
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Filter preset actions
      saveFilterPreset: (name) => {
        const state = get();
        const newPreset = {
          name,
          filters: {
            dateRange: state.dateRange,
            categories: state.selectedCategories,
            regions: state.selectedRegions,
            brands: state.selectedBrands,
            priceRange: state.priceRange,
            searchQuery: state.searchQuery
          }
        };
        
        set((state) => ({
          savedFilters: [...state.savedFilters.filter(p => p.name !== name), newPreset]
        }));
      },

      loadFilterPreset: (preset) => set({
        dateRange: preset.filters.dateRange,
        selectedCategories: preset.filters.categories,
        selectedRegions: preset.filters.regions,
        selectedBrands: preset.filters.brands,
        priceRange: preset.filters.priceRange,
        searchQuery: preset.filters.searchQuery
      }),

      deleteFilterPreset: (name) => set((state) => ({
        savedFilters: state.savedFilters.filter(p => p.name !== name)
      })),

      // Clear actions
      clearAllFilters: () => set({
        dateRange: defaultDateRange,
        selectedCategories: [],
        selectedRegions: [],
        selectedBrands: [],
        priceRange: { min: 0, max: 10000 },
        searchQuery: ''
      }),

      clearCategoryFilters: () => set({ selectedCategories: [] }),
      clearRegionFilters: () => set({ selectedRegions: [] }),
      clearBrandFilters: () => set({ selectedBrands: [] }),

      // Computed values
      getActiveFilterCount: () => {
        const state = get();
        let count = 0;
        
        // Check if date range is different from default
        if (state.dateRange.start.getTime() !== defaultDateRange.start.getTime() ||
            state.dateRange.end.getTime() !== defaultDateRange.end.getTime()) {
          count++;
        }
        
        if (state.selectedCategories.length > 0) count++;
        if (state.selectedRegions.length > 0) count++;
        if (state.selectedBrands.length > 0) count++;
        if (state.priceRange.min > 0 || state.priceRange.max < 10000) count++;
        if (state.searchQuery.trim().length > 0) count++;
        
        return count;
      },

      // Validation
      isValidDateRange: () => {
        const { dateRange } = get();
        return dateRange.start < dateRange.end && dateRange.start <= new Date();
      },

      isValidPriceRange: () => {
        const { priceRange } = get();
        return priceRange.min >= 0 && priceRange.max > priceRange.min;
      }
    }),
    {
      name: 'scout-filter-storage',
      partialize: (state) => ({
        dateRange: state.dateRange,
        selectedCategories: state.selectedCategories,
        selectedRegions: state.selectedRegions,
        selectedBrands: state.selectedBrands,
        priceRange: state.priceRange,
        searchQuery: state.searchQuery,
        savedFilters: state.savedFilters
      })
    }
  )
);

// Convenience hooks for specific filter types
export const useDateRangeFilter = () => {
  const dateRange = useFilterStore(state => state.dateRange);
  const setDateRange = useFilterStore(state => state.setDateRange);
  const isValid = useFilterStore(state => state.isValidDateRange);
  
  return { dateRange, setDateRange, isValid };
};

export const useCategoryFilter = () => {
  const selectedCategories = useFilterStore(state => state.selectedCategories);
  const setSelectedCategories = useFilterStore(state => state.setSelectedCategories);
  const toggleCategory = useFilterStore(state => state.toggleCategory);
  const clearCategories = useFilterStore(state => state.clearCategoryFilters);
  
  return { selectedCategories, setSelectedCategories, toggleCategory, clearCategories };
};

export const useRegionFilter = () => {
  const selectedRegions = useFilterStore(state => state.selectedRegions);
  const setSelectedRegions = useFilterStore(state => state.setSelectedRegions);
  const toggleRegion = useFilterStore(state => state.toggleRegion);
  const clearRegions = useFilterStore(state => state.clearRegionFilters);
  
  return { selectedRegions, setSelectedRegions, toggleRegion, clearRegions };
};

export const useBrandFilter = () => {
  const selectedBrands = useFilterStore(state => state.selectedBrands);
  const setSelectedBrands = useFilterStore(state => state.setSelectedBrands);
  const toggleBrand = useFilterStore(state => state.toggleBrand);
  const clearBrands = useFilterStore(state => state.clearBrandFilters);
  
  return { selectedBrands, setSelectedBrands, toggleBrand, clearBrands };
};

export const usePriceRangeFilter = () => {
  const priceRange = useFilterStore(state => state.priceRange);
  const setPriceRange = useFilterStore(state => state.setPriceRange);
  const isValid = useFilterStore(state => state.isValidPriceRange);
  
  return { priceRange, setPriceRange, isValid };
};

export const useSearchFilter = () => {
  const searchQuery = useFilterStore(state => state.searchQuery);
  const setSearchQuery = useFilterStore(state => state.setSearchQuery);
  
  return { searchQuery, setSearchQuery };
};

export const useFilterPresets = () => {
  const savedFilters = useFilterStore(state => state.savedFilters);
  const saveFilterPreset = useFilterStore(state => state.saveFilterPreset);
  const loadFilterPreset = useFilterStore(state => state.loadFilterPreset);
  const deleteFilterPreset = useFilterStore(state => state.deleteFilterPreset);
  
  return { savedFilters, saveFilterPreset, loadFilterPreset, deleteFilterPreset };
};