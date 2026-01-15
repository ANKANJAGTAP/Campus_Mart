import { Link } from "react-router-dom";
import { FiSearch, FiShield, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from 'split-type';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const heroRef = useRef(null);
    const deviceRef = useRef(null);
    const primaryBtnRef = useRef(null);
    const bentoRef = useRef(null);
    const inventoryRef = useRef(null);
    
    // Placeholder images - User should replace these
    const [currentImage, setCurrentImage] = useState(0);
    const images = [
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format", // Book/Study
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format", // Tech
        "https://images.unsplash.com/photo-1550029402-226113b0c583?q=80&w=1000&auto=format"  // Campus
    ];

    // Image Slider Interval
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [images.length]);

    useLayoutEffect(() => {
        // Initialize Lenis Smooth Scroll
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        const ctx = gsap.context(() => {
            // 1. Hero Reveal Animation
            const headline = new SplitType('#hero-headline', { types: 'chars, words' });
            
            // Initial Set States
            gsap.set(deviceRef.current, { rotationY: -10, rotationX: 5 });
            
            // Headline Reveal
            gsap.from(headline.chars, {
                y: 50,
                opacity: 0,
                rotateX: -90,
                stagger: 0.02,
                duration: 1,
                ease: "power3.out",
                delay: 0.2
            });

            // Subhead & Buttons Reveal
            gsap.from(".hero-content-reveal", {
                y: 30,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                delay: 0.6,
                ease: "power2.out"
            });
            
            // Device Frame Entrance
            gsap.from(deviceRef.current, {
                x: 100,
                opacity: 0,
                rotationY: 20,
                duration: 1.5,
                delay: 0.4,
                ease: "power3.out"
            });

            // 2. Light Beams Animation
            gsap.to(".light-beam", {
                x: "100vw",
                y: "50vh",
                duration: "random(8, 12)",
                repeat: -1,
                ease: "none",
                opacity: 0,
                yoyo: true,
                stagger: {
                    amount: 5,
                    from: "random"
                }
            });

            // 3. Magnetic Button Effect
            const btn = primaryBtnRef.current;
            if (btn) {
                const xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3" });
                const yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3" });
                const mouseEnter = (e) => {
                    const { left, top, width, height } = btn.getBoundingClientRect();
                    const x = e.clientX - left - width / 2;
                    const y = e.clientY - top - height / 2;
                    xTo(x * 0.3);
                    yTo(y * 0.3);
                };
                const mouseLeave = () => {
                    xTo(0);
                    yTo(0);
                };
                
                btn.addEventListener('mousemove', mouseEnter);
                btn.addEventListener('mouseleave', mouseLeave);
            }

            // 4. Device Tilt on Mouse Move
            const handleMouseMove = (e) => {
                if (!deviceRef.current) return;
                const xPct = (e.clientX / window.innerWidth) - 0.5;
                const yPct = (e.clientY / window.innerHeight) - 0.5;
                
                gsap.to(deviceRef.current, {
                    rotationY: xPct * 10, // Max 5 deg tilt
                    rotationX: -yPct * 10,
                    duration: 1,
                    ease: "power2.out"
                });
            };
            heroRef.current?.addEventListener("mousemove", handleMouseMove);


            // 5. Bento Grid & Inventory Animations (Preserved)
            gsap.from(".bento-box", {
                scrollTrigger: { trigger: bentoRef.current, start: "top 80%" },
                y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out"
            });
            
             gsap.from(".inventory-item", {
                scrollTrigger: { trigger: inventoryRef.current, start: "top 85%" },
                y: 30, opacity: 0, duration: 0.6, stagger: 0.05, ease: "power2.out"
            });

        }, heroRef);

        return () => {
            ctx.revert();
            lenis.destroy();
        };
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#02040a] transition-colors duration-500 overflow-x-hidden font-sans selection:bg-emerald-500/30">
            
            {/* HERO SECTION - Redesigned SaaS Style */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center p-6 sm:p-12 overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-[#050505] dark:via-[#0a0a0a] dark:to-[#020202]">
                
                {/* Background Aesthetics */}
                <div className="absolute inset-0 max-w-[100vw] overflow-hidden pointer-events-none">
                     {/* Light Beams */}
                     <div className="light-beam absolute top-0 left-[-20%] w-[1px] h-[150vh] bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent rotate-45 blur-[1px]"></div>
                     <div className="light-beam absolute top-[-30%] left-0 w-[1px] h-[150vh] bg-gradient-to-b from-transparent via-white/10 to-transparent rotate-[30deg] blur-[2px]"></div>
                     <div className="light-beam absolute top-[10%] right-[-10%] w-[1px] h-[150vh] bg-gradient-to-b from-transparent via-emerald-400/10 to-transparent -rotate-[15deg] blur-[1px]"></div>
                     
                     {/* Subtle Glows */}
                     <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] animate-pulse"></div>
                     <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px]"></div>
                </div>

                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10 pt-20 lg:pt-0">
                    
                    {/* LEFT COLUMN: Typography & CTA */}
                    <div className="flex flex-col items-start text-left">
                        <h1 id="hero-headline" className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter text-slate-900 dark:text-white leading-[1.1] mb-6">
                            Campus <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Trading Levelled Up.</span>
                        </h1>
                        
                        <p className="hero-content-reveal text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-lg font-medium leading-relaxed mb-10">
                            The intelligent secondary market for high-performance students. 
                            Buy, sell, and liquidate gear instantly. Verified & Commission-free.
                        </p>

                        <div className="hero-content-reveal flex flex-wrap gap-4">
                            <Link 
                                to="/items" 
                                ref={primaryBtnRef}
                                className="relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/20 transition-all flex items-center gap-2"
                            >
                                Start Trading
                                <FiArrowRight />
                            </Link>

                            <Link 
                                to="/items/create" 
                                className="px-8 py-4 bg-white/10 border border-slate-200 dark:border-white/10 backdrop-blur-md text-slate-900 dark:text-white rounded-full font-bold text-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                            >
                                Liquidate Assets
                            </Link>
                        </div>
                        
                        <div className="hero-content-reveal mt-12 flex items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-500">
                             <div className="flex -space-x-2">
                                {[1,2,3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-black"></div>
                                ))}
                             </div>
                             <div>Trusted by 2,000+ Students</div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: 3D Device Mockup */}
                    <div className="relative perspective-1000 w-full flex justify-center lg:justify-end">
                        <div 
                            ref={deviceRef} 
                            className="relative w-full max-w-[500px] aspect-[4/3] bg-slate-900 rounded-[2rem] border-[8px] border-slate-200 dark:border-[#1a1a1a] shadow-2xl dark:shadow-emerald-900/20 overflow-hidden transform-style-3d group"
                        >
                            {/* Device Gloss/Reflection */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent z-20 pointer-events-none"></div>

                            {/* Image Slider */}
                            <div className="absolute inset-0 z-10">
                                {images.map((img, index) => (
                                    <div 
                                        key={index} 
                                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}
                                    >
                                        <img 
                                            src={img} 
                                            alt="App Screenshot" 
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/20"></div>
                                    </div>
                                ))}
                            </div>

                            {/* UI Overlay Mockup */}
                            <div className="absolute top-0 left-0 right-0 h-14 bg-white/10 backdrop-blur-md z-30 flex items-center px-6 justify-between border-b border-white/5">
                                <div className="w-20 h-2 rounded-full bg-white/20"></div>
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                </div>
                            </div>
                            
                            {/* Floating UI Elements inside Screen */}
                            <div className="absolute bottom-8 left-8 right-8 z-30 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-between shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <div>
                                    <div className="text-xs text-slate-500">Current Item</div>
                                    <div className="font-bold text-slate-900 dark:text-white">Engineering Kit</div>
                                </div>
                                <div className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg">
                                    $45.00
                                </div>
                            </div>
                            
                            {/* Animated Progress Bar */}
                            <div className="absolute top-14 left-0 h-[2px] bg-emerald-500 z-40 transition-all duration-300" style={{width: `${((currentImage + 1) / images.length) * 100}%`}}></div>

                        </div>
                        
                        {/* Decorative Background for Device */}
                         <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-emerald-500/20 to-purple-500/20 blur-[80px] rounded-full opacity-50"></div>
                    </div>
                    
                </div>
            </section>

            {/* BENTO GRID POWER FEATURES (PRESERVED) */}
            <section ref={bentoRef} className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[500px]">
                    <div className="bento-box col-span-1 md:col-span-2 row-span-2 bg-white/60 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-end group hover:border-emerald-500/30 transition-colors backdrop-blur-sm">
                        <div className="absolute top-8 left-8 right-8">
                             <div className="bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl p-3 flex items-center gap-3 backdrop-blur-sm shadow-sm">
                                 <FiSearch className="text-emerald-500" />
                                 <span className="text-slate-500 dark:text-slate-400 font-mono text-sm typing-animation">Searching for "Engineering Graphics"...</span>
                             </div>
                             <div className="mt-4 space-y-2 opacity-50">
                                 <div className="h-2 w-3/4 bg-slate-200 dark:bg-white/10 rounded"></div>
                                 <div className="h-2 w-1/2 bg-slate-200 dark:bg-white/10 rounded"></div>
                             </div>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Smart Search</h3>
                            <p className="text-slate-600 dark:text-slate-400">Find exactly what you need with semantic matching.</p>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>

                    <div className="bento-box md:col-span-1 bg-white/60 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 rounded-3xl p-6 flex flex-col justify-between group hover:border-emerald-500/30 transition-colors relative overflow-hidden backdrop-blur-sm">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 animate-pulse">
                            <FiCheckCircle size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Safe Zones</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Verified trading spots.</p>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-5 dark:opacity-10 rotate-12 text-slate-900 dark:text-white">
                             <FiShield size={100} />
                        </div>
                    </div>

                    <div className="bento-box md:col-span-1 bg-white/60 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 rounded-3xl p-6 flex flex-col justify-between group hover:border-emerald-500/30 transition-colors backdrop-blur-sm">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-4 font-mono font-bold">
                            ₹
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">0% Fees</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Keep 100% of profit.</p>
                        </div>
                    </div>

                    <div className="bento-box md:col-span-2 bg-white/60 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 rounded-3xl p-8 flex items-center justify-between group hover:border-emerald-500/30 transition-colors relative overflow-hidden backdrop-blur-sm">
                         <div className="relative z-10 max-w-[60%]">
                             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Verified Students Only</h3>
                             <p className="text-sm text-slate-600 dark:text-slate-400">Closed ecosystem. No outsiders, no bots. Just your peers.</p>
                         </div>
                         <div className="relative z-10 w-24 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg shadow-lg rotate-6 flex items-center justify-center text-white/90 font-mono text-[10px] tracking-widest border border-white/20">
                             ID CARD
                             <div className="absolute inset-0 bg-white/30 animate-scan-y"></div>
                         </div>
                    </div>
                </div>
            </section>

             {/* FLOATING INVENTORY PREVIEW (PRESERVED) */}
            <section ref={inventoryRef} className="py-20 px-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Live Market</h2>
                        <p className="text-slate-600 dark:text-slate-400">Real-time liquidity from across campus.</p>
                    </div>
                     <Link to="/items" className="text-emerald-500 font-bold hover:underline flex items-center gap-1">
                        View All Assets <FiArrowRight />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="inventory-item group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow">
                            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse"></div> 
                            <img 
                                src={`https://source.unsplash.com/random/400x500?tech,book&sig=${i}`} 
                                alt="Item" 
                                className="absolute inset-0 w-full h-full object-cover opacity-90 dark:opacity-80 group-hover:scale-110 transition-transform duration-700"
                                onError={(e) => e.target.style.display = 'none'} 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                            
                            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <div className="text-white font-bold text-lg mb-1">Available Item #{i}</div>
                                <div className="flex justify-between items-center">
                                    <span className="text-emerald-400 font-mono font-bold">₹{i * 450}</span>
                                    <span className="text-xs text-white/80 bg-white/10 px-2 py-1 rounded backdrop-blur-sm">4m ago</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
};

export default Home;