"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { menuData } from "../../../data/navbarData";

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  isExpanded,
  setIsExpanded,
}) => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [animatedText, setAnimatedText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null);
  const searchBarRef = useRef(null);

  // Memoized placeholder texts to keep reference stable
  const placeholderTexts = useMemo(
    () => [
      "Search for handbags...",
      "Find your perfect fragrance...",
      "Discover luxury accessories...",
      "Explore travel essentials...",
      "Search for jewelry...",
    ],
    []
  );

  // Popular searches and trending items
  const popularSearches = useMemo(
    () => ["Handbags", "Perfume", "Wallets", "Travel Bags", "Jewelry", "Belts"],
    []
  );

  const trendingCategories = useMemo(
    () => [
      {
        label: "Women's Handbags",
        image: "/images/relot front page img 13-6/1st setion women_s bag.png",
        link: "/products/?category=women&subCategory=handbags",
        tag: "Trending",
      },
      {
        label: "Men's Travel",
        image: "/images/relot front page img 13-6/1st sec men_s bag.avif",
        link: "/products/?category=men&subCategory=travel",
        tag: "Popular",
      },
      {
        label: "Fragrances",
        image:
          "/images/relot front page img 13-6/Women_s Wallet and Small Leather Good.avif",
        link: "/products/?category=fragrances",
        tag: "New",
      },
      {
        label: "Women's Jewelry",
        image: "/images/relot front page img 13-6/topbnr3.jpg",
        link: "/products/?category=women&subCategory=accessories&childCategory=jewelry",
        tag: "Hot",
      },
    ],
    []
  );

  // Animated placeholder text rotation - Fixed
  useEffect(() => {
    if (!isExpanded) {
      const interval = setInterval(() => {
        setTextIndex((prev) => (prev + 1) % placeholderTexts.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [isExpanded, placeholderTexts]);

  // Enhanced typing animation effect - Fixed
  useEffect(() => {
    if (!isExpanded) {
      // Ensure textIndex is within bounds
      const safeIndex =
        textIndex >= 0 && textIndex < placeholderTexts.length ? textIndex : 0;
      const currentText = placeholderTexts[safeIndex];

      if (!currentText || typeof currentText !== "string") {
        console.warn("Invalid placeholder text:", currentText);
        return;
      }

      setIsTyping(true);
      setAnimatedText("");

      // Typing effect
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i <= currentText.length) {
          setAnimatedText(currentText.slice(0, i));
          i++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);

          // Hold the text for a moment before starting deletion
          const deleteTimeout = setTimeout(() => {
            let j = currentText.length;
            const deleteInterval = setInterval(() => {
              if (j >= 0) {
                setAnimatedText(currentText.slice(0, j));
                j--;
              } else {
                clearInterval(deleteInterval);
              }
            }, 50);
          }, 1500);

          // Return cleanup function
          return () => clearTimeout(deleteTimeout);
        }
      }, 80);

      return () => clearInterval(typeInterval);
    }
  }, [textIndex, isExpanded, placeholderTexts]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.warn("Failed to parse recent searches:", error);
        setRecentSearches([]);
      }
    }
  }, []);

  // Generate search suggestions from menu data
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const suggestions = [];

      // Search through main categories
      menuData.forEach((category) => {
        if (category.label.toLowerCase().includes(searchQuery.toLowerCase())) {
          suggestions.push({
            type: "category",
            label: category.label,
            link: category.link,
            image:
              category.submenu?.[0]?.image ||
              "/images/relot front page img 13-6/topbnr3.jpg",
          });
        }

        // Search through subcategories
        category.submenu?.forEach((sub) => {
          if (sub.label.toLowerCase().includes(searchQuery.toLowerCase())) {
            suggestions.push({
              type: "subcategory",
              label: sub.label,
              category: category.label,
              link: sub.link,
              image:
                sub.image || "/images/relot front page img 13-6/topbnr3.jpg",
            });
          }

          // Search through child categories
          sub.submenu?.forEach((child) => {
            if (child.label.toLowerCase().includes(searchQuery.toLowerCase())) {
              suggestions.push({
                type: "product",
                label: child.label,
                category: `${category.label} > ${sub.label}`,
                link: child.link,
                image:
                  sub.image || "/images/relot front page img 13-6/topbnr3.jpg",
              });
            }
          });
        });
      });

      setFilteredSuggestions(suggestions.slice(0, 6));
    } else {
      setFilteredSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearch = (query = searchQuery, link = null) => {
    if (link) {
      router.push(link);
    } else if (query.trim()) {
      router.push(`/products/?search=${encodeURIComponent(query.trim())}`);
    }

    // Save to recent searches
    try {
      const newRecentSearches = [
        query,
        ...recentSearches.filter((s) => s !== query),
      ].slice(0, 5);
      setRecentSearches(newRecentSearches);
      localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));
    } catch (error) {
      console.warn("Failed to save recent searches:", error);
    }

    closeSearch();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("recentSearches");
    } catch (error) {
      console.warn("Failed to clear recent searches:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      closeSearch();
    }
  };

  const expandSearch = () => {
    setIsClosing(false);
    setIsExpanded(true);
    // Focus input after animation completes
    setTimeout(() => inputRef.current?.focus(), 600);
  };

  const closeSearch = () => {
    setIsClosing(true);
    // Delay the actual close to allow animation
    setTimeout(() => {
      setIsExpanded(false);
      setIsClosing(false);
      setSearchQuery("");
    }, 400);
  };

  useEffect(() => {
    if (isExpanded) {
      // Lock scroll
      document.body.style.overflow = "hidden";
    } else {
      // Unlock scroll
      document.body.style.overflow = "";
    }
    // Cleanup in case the component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, [isExpanded]);

  if (isExpanded) {
    return (
      <>
        {/* Enhanced Backdrop with denser blur */}
        <div
          className={`fixed inset-0 z-40 transition-all duration-500 ease-out h-full${
            isClosing ? "opacity-0" : "opacity-100"
          }`}
          style={{
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(25px) saturate(120%)",
            WebkitBackdropFilter: "blur(25px) saturate(120%)",
          }}
          onClick={closeSearch}
        />

        {/* Search Modal with enhanced transitions */}
        <div
          className={`fixed top-0 left-0 w-full z-50 shadow-2xl transition-all duration-600 ease-out transform h-screen${
            isClosing
              ? "-translate-y-full opacity-0 scale-95"
              : "translate-y-0 opacity-100 scale-100"
          }`}
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(30px) saturate(150%)",
            WebkitBackdropFilter: "blur(30px) saturate(150%)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="container mx-auto px-4 py-8">
            {/* Search Header with enhanced animations */}
            <div className="flex items-center gap-6 mb-8">
              <div className="flex-1 relative">
                <form onSubmit={handleSubmit} className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="What are you looking for?"
                    className="w-full text-2xl px-8 py-6 pr-20 rounded-2xl focus:outline-none transition-all duration-500 text-white placeholder-white/60 font-medium shadow-2xl border-2"
                    style={{
                      background: "rgba(255, 255, 255, 0.25)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      borderColor: "rgba(255, 255, 255, 0.4)",
                    }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    type="submit"
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-red-300 transition-all duration-300 hover:scale-125 hover:rotate-12"
                  >
                    <Search className="h-7 w-7" />
                  </button>
                </form>
              </div>
              <button
                onClick={closeSearch}
                className="p-4 rounded-2xl transition-all duration-300 shadow-2xl hover:scale-110 border-2"
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                }}
              >
                <X className="h-7 w-7 text-white/80 hover:text-red-300 transition-colors duration-300" />
              </button>
            </div>

            {/* Content Area with enhanced visibility */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-8 overflow-hidden">
              {/* Search Results / Suggestions */}
              <div className="lg:col-span-2 space-y-6">
                {searchQuery.trim() ? (
                  <div
                    className={`rounded-2xl p-8 border shadow-2xl transition-all duration-700 ${
                      isClosing
                        ? "opacity-0 translate-y-4"
                        : "opacity-100 translate-y-0"
                    }`}
                    style={{
                      background: "rgba(255, 255, 255, 0.2)",
                      backdropFilter: "blur(25px)",
                      WebkitBackdropFilter: "blur(25px)",
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      animationDelay: "100ms",
                    }}
                  >
                    <h3 className="text-2xl font-bold mb-6 text-white drop-shadow-lg">
                      Search Results
                    </h3>
                    {filteredSuggestions.length > 0 ? (
                      <div className="space-y-4">
                        {filteredSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            onClick={() =>
                              handleSearch(suggestion.label, suggestion.link)
                            }
                            className={`flex items-center gap-6 p-5 rounded-xl cursor-pointer transition-all duration-400 group border shadow-xl transform ${
                              isClosing
                                ? "opacity-0 translate-x-8"
                                : "opacity-100 translate-x-0 hover:-translate-y-1 hover:scale-[1.02]"
                            }`}
                            style={{
                              background: "rgba(255, 255, 255, 0.25)",
                              backdropFilter: "blur(20px)",
                              WebkitBackdropFilter: "blur(20px)",
                              borderColor: "rgba(255, 255, 255, 0.4)",
                              animationDelay: `${200 + index * 100}ms`,
                            }}
                          >
                            <div className="w-16 h-16 relative flex-shrink-0 rounded-xl overflow-hidden bg-white/10 shadow-lg">
                              <Image
                                src={suggestion.image}
                                alt={suggestion.label}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                unoptimized
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-white group-hover:text-red-200 transition-colors duration-300 drop-shadow">
                                {suggestion.label}
                              </h4>
                              {suggestion.category && (
                                <p className="text-sm text-white/80 font-medium drop-shadow">
                                  {suggestion.category}
                                </p>
                              )}
                              <span className="inline-block mt-2 text-xs bg-red-500/90 text-white px-3 py-1 rounded-full font-bold shadow-lg">
                                {suggestion.type}
                              </span>
                            </div>
                            <Search className="h-5 w-5 text-white/70 group-hover:text-red-200 transition-colors duration-300" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        className="text-center py-12 rounded-xl border shadow-lg"
                        style={{
                          background: "rgba(255, 255, 255, 0.15)",
                          backdropFilter: "blur(20px)",
                          WebkitBackdropFilter: "blur(20px)",
                          borderColor: "rgba(255, 255, 255, 0.3)",
                        }}
                      >
                        <Search className="h-16 w-16 mx-auto mb-4 text-white/40" />
                        <p className="text-xl font-bold text-white drop-shadow-lg">
                          No results found for "{searchQuery}"
                        </p>
                        <p className="text-sm mt-2 text-white/80 font-medium drop-shadow">
                          Try different keywords or browse categories below
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Trending Categories */}
                    <div
                      className={`rounded-2xl p-8 border shadow-2xl transition-all duration-700 ${
                        isClosing
                          ? "opacity-0 translate-y-4"
                          : "opacity-100 translate-y-0"
                      }`}
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(249, 115, 22, 0.25), rgba(236, 72, 153, 0.25))",
                        backdropFilter: "blur(25px)",
                        WebkitBackdropFilter: "blur(25px)",
                        borderColor: "rgba(239, 68, 68, 0.4)",
                        animationDelay: "100ms",
                      }}
                    >
                      <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3 drop-shadow-lg">
                        <TrendingUp className="h-6 w-6 text-red-300" />
                        Trending Categories
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {trendingCategories.map((category, index) => (
                          <div
                            key={index}
                            onClick={() =>
                              handleSearch(category.label, category.link)
                            }
                            className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-400 border shadow-xl transform ${
                              isClosing
                                ? "opacity-0 translate-y-4"
                                : "opacity-100 translate-y-0 hover:-translate-y-2 hover:scale-105"
                            }`}
                            style={{
                              background: "rgba(255, 255, 255, 0.2)",
                              backdropFilter: "blur(20px)",
                              WebkitBackdropFilter: "blur(20px)",
                              borderColor: "rgba(255, 255, 255, 0.3)",
                              animationDelay: `${200 + index * 100}ms`,
                            }}
                          >
                            <div className="relative h-28 p-5">
                              <div className="absolute top-3 right-3">
                                <span
                                  className={`text-xs px-3 py-1 rounded-full text-white font-bold shadow-lg ${
                                    category.tag === "Trending"
                                      ? "bg-red-500/90"
                                      : category.tag === "Popular"
                                      ? "bg-orange-500/90"
                                      : category.tag === "New"
                                      ? "bg-green-500/90"
                                      : "bg-purple-500/90"
                                  }`}
                                >
                                  {category.tag}
                                </span>
                              </div>
                              <h4 className="text-lg font-bold text-white group-hover:text-red-200 transition-colors duration-300 drop-shadow">
                                {category.label}
                              </h4>
                              <p className="text-sm text-white/80 group-hover:text-red-100 transition-colors duration-300 font-medium drop-shadow">
                                Explore now
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Popular Searches */}
                    <div
                      className={`rounded-2xl p-8 border shadow-2xl transition-all duration-700 ${
                        isClosing
                          ? "opacity-0 translate-y-4"
                          : "opacity-100 translate-y-0"
                      }`}
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(99, 102, 241, 0.25))",
                        backdropFilter: "blur(25px)",
                        WebkitBackdropFilter: "blur(25px)",
                        borderColor: "rgba(59, 130, 246, 0.4)",
                        animationDelay: "300ms",
                      }}
                    >
                      <h3 className="text-2xl font-bold mb-6 text-white drop-shadow-lg">
                        Popular Searches
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {popularSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearch(search)}
                            className={`px-6 py-3 rounded-full text-sm font-bold text-white/95 transition-all duration-300 border shadow-lg transform ${
                              isClosing
                                ? "opacity-0 scale-75"
                                : "opacity-100 scale-100 hover:-translate-y-1 hover:scale-105"
                            }`}
                            style={{
                              background: "rgba(255, 255, 255, 0.2)",
                              backdropFilter: "blur(20px)",
                              WebkitBackdropFilter: "blur(20px)",
                              borderColor: "rgba(255, 255, 255, 0.3)",
                              animationDelay: `${400 + index * 50}ms`,
                            }}
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Recent Searches Sidebar */}
              <div
                className={`rounded-2xl p-8 border shadow-2xl transition-all duration-700 ${
                  isClosing
                    ? "opacity-0 translate-x-8"
                    : "opacity-100 translate-x-0"
                }`}
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(25px)",
                  WebkitBackdropFilter: "blur(25px)",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  animationDelay: "200ms",
                }}
              >
                {recentSearches.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center gap-3 drop-shadow-lg">
                        <Clock className="h-5 w-5 text-white/80" />
                        Recent Searches
                      </h3>
                      <button
                        onClick={clearRecentSearches}
                        className="text-sm text-white/80 hover:text-red-300 transition-colors duration-300 font-bold drop-shadow"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="space-y-3">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(search)}
                          className="w-full text-left p-4 rounded-xl transition-all duration-300 group flex items-center gap-4 border shadow-lg transform hover:-translate-y-1"
                          style={{
                            background: "rgba(255, 255, 255, 0.15)",
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          }}
                        >
                          <Clock className="h-4 w-4 text-white/70 group-hover:text-red-300 transition-colors duration-300" />
                          <span className="text-white/95 group-hover:text-white transition-colors duration-300 font-medium drop-shadow">
                            {search}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Categories */}
                <div>
                  <h3 className="text-xl font-bold mb-6 text-white drop-shadow-lg">
                    Quick Categories
                  </h3>
                  <div className="space-y-3">
                    {menuData.slice(0, 4).map((category, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          handleSearch(category.label, category.link)
                        }
                        className="w-full text-left p-4 rounded-xl transition-all duration-300 group border shadow-lg transform hover:-translate-y-1"
                        style={{
                          background: "rgba(255, 255, 255, 0.15)",
                          backdropFilter: "blur(20px)",
                          WebkitBackdropFilter: "blur(20px)",
                          borderColor: "rgba(255, 255, 255, 0.3)",
                        }}
                      >
                        <span className="text-white/95 group-hover:text-white transition-colors duration-300 font-bold drop-shadow">
                          {category.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Simple Search Results */}
            <div className="lg:hidden">
              {searchQuery.trim() && filteredSuggestions.length > 0 && (
                <div
                  className="rounded-2xl p-6 max-h-64 overflow-y-auto border shadow-2xl"
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(25px)",
                    WebkitBackdropFilter: "blur(25px)",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  }}
                >
                  <h3 className="text-lg font-bold mb-4 text-white drop-shadow-lg">
                    Search Results
                  </h3>
                  <div className="space-y-3">
                    {filteredSuggestions
                      .slice(0, 3)
                      .map((suggestion, index) => (
                        <div
                          key={index}
                          onClick={() =>
                            handleSearch(suggestion.label, suggestion.link)
                          }
                          className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 group border shadow-lg"
                          style={{
                            background: "rgba(255, 255, 255, 0.2)",
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          }}
                        >
                          <div className="w-10 h-10 relative flex-shrink-0 rounded-lg overflow-hidden bg-white/10">
                            <Image
                              src={suggestion.image}
                              alt={suggestion.label}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white group-hover:text-red-200 transition-colors duration-300 text-sm truncate drop-shadow">
                              {suggestion.label}
                            </h4>
                            <span className="text-xs bg-red-500/90 text-white px-2 py-1 rounded-full font-bold">
                              {suggestion.type}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Enhanced Compact Search Bar with fixed text animation
  return (
    <div
      ref={searchBarRef}
      onClick={expandSearch}
      className="w-full cursor-pointer group relative"
    >
      <div className="w-full flex items-center relative bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl hover:border-red-300 hover:from-red-50 hover:to-orange-50 transition-all duration-500 shadow-lg hover:shadow-xl transform hover:scale-[1.02] hover:-translate-y-1">
        <div className="flex-1 px-5 py-4 relative overflow-hidden">
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1200 ease-out"></div>

          {/* Text with typing cursor */}
          <div className="relative z-10 flex items-center">
            <span className="text-gray-800 font-medium text-lg">
              {animatedText || "Search products..."}
            </span>
            {isTyping && (
              <span className="ml-1 w-0.5 h-5 bg-red-500 animate-pulse"></span>
            )}
          </div>
        </div>

        <div className="px-5 py-4 text-gray-500 group-hover:text-red-600 transition-all duration-500 transform group-hover:scale-125 group-hover:rotate-12">
          <Search className="h-6 w-6" />
        </div>
      </div>

      {/* Enhanced glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-400/0 via-orange-400/0 to-red-400/0 group-hover:from-red-400/30 group-hover:via-orange-400/30 group-hover:to-red-400/30 transition-all duration-700 -z-10 blur-xl transform scale-110 opacity-0 group-hover:opacity-100"></div>
    </div>
  );
};

export default SearchBar;
