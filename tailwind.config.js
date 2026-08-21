/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],

  content: ['./src/**/*.{html,ts}'],

  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
  				soft: 'oklch(var(--primary-soft))',
  				glow: 'oklch(var(--primary-glow))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			success: {
  				DEFAULT: 'oklch(var(--success))',
  				foreground: 'oklch(var(--success-foreground))'
  			},
  			warning: {
  				DEFAULT: 'oklch(var(--warning))',
  				foreground: 'oklch(var(--warning-foreground))'
  			},
  			info: {
  				DEFAULT: 'oklch(var(--info))',
  				foreground: 'oklch(var(--info-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			sidebar: {
  				DEFAULT: 'oklch(var(--sidebar))',
  				foreground: 'oklch(var(--sidebar-foreground))',
  				primary: 'oklch(var(--sidebar-primary))',
  				'primary-foreground': 'oklch(var(--sidebar-primary-foreground))',
  				accent: 'oklch(var(--sidebar-accent))',
  				'accent-foreground': 'oklch(var(--sidebar-accent-foreground))',
  				border: 'oklch(var(--sidebar-border))',
  				ring: 'oklch(var(--sidebar-ring))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))',
  				'6': 'oklch(var(--chart-6))'
  			}
  		},
  		borderRadius: {
  			sm: 'calc(var(--radius) - 4px)',
  			md: 'calc(var(--radius) - 2px)',
  			lg: 'var(--radius)',
  			xl: 'calc(var(--radius) + 6px)',
  			'2xl': 'calc(var(--radius) + 12px)',
  			'3xl': 'calc(var(--radius) + 20px)'
  		},
  		fontFamily: {
  			sans: [
  				'Plus Jakarta Sans',
  				'ui-sans-serif',
  				'system-ui',
  				'sans-serif'
  			],
  			display: [
  				'Plus Jakarta Sans',
  				'ui-sans-serif',
  				'system-ui',
  				'sans-serif'
  			]
  		},
  		backgroundImage: {
  			'gradient-primary': 'var(--gradient-primary)',
  			'gradient-surface': 'var(--gradient-surface)'
  		},
  		boxShadow: {
  			soft: 'var(--shadow-soft)',
  			lift: 'var(--shadow-lift)',
  			glow: 'var(--shadow-glow)'
  		},
  		keyframes: {
  			'rise-in': {
  				from: {
  					opacity: '0',
  					transform: 'translateY(12px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			shimmer: {
  				from: {
  					transform: 'translateX(-100%)'
  				},
  				to: {
  					transform: 'translateX(100%)'
  				}
  			}
  		},
  		animation: {
  			'rise-in': 'rise-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
  			shimmer: 'shimmer 1.6s infinite'
  		}
  	}
  },

  plugins: [require("tailwindcss-animate")],
};
