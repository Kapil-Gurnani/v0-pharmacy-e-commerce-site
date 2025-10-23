# Vellacure - Pharmacy E-commerce Site

A modern pharmacy e-commerce platform built with Next.js, featuring product catalog, shopping cart, user authentication, and admin dashboard.

[![Deployed on GitHub Pages](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://yourusername.github.io/v0-pharmacy-e-commerce-site)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)

## Features

- 🏥 **Product Catalog**: Browse medicines and healthcare products
- 🛒 **Shopping Cart**: Add to cart and manage items
- 👤 **User Authentication**: Login/signup with phone number
- 📱 **Admin Dashboard**: Manage products, orders, and analytics
- 📊 **Analytics**: Sales reports and order tracking
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **Icons**: Lucide React

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Push to GitHub**: Push your code to a GitHub repository
2. **Enable GitHub Pages**: 
   - Go to your repository settings
   - Navigate to "Pages" section
   - Set source to "GitHub Actions"
3. **Automatic Deployment**: The site will be automatically deployed when you push to the `main` branch

### Manual Deployment

To deploy manually:

```bash
# Install dependencies
npm install

# Build the application
npm run build

# The static files will be generated in the `out` directory
```

### Configuration

The deployment is configured in:
- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `next.config.mjs` - Next.js configuration for static export
- `package.json` - Build scripts

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── cart/              # Shopping cart
│   ├── products/          # Product pages
│   └── ...
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── auth/             # Authentication components
│   ├── cart/             # Cart components
│   └── ui/               # UI components
├── lib/                  # Utility functions
└── public/               # Static assets
```

## Environment Variables

Create a `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.