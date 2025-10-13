// EcoPulse - Consolidated JavaScript

// Embedded pollution data
const POLLUTION_DATA = {
  regions: {
    north_america: {name: "North America", population: 579000000},
    europe: {name: "Europe", population: 747000000},
    asia: {name: "Asia", population: 4600000000},
    south_america: {name: "South America", population: 434000000},
    africa: {name: "Africa", population: 1340000000},
    oceania: {name: "Oceania", population: 45000000}
  },
  pollution_data: {
    air: {
      current_data: {
        north_america: {pm25: 12.3, aqi: 65, deaths_yearly: 140000},
        europe: {pm25: 13.8, aqi: 68, deaths_yearly: 400000},
        asia: {pm25: 45.2, aqi: 156, deaths_yearly: 4200000},
        south_america: {pm25: 18.9, aqi: 78, deaths_yearly: 95000},
        africa: {pm25: 32.8, aqi: 112, deaths_yearly: 780000},
        oceania: {pm25: 8.4, aqi: 42, deaths_yearly: 12000}
      }
    },
    water: {
      current_data: {
        north_america: {chemical_pollution: 8.2, microplastics: 15.7, clean_water_access: 97.3},
        europe: {chemical_pollution: 6.1, microplastics: 12.4, clean_water_access: 98.7},
        asia: {chemical_pollution: 24.8, microplastics: 45.3, clean_water_access: 71.2},
        south_america: {chemical_pollution: 16.4, microplastics: 28.1, clean_water_access: 83.6},
        africa: {chemical_pollution: 19.7, microplastics: 22.8, clean_water_access: 63.1},
        oceania: {chemical_pollution: 4.3, microplastics: 18.9, clean_water_access: 94.8}
      }
    },
    light: {
      current_data: {
        north_america: {sky_brightness: 19.2, visible_stars: 32.1, light_pollution_index: 6.8},
        europe: {sky_brightness: 18.9, visible_stars: 28.7, light_pollution_index: 7.2},
        asia: {sky_brightness: 17.4, visible_stars: 15.3, light_pollution_index: 8.9},
        south_america: {sky_brightness: 20.1, visible_stars: 45.8, light_pollution_index: 5.4},
        africa: {sky_brightness: 20.8, visible_stars: 58.2, light_pollution_index: 4.1},
        oceania: {sky_brightness: 21.1, visible_stars: 67.4, light_pollution_index: 3.2}
      }
    }
  }
};

