import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
		"./index.html",
		"./src/**/*.{js,jsx,ts,tsx,css}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'body': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
				'heading': ['Playfair Display', 'Georgia', 'serif'],
				'cursive': ['Dancing Script', 'cursive'],
				'serif': ['Crimson Text', 'Georgia', 'serif'],
				'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
			},
			colors: {
				// Base system colors
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				
				// Blog design colors with actual values and CSS variables
				primary: {
					DEFAULT: '#10b981', // Emerald
					50: '#ecfdf5',
					100: '#d1fae5',
					200: '#a7f3d0',
					300: '#6ee7b7',
					400: '#34d399',
					500: '#10b981',
					600: '#059669',
					700: '#047857',
					800: '#065f46',
					900: '#064e3b',
					foreground: '#ffffff'
				},
				secondary: {
					DEFAULT: '#a855f7', // Purple
					50: '#faf5ff',
					100: '#f3e8ff',
					200: '#e9d5ff',
					300: '#d8b4fe',
					400: '#c084fc',
					500: '#a855f7',
					600: '#9333ea',
					700: '#7c3aed',
					800: '#6b21a8',
					900: '#581c87',
					foreground: '#ffffff'
				},
				accent: {
					DEFAULT: '#ec4899', // Pink
					50: '#fdf2f8',
					100: '#fce7f3',
					200: '#fbcfe8',
					300: '#f9a8d4',
					400: '#f472b6',
					500: '#ec4899',
					600: '#db2777',
					700: '#be185d',
					800: '#9d174d',
					900: '#831843',
					foreground: '#ffffff'
				},
				
				// Glass effect color variants
				glass: {
					emerald: {
						DEFAULT: '#10b981',
						light: 'rgba(16, 185, 129, 0.15)',
						medium: 'rgba(16, 185, 129, 0.1)',
						soft: 'rgba(16, 185, 129, 0.05)',
						border: 'rgba(16, 185, 129, 0.4)',
					},
					purple: {
						DEFAULT: '#a855f7',
						light: 'rgba(168, 85, 247, 0.15)',
						medium: 'rgba(168, 85, 247, 0.1)',
						soft: 'rgba(168, 85, 247, 0.05)',
						border: 'rgba(168, 85, 247, 0.4)',
					},
					pink: {
						DEFAULT: '#ec4899',
						light: 'rgba(236, 72, 153, 0.15)',
						medium: 'rgba(236, 72, 153, 0.1)',
						soft: 'rgba(236, 72, 153, 0.05)',
						border: 'rgba(236, 72, 153, 0.4)',
					},
					blue: {
						DEFAULT: '#3b82f6',
						light: 'rgba(59, 130, 246, 0.15)',
						medium: 'rgba(59, 130, 246, 0.1)',
						soft: 'rgba(59, 130, 246, 0.05)',
						border: 'rgba(59, 130, 246, 0.4)',
					},
					orange: {
						DEFAULT: '#f97316',
						light: 'rgba(249, 115, 22, 0.15)',
						medium: 'rgba(249, 115, 22, 0.1)',
						soft: 'rgba(249, 115, 22, 0.05)',
						border: 'rgba(249, 115, 22, 0.4)',
					},
					teal: {
						DEFAULT: '#14b8a6',
						light: 'rgba(20, 184, 166, 0.15)',
						medium: 'rgba(20, 184, 166, 0.1)',
						soft: 'rgba(20, 184, 166, 0.05)',
						border: 'rgba(20, 184, 166, 0.4)',
					},
					rose: {
						DEFAULT: '#f43f5e',
						light: 'rgba(244, 63, 94, 0.15)',
						medium: 'rgba(244, 63, 94, 0.1)',
						soft: 'rgba(244, 63, 94, 0.05)',
						border: 'rgba(244, 63, 94, 0.4)',
					},
					indigo: {
						DEFAULT: '#6366f1',
						light: 'rgba(99, 102, 241, 0.15)',
						medium: 'rgba(99, 102, 241, 0.1)',
						soft: 'rgba(99, 102, 241, 0.05)',
						border: 'rgba(99, 102, 241, 0.4)',
					},
					yellow: {
						DEFAULT: '#eab308',
						light: 'rgba(234, 179, 8, 0.15)',
						medium: 'rgba(234, 179, 8, 0.1)',
						soft: 'rgba(234, 179, 8, 0.05)',
						border: 'rgba(234, 179, 8, 0.4)',
					},
					cyan: {
						DEFAULT: '#06b6d4',
						light: 'rgba(6, 182, 212, 0.15)',
						medium: 'rgba(6, 182, 212, 0.1)',
						soft: 'rgba(6, 182, 212, 0.05)',
						border: 'rgba(6, 182, 212, 0.4)',
					},
				},
				
				// Blog-specific colors
				blog: {
					background: '#fefefe',
					'background-gradient': 'linear-gradient(135deg, #fef7ff 0%, #f0f9ff 25%, #ecfdf5 50%, #fdf4ff 75%, #fff1f2 100%)',
					text: {
						primary: '#1f2937',
						secondary: '#4b5563',
						muted: '#6b7280',
					},
					card: {
						background: 'rgba(255, 255, 255, 0.9)',
						'background-glass': 'rgba(255, 255, 255, 0.8)',
						border: 'rgba(255, 255, 255, 0.2)',
					}
				},
				
				// Custom minimalistic design tokens (keeping your existing ones)
				surface: {
					DEFAULT: 'hsl(var(--surface))',
					variant: 'hsl(var(--surface-variant))',
					soft: 'hsl(var(--surface-soft))',
				},
				text: {
					primary: 'hsl(var(--text-primary))',
					secondary: 'hsl(var(--text-secondary))',
					muted: 'hsl(var(--text-muted))',
				},
				'accent-custom': {
					primary: 'hsl(var(--accent-primary))',
					secondary: 'hsl(var(--accent-secondary))',
					soft: 'hsl(var(--accent-soft))',
				},
				
				// System colors
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			spacing: {
				'section': 'var(--spacing-section)',
				'18': '4.5rem',
				'88': '22rem',
				'104': '26rem',
				'112': '28rem',
				'128': '32rem',
			},
			borderRadius: {
				'soft': 'var(--radius-soft)',
				'medium': 'var(--radius-medium)',
				'xl': '1rem',
				'2xl': '1.5rem',
				'3xl': '2rem',
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'soft': 'var(--shadow-soft)',
				'medium': 'var(--shadow-medium)',
				'strong': 'var(--shadow-strong)',
				'glass': '0 8px 32px rgba(0, 0, 0, 0.06)',
				'glass-lg': '0 20px 40px rgba(0, 0, 0, 0.1)',
				'glass-xl': '0 25px 50px rgba(0, 0, 0, 0.15)',
				'colored-emerald': '0 10px 30px rgba(16, 185, 129, 0.2)',
				'colored-purple': '0 10px 30px rgba(168, 85, 247, 0.2)',
				'colored-pink': '0 10px 30px rgba(236, 72, 153, 0.2)',
				'colored-blue': '0 10px 30px rgba(59, 130, 246, 0.2)',
				'hover-emerald': '0 30px 60px rgba(16, 185, 129, 0.3)',
				'hover-purple': '0 30px 60px rgba(168, 85, 247, 0.3)',
				'hover-pink': '0 30px 60px rgba(236, 72, 153, 0.3)',
			},
			backdropBlur: {
				'xs': '2px',
				'3xl': '64px',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'slideUp': {
					'0%': { transform: 'translateY(100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'slideIn': {
					'0%': { transform: 'translateX(-100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'fadeIn': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'stackSlide': {
					'0%': { transform: 'translateY(20px) scale(0.95)', opacity: '0' },
					'100%': { transform: 'translateY(0) scale(1)', opacity: '1' }
				},
				'gradientShift': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'cardHover': {
					'0%': { transform: 'translateY(0) rotateX(0deg)' },
					'100%': { transform: 'translateY(-15px) rotateX(8deg)' }
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'slide-up': 'slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
				'slide-in': 'slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
				'fade-in': 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
				'stack-slide': 'stackSlide 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
				'gradient-shift': 'gradientShift 4s ease infinite',
				'float': 'float 3s ease-in-out infinite',
				'card-hover': 'cardHover 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
				'shimmer': 'shimmer 2s linear infinite',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'blog-gradient': 'linear-gradient(135deg, #fef7ff 0%, #f0f9ff 25%, #ecfdf5 50%, #fdf4ff 75%, #fff1f2 100%)',
				'glass-emerald': 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 50%, rgba(16, 185, 129, 0.05) 100%)',
				'glass-purple': 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(168, 85, 247, 0.05) 100%)',
				'glass-pink': 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(219, 39, 119, 0.1) 50%, rgba(236, 72, 153, 0.05) 100%)',
				'glass-blue': 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 50%, rgba(59, 130, 246, 0.05) 100%)',
			},
			transitionDuration: {
				'400': '400ms',
				'600': '600ms',
			},
			scale: {
				'102': '1.02',
				'105': '1.05',
				'108': '1.08',
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		// Custom plugin for glass effects
		function({ addUtilities }) {
			const newUtilities = {
				'.glass-card': {
					'backdrop-filter': 'blur(20px)',
					'background': 'rgba(255, 255, 255, 0.8)',
					'border': '1px solid rgba(255, 255, 255, 0.2)',
				},
				'.glass-nav': {
					'backdrop-filter': 'blur(20px)',
					'background': 'rgba(255, 255, 255, 0.9)',
					'border': '1px solid rgba(255, 255, 255, 0.2)',
				},
				'.text-gradient': {
					'background': 'linear-gradient(135deg, #10b981, #a855f7, #ec4899, #3b82f6)',
					'background-clip': 'text',
					'-webkit-background-clip': 'text',
					'-webkit-text-fill-color': 'transparent',
				},
			}
			addUtilities(newUtilities)
		}
	],
} satisfies Config;