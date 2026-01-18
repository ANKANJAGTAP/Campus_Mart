import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../utils/api";
import { FiSearch, FiMapPin, FiHeart, FiEye, FiClock, FiFilter, FiChevronDown } from "react-icons/fi";
import gsap from "gsap";

const Items = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get("search") || "";
    const itemsRef = useRef(null);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    const [filters, setFilters] = useState({
        category: "All",
        college: "",
        location: ""
    });

    const categories = ["All", "Electronics", "Books", "Clothing", "Furniture", "Sports", "Other"];

    // Fetch Items
    useEffect(() => {
        const fetchItems = async () => {
        try {
            const res = await api.get("/item/all");
            if (res.data.success) {
            setItems(res.data.data);
            setFilteredItems(res.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
        };
        fetchItems();
    }, []);

    // Filter Logic
    useEffect(() => {
        let result = items;
        // Search
        if (search) {
        result = result.filter(
            (item) =>
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.description.toLowerCase().includes(search.toLowerCase())
        );
        }
        // Category
        if (filters.category !== "All") {
        result = result.filter((item) => item.category === filters.category);
        }
        // College
        if (filters.college) {
            result = result.filter(item => 
                item.seller?.collegeName?.toLowerCase().includes(filters.college.toLowerCase())
            );
        }
        // Location
        if (filters.location) {
        result = result.filter(item => 
            item.seller?.location?.address?.toLowerCase().includes(filters.location.toLowerCase())
        );
        }
        setFilteredItems(result);
    }, [search, filters, items]);

    // GSAP Stagger Animation when filteredItems change
    useLayoutEffect(() => {
        if (itemsRef.current && filteredItems.length > 0) {
            gsap.fromTo(itemsRef.current.children, 
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, stagger: 0.05, duration: 0.5, ease: "power2.out" }
            );
        }
    }, [filteredItems, loading]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        if (key === 'category') setIsCategoryOpen(false);
    }

    const handleSearchChange = (e) => {
        const term = e.target.value;
        const newParams = new URLSearchParams(searchParams);
        if (term) {
            newParams.set("search", term);
        } else {
            newParams.delete("search");
        }
        setSearchParams(newParams);
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#02040a] pt-16 sm:pt-20 pb-12 px-4 md:px-8 transition-colors duration-300 font-sans">
        <div className="max-w-7xl mx-auto">
            
            {/* Search & Filter Section */}
            <div className="sticky top-16 sm:top-20 z-30 mb-8 mt-6">
                <div className="bg-white/80 dark:bg-[#0B0E14]/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200 dark:border-white/10 p-2">
                    <div className="flex flex-col md:flex-row gap-2">
                        {/* Search Input - Cool Glow Effect */}
                        <div className="relative flex-1 group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FiSearch className="text-slate-400 group-focus-within:text-emerald-500 transition-colors duration-300" size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search the market..."
                                className="block w-full pl-11 pr-4 py-3 rounded-xl bg-slate-100/50 dark:bg-white/5 border border-transparent focus:border-emerald-500/50 focus:bg-white dark:focus:bg-black/40 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-300 outline-none font-medium"
                                value={search}
                                onChange={handleSearchChange}
                            />
                        </div>

                        {/* Filters Group */}
                        <div className="flex gap-2 pb-1 md:pb-0">
                            
                            {/* Custom Category Dropdown */}
                            <div className="relative min-w-[160px]">
                                <button 
                                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                    className="w-full h-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-100/50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-transparent hover:border-slate-200 dark:hover:border-white/10 text-slate-700 dark:text-slate-200 font-medium transition-all duration-200"
                                >
                                    <span className="flex items-center gap-2 text-sm">
                                        <FiFilter size={16} className="text-emerald-500" />
                                        {filters.category}
                                    </span>
                                    <FiChevronDown className={`transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {/* Dropdown Menu */}
                                {isCategoryOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsCategoryOpen(false)} />
                                        <div className="absolute top-full right-0 mt-2 w-56 p-1 bg-white dark:bg-[#1a1d24] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                            {categories.map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => handleFilterChange("category", cat)}
                                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                        filters.category === cat 
                                                            ? "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                                                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                                                    }`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                            
                            {/* Location Filter */}
                            <div className="relative flex-1 md:min-w-[220px]">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FiMapPin className="text-slate-400" size={16} />
                                </div>
                                <input
                                    list="locations"
                                    placeholder="Location..."
                                    className="block w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100/50 dark:bg-white/5 border border-transparent hover:bg-slate-100 dark:hover:bg-white/10 focus:border-emerald-500/50 focus:bg-white dark:focus:bg-black/40 focus:ring-4 focus:ring-emerald-500/10 text-slate-700 dark:text-white font-medium placeholder-slate-500 dark:placeholder-slate-400 text-sm transition-all duration-300 outline-none"
                                    value={filters.location}
                                    onChange={(e) => handleFilterChange("location", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                </div>
            ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300 dark:border-white/10">
                <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiSearch className="text-slate-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No items found</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Try adjusting your search or filters.</p>
                <button 
                    onClick={() => {setSearchParams({}); setFilters({category: "All", college: "", location: ""})}} 
                    className="text-white bg-emerald-500 hover:bg-emerald-600 px-6 py-2.5 rounded-full font-bold transition-all shadow-lg shadow-emerald-500/20"
                >
                    Clear Filters
                </button>
            </div>
            ) : (
            <div ref={itemsRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                <Link
                    to={`/item/${item._id}`}
                    key={item._id}
                    className="group bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-emerald-900/20 hover:-translate-y-1 transition-all duration-300"
                >
                    {/* Standard Image Area */}
                    <div className="aspect-[4/3] relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                        src={item.images?.[0] || "/placeholder.png"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-bold border border-white/10">
                        ₹{item.price.toLocaleString()}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-black/60 backdrop-blur-md text-slate-900 dark:text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-white/20">
                        {item.category}
                    </div>
                    </div>
                    
                    {/* Content Body */}
                    <div className="p-4">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1 truncate">
                        {item.title}
                    </h2>
                    
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-[10px] font-bold text-white">
                            {item.seller?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
                            {item.seller?.name || "Unknown Seller"}
                        </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-400 font-medium">
                        <div className="flex items-center gap-1.5">
                            <FiMapPin size={12} className="text-emerald-500" />
                            <span className="truncate max-w-[100px]">{item.seller?.collegeName || "Campus"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <FiClock size={12} />
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    </div>
                </Link>
                ))}
            </div>
            )}
        </div>
        </div>
    );
};

export default Items;
