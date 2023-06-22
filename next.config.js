/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  //domains who are allow to upload images on this app. 
  images: {
    domains: [
      //from github account
      "avatars.githubusercontent.com",
      //from google account 
      "lh3.googleusercontent.com",
      //cloudinary
      "res.cloudinary.com"
    ]
  }
}

module.exports = nextConfig
