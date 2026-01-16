import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/profile/', '/checkout/', '/tickets/'],
        },
        sitemap: 'https://www.mov33.co.ke/sitemap.xml',
    }
}