// Main Application
class EcoPulseApp {
    constructor() {
        this.currentSection = 'home';
        this.data = POLLUTION_DATA;
        this.charts = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupIntersectionObserver();
        this.checkWebGLSupport();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.dataset.target;
                this.navigateToSection(target);
            });
        });

        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // CTA buttons
        document.getElementById('explore-btn')?.addEventListener('click', () => {
            this.navigateToSection('air');
        });

        // Sliders
        this.setupSliders();
        this.setupRegionSelectors();
    }

    navigateToSection(sectionId) {
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
            
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.dataset.target === sectionId) {
                    link.classList.add('active');
                }
            });

            this.initializeSection(sectionId);
        }
    }

    initializeSection(sectionId) {
        switch (sectionId) {
            case 'home':
                this.initializeHeroAnimation();
                break;
            case 'air':
                this.initializeAirChart();
                this.initializeAir3D();
                this.updateAirData('asia');
                break;
            case 'water':
                this.initializeWaterChart();
                this.initializeWater3D();
                this.updateWaterData('asia');
                break;
            case 'light':
                this.initializeLightChart();
                this.initializeLight3D();
                this.updateLightData('asia');
                break;
        }
    }

    setupSliders() {
        ['air-pollution', 'water-contamination', 'light-intensity'].forEach(sliderId => {
            const slider = document.getElementById(`${sliderId}-slider`);
            if (slider) {
                slider.addEventListener('input', (e) => {
                    const value = e.target.value;
                    const type = sliderId.split('-')[0];
                    this.updatePollutionLevel(type, value);
                });
            }
        });
    }

    setupRegionSelectors() {
        ['air', 'water', 'light'].forEach(type => {
            const selector = document.getElementById(`${type}-region-selector`);
            if (selector) {
                selector.addEventListener('change', (e) => {
                    this[`update${type.charAt(0).toUpperCase() + type.slice(1)}Data`](e.target.value);
                });
            }
        });
    }

    updatePollutionLevel(type, value) {
        const labels = {
            air: ['Clean', 'Moderate', 'Unhealthy', 'Hazardous'],
            water: ['Pure', 'Moderate', 'Contaminated', 'Toxic'],
            light: ['Natural', 'Low', 'High', 'Extreme']
        };

        const level = Math.floor(value / 25);
        const label = labels[type][Math.min(level, 3)];
        
        const valueElement = document.getElementById(`${type === 'air' ? 'air-pollution' : type === 'water' ? 'water-contamination' : 'light-intensity'}-value`);
        if (valueElement) valueElement.textContent = label;
    }

    updateAirData(region) {
        const data = this.data.pollution_data.air.current_data[region];
        if (data) {
            const aqiEl = document.getElementById('aqi-value');
            const pm25El = document.getElementById('pm25-value');
            if (aqiEl) aqiEl.textContent = data.aqi;
            if (pm25El) pm25El.textContent = data.pm25;
        }
    }

    updateWaterData(region) {
        const data = this.data.pollution_data.water.current_data[region];
        if (data) {
            const chemEl = document.getElementById('chemical-pollution');
            const microEl = document.getElementById('microplastics');
            if (chemEl) chemEl.textContent = data.chemical_pollution;
            if (microEl) microEl.textContent = data.microplastics;
        }
    }

    updateLightData(region) {
        const data = this.data.pollution_data.light.current_data[region];
        if (data) {
            const skyEl = document.getElementById('sky-brightness');
            const starsEl = document.getElementById('visible-stars');
            if (skyEl) skyEl.textContent = data.sky_brightness;
            if (starsEl) starsEl.textContent = data.visible_stars;
        }
    }

    initializeAnimations() {
        // Animate counters when in view
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('stat-item')) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.stat-item').forEach(el => {
            if (el) observer.observe(el);
        });
    }

    animateCounter(element) {
        const counter = element.querySelector('[data-counter]');
        if (!counter || counter.classList.contains('animated')) return;

        counter.classList.add('animated');
        const target = parseInt(counter.dataset.counter);
        const duration = 2000;
        const start = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutExpo = 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(target * easeOutExpo);
            
            counter.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                counter.textContent = target;
            }
        };

        requestAnimationFrame(animate);
    }

    checkWebGLSupport() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!gl;
    }

    initializeAirChart() {
        const ctx = document.getElementById('air-chart');
        if (!ctx || this.charts.air) return;

        const data = this.data.pollution_data.air.current_data;
        const regions = Object.keys(data);
        const aqiValues = regions.map(region => data[region].aqi);

        this.charts.air = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: regions.map(r => this.data.regions[r]?.name || r),
                datasets: [{
                    label: 'AQI Index',
                    data: aqiValues,
                    backgroundColor: 'rgba(239, 68, 68, 0.7)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#ffffff' } } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#374151' }, ticks: { color: '#ffffff' } },
                    x: { grid: { color: '#374151' }, ticks: { color: '#ffffff' } }
                }
            }
        });
    }

    initializeWaterChart() {
        const ctx = document.getElementById('water-chart');
        if (!ctx || this.charts.water) return;

        const data = this.data.pollution_data.water.current_data;
        const regions = Object.keys(data);
        const accessValues = regions.map(region => data[region].clean_water_access);

        this.charts.water = new Chart(ctx, {
            type: 'line',
            data: {
                labels: regions.map(r => this.data.regions[r]?.name || r),
                datasets: [{
                    label: 'Clean Water Access %',
                    data: accessValues,
                    backgroundColor: 'rgba(14, 165, 233, 0.2)',
                    borderColor: 'rgba(14, 165, 233, 1)',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#ffffff' } } },
                scales: {
                    y: { beginAtZero: true, max: 100, grid: { color: '#374151' }, ticks: { color: '#ffffff' } },
                    x: { grid: { color: '#374151' }, ticks: { color: '#ffffff' } }
                }
            }
        });
    }

    initializeLightChart() {
        const ctx = document.getElementById('light-chart');
        if (!ctx || this.charts.light) return;

        const data = this.data.pollution_data.light.current_data;
        const regions = Object.keys(data);
        const visibleStars = regions.map(region => data[region].visible_stars);

        this.charts.light = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: regions.map(r => this.data.regions[r]?.name || r),
                datasets: [{
                    label: 'Visible Stars %',
                    data: visibleStars,
                    backgroundColor: [
                        'rgba(249, 115, 22, 0.7)', 'rgba(14, 165, 233, 0.7)', 'rgba(16, 185, 129, 0.7)',
                        'rgba(239, 68, 68, 0.7)', 'rgba(251, 191, 36, 0.7)', 'rgba(168, 85, 247, 0.7)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#ffffff' } } }
            }
        });
    }

    initializeHeroAnimation() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const particles = Array.from({length: 50}, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        }));

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(14, 165, 233, ${particle.opacity})`;
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        };

        animate();
    }

    initializeAir3D() {
        const canvas = document.getElementById('air-3d-scene');
        const loading = document.getElementById('air-scene-loading');
        
        if (!canvas) return;

        setTimeout(() => {
            if (loading) loading.style.display = 'none';
        }, 1000);

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ef4444';
        ctx.font = '20px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Air Pollution Simulation', canvas.width / 2, canvas.height / 2);
        ctx.fillText('(3D Scene Placeholder)', canvas.width / 2, canvas.height / 2 + 30);
    }

    initializeWater3D() {
        const canvas = document.getElementById('water-3d-scene');
        const loading = document.getElementById('water-scene-loading');
        
        if (!canvas) return;

        setTimeout(() => {
            if (loading) loading.style.display = 'none';
        }, 1000);

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0ea5e9';
        ctx.font = '20px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Water Flow Simulation', canvas.width / 2, canvas.height / 2);
        ctx.fillText('(3D Scene Placeholder)', canvas.width / 2, canvas.height / 2 + 30);
    }

    initializeLight3D() {
        const canvas = document.getElementById('light-3d-scene');
        const loading = document.getElementById('light-scene-loading');
        
        if (!canvas) return;

        setTimeout(() => {
            if (loading) loading.style.display = 'none';
        }, 1000);

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#f97316';
        ctx.font = '20px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Night Sky Simulation', canvas.width / 2, canvas.height / 2);
        ctx.fillText('(3D Scene Placeholder)', canvas.width / 2, canvas.height / 2 + 30);
    }
}

// Initialize app when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    const app = new EcoPulseApp();
    
    // Error handling
    window.addEventListener('error', (e) => {
        console.error('Error:', e.error);
    });
    
    // Performance monitoring
    window.addEventListener('load', () => {
        console.log(`Page loaded in ${performance.now().toFixed(2)}ms`);
    });
    
    // Make app globally available
    window.EcoPulse = { app };
    console.log('EcoPulse initialized successfully');
});

// Service worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registered'))
            .catch(err => console.log('SW registration failed'));
    });
}